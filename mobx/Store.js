import AsyncStorage from '@react-native-community/async-storage';
import {action, observable, runInAction} from 'mobx';
import io from 'socket.io-client';
import {URL} from '../constants';
import NetworkRequests from './NetworkRequests';

const TAG = '~Store.js~';

class ObservableStore {
    lastOrderPullTime = null;
    @observable.shallow orders = [];
    @observable.shallow workers = [];
    @observable order = null;
    @observable.shallow thirdPartyWorkers = [];
    @observable.shallow myThirdPartyWorkers = [];
    @observable dispatcher = null;

    @observable balance = '';
    @observable name = '';
    @observable isDriver = false;
    @observable onWork = false;
    @observable orderIdOnWork = '';
    @observable userId = '';
    @observable hasPushToken = false;

    @observable avatar = '';

    @observable phone = '';
    @observable firstName = '';
    @observable lastName = '';
    @observable patronymic = '';
    @observable city = '';
    @observable cityId = '';
    @observable street = '';
    @observable house = '';
    @observable flat = '';
    @observable birthDate = 'Дата рождения';
    @observable height = '';
    @observable weight = '';

    @observable veh_is_open = false;
    @observable veh_height = '';
    @observable veh_width = '';
    @observable veh_length = '';
    @observable veh_loadingCap = '';
    @observable veh_frameType = '';
    @observable veh_stateCarNumber = '';
    @observable vehicle0 = '';
    @observable vehicle1 = '';
    @observable vehicle2 = '';
    @observable refreshImage = Number(new Date());

    @observable socketChat = undefined;
    @observable chatHistory = [];

    @action async updateUserInfo() {
        const userId = await AsyncStorage.getItem('userId');

        const response = await NetworkRequests.getWorker(userId);

        runInAction(() => {
            //console.log(`get /worker/${userId} response.data >>>>`, response.data);
            this.balance = (+response.data.balance).toFixed(2);
            this.name = response.data.name;
            this.disabled = response.data.disabled;
            this.isDriver = response.data.isDriver;
            this.orderIdOnWork = response.data.order;
            this.docStatus = response.data.docStatus;
            this.hasPushToken = !!response.data.push_token_id;
            //this.onWork = response.data.onWork;
            response.data.photos && (this.avatar = URL + response.data.photos.user);
            console.log('avatar ', this.avatar);
        });
    }

    @action async setUserId(userId) {
        runInAction(() => {
            this.userId = userId;
        });
    }

    @action async getUserInfo() {
        const userId = await AsyncStorage.getItem('userId');

        const response = await NetworkRequests.getWorker(userId);

        runInAction(() => {
            // console.log(`get /worker/${userId} response.data >>>>`, response.data);
            const date = new Date(response.data.birthDate);

            for (let key in response.data) this[key] = response.data[key];
            this.balance = (+response.data.balance).toFixed(2);

            // this.balance = response.data.balance;
            // this.name = response.data.name;
            // this.isDriver = response.data.isDriver;
            // this.onWork = response.data.onWork; // на данный момент всегда false, необходимо смотреть response.data.order
            this.orderIdOnWork = response.data.order; // null когда грузчиком не выполняется заказ
            response.data.photos && (this.avatar = URL + response.data.photos.user);

            this.phone = response.data.phoneNum;
            [this.lastName, this.firstName, this.patronymic] = response.data.name.split(' ');
            [this.city, this.street, this.house, this.flat] = response.data.address.split(' ');
            this.cityId = response.data.city;
            this.birthDate = date;

            if (response.data.photos) {
                const { vehicle0, vehicle1, vehicle2 } = response.data.photos;
                vehicle0 && (this.vehicle0 = URL + response.data.photos.vehicle0);
                vehicle1 && (this.vehicle1 = URL + response.data.photos.vehicle1);
                vehicle2 && (this.vehicle2 = URL + response.data.photos.vehicle2);
            }


            this.veh_stateCarNumber = response.data.veh_stateCarNumber;
            this.passportNumber = response.data.passportNumber;
            this.passportSeries = response.data.passportSeries;
            this.docStatus = response.data.docStatus;
            this.hasPushToken = !!response.data.push_token_id;
            // this.height = response.data.height;
            // this.weight = response.data.weight;

            // this.veh_is_open = response.data.veh_is_open;
            // this.veh_height = response.data.veh_height;
            // this.veh_width = response.data.veh_width;
            // this.veh_length = response.data.veh_length;
            // this.veh_loadingCap = response.data.veh_loadingCap;
            // this.veh_frameType = response.data.veh_frameType;

            // console.log('User Info >>>> ', response.data);
        });
    }

    @action async setOnWork(value) {
        this.onWork = value;
    }

    @action async getOrders() {
        const response = await NetworkRequests.getOpenOrders();

        runInAction(() => {
            this.orders = response.data;
        });
    }

    @action async clearOrders() {
        runInAction(() => {
            this.orders = [];
        });
    }

    @action async startChatSocket(order_id) {
        if (this.socketChat === undefined) {
            const token = await AsyncStorage.getItem('token');
            console.log(token);

            if (token) {
                runInAction(() => {
                    this.socketChat = io(URL + '/chat', { query: { token, order_id } });
                });
            }
        }
    }

    @action async addChatMessage(message) {
        runInAction(() => {
            console.log('[MESASAGE]', message);
            this.chatHistory = [message, ...this.chatHistory];
        });
    }

    @action async pullFulfilingOrderInformation(id) {


        console.log('[Store].pullFulfilingOrderInformation() id', id)

        if (!id) {
            id = this.orderIdOnWork;
        } else {
            runInAction(() => {
                this.orderIdOnWork = id;
            });
        }

        const { data: order } = await NetworkRequests.getOrder(id);

        runInAction(() => {
            this.order = order;
            this.lastOrderPullTime = Date.now();
        });

        const PromisePullDispatcher = this.pullDispatcherById(order.creating_dispatcher);
        const PromisePullWorkers = this.setWorkersByArray(order.workers.data, order.workers.thirdPartyWorkers);


        await Promise.all([PromisePullDispatcher, PromisePullWorkers]);
    }

    async addThirdPartyWorkerToOrder(){
        try {
            await NetworkRequests.addThirdPartyWorker(this.userId, this.orderIdOnWork)
        } catch (e) {
            throw e
        }

    }
    async deleteThirdPartyWorkerToOrder(){
         await NetworkRequests.deleteThirdPartyWorker(this.userId, this.orderIdOnWork)
    }


    async startFulfillingOrder(id) {
        await NetworkRequests.startOrder(id);

        await this.pullFulfilingOrderInformation(id);
    }

    async cancelFulfillingOrder() {
        await NetworkRequests.cancelOrder();
    }

    @action async pullDispatcherById(id) {
        const response = await NetworkRequests.getDispatcher(id);
        runInAction(() => {
            this.dispatcher = response.data;
        });
    }

    @action async setWorkersByArray(workers, thirdPartyWorkers) {

        const mapWorkers = {}

        workers.forEach(worker => {
            mapWorkers[worker.id._id] = worker.id
        })

        let workersData = workers.map(worker => {
            if (worker.id.photos) {
                return {
                    id: worker.id._id,
                    name: worker.id.name,
                    phoneNum: worker.id.phoneNum,
                    avatar: URL + worker.id.photos.user,
                    isDriver: worker.id.isDriver,
                };
            } else {
                return {
                    id: worker.id._id,
                    name: worker.id.name,
                    phoneNum: worker.id.phoneNum,
                    avatar: null,
                    isDriver: worker.id.isDriver,
                };
            }
        });


        const myWorkers = []
        let index = 0
        thirdPartyWorkers.forEach(thirdPartyWorker => {
            const tempThirdPartyWorker = {
                id: thirdPartyWorker.invitedByWorker+'-'+index++,
                invitedByWorker: thirdPartyWorker.invitedByWorker,
                phoneNum: mapWorkers[thirdPartyWorker.invitedByWorker].phoneNum,
                avatar: null,
                name: 'Сторонний грузчик',
                isDriver: false,
            };

            workersData.push(tempThirdPartyWorker)

            if(tempThirdPartyWorker.invitedByWorker === this.userId){
                tempThirdPartyWorker.name = 'Мой грузчик'
                myWorkers.push(tempThirdPartyWorker)
            }
        });


        runInAction(() => {
            this.workers = workersData;
            this.myThirdPartyWorkers = myWorkers;
        });
    }



    @action async refreshImages() {
        runInAction(() => {
            this.refreshImage = this.refreshImage + 1;
        });
        console.log('refresh Image: ' + this.refreshImage);
    }
}

const Store = new ObservableStore();

export default Store;
//userName: response.data.name,
//userType: response.data.isDriver,
//workingStatus: response.data.onWork
