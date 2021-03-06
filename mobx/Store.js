import AsyncStorage from '@react-native-community/async-storage';
import { action, autorun, computed, observable, runInAction } from 'mobx';
import io from 'socket.io-client';
import { URL } from '../constants';
import appVersion from '../utils/appVersion';
import NetworkRequests from './NetworkRequests';

const TAG = '~Store~';

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
    @observable onWork = true;
    @observable orderIdOnWork = '';
    // @observable hasEndedOrder = false;
    @observable userId = '';
    pushToken = '';

    @observable avatar = '';

    @observable phone = '';
    @observable login = '';
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
    @observable passportNumber = '';
    @observable passportSeries = '';
    @observable docStatus = '';
    @observable disabled = false;
    @observable appVersion = null; //{ android: 0, ios: 0 };

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

    @computed get hasEndedOrder() {
        if (this.orderIdOnWork && this.order && this.order.workers.data.length > 0) {
            const workersData = this.order.workers.data;

            let sumEntered = true;
            // проверка на то, указал ли пользователь полученную сумму
            if (!workersData.find((wrkr) => wrkr.id._id == this.userId).sum) {
                sumEntered = false;
            }

            if (this.order.status === 'ended' && sumEntered) {
                return true;
            } else {
                return false;
            }
        }
    }

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

            const requiredFieldsNames = [
                'height',
                'weight',
                'isDriver',
                'docStatus',
                'disabled',
                'login',
                'phoneNum',
                'city',
                'push_token_id',
                'veh_frameType',
                'veh_height',
                'veh_is_open',
                'veh_length',
                'veh_loadingCap',
                'veh_stateCarNumber',
                'veh_width',
                'passportNumber',
                'passportSeries',
                'appVersion',
            ];

            requiredFieldsNames.forEach((fieldName) => {
                this[fieldName] = response.data[fieldName];
            });

            this.balance = (+response.data.balance).toFixed(2);
            this.pushToken = response.data.push_token_id;

            this.orderIdOnWork = response.data.order; // null когда грузчиком не выполняется заказ
            response.data.photos && (this.avatar = URL + response.data.photos.user);

            [this.lastName, this.firstName, this.patronymic] = response.data.name.split(' ');
            [this.city, this.street, this.house, this.flat] = response.data.address.split(' ');
            this.cityId = response.data.city;

            const date = new Date(response.data.birthDate);
            this.birthDate = date;

            if (response.data.photos) {
                const { vehicle0, vehicle1, vehicle2 } = response.data.photos;
                vehicle0 && (this.vehicle0 = URL + response.data.photos.vehicle0);
                vehicle1 && (this.vehicle1 = URL + response.data.photos.vehicle1);
                vehicle2 && (this.vehicle2 = URL + response.data.photos.vehicle2);
            }
        });
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
        console.log('[Store].pullFulfilingOrderInformation() id', id);

        if (!id) {
            id = this.orderIdOnWork;
        } else {
            runInAction(() => {
                this.orderIdOnWork = id;
            });
        }

        const { data: order } = await NetworkRequests.getOrder(id);

        if (order.numberCallToClient) {
            await AsyncStorage.setItem('numberCallToClient', order.numberCallToClient);
        }

        runInAction(() => {
            this.order = order;
            this.lastOrderPullTime = Date.now();
        });

        const PromisePullDispatcher = this.pullDispatcherById(order.creating_dispatcher);
        const PromisePullWorkers = this.setWorkersByArray(order.workers.data, order.workers.thirdPartyWorkers);

        await Promise.all([PromisePullDispatcher, PromisePullWorkers]);
    }

    async addThirdPartyWorkerToOrder() {
        try {
            await NetworkRequests.addThirdPartyWorker(this.userId, this.orderIdOnWork);
        } catch (e) {
            throw e;
        }
    }
    async deleteThirdPartyWorkerToOrder() {
        await NetworkRequests.deleteThirdPartyWorker(this.userId, this.orderIdOnWork);
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

    @action async setOnWork(value) {
        await NetworkRequests.setOnWork(this.userId, value);
        runInAction(() => {
            this.onWork = value;
        });
    }

    @action async setWorkersByArray(workers, thirdPartyWorkers) {
        const mapWorkers = {};

        workers.forEach((worker) => {
            mapWorkers[worker.id._id] = worker.id;
        });

        let workersData = workers.map((worker) => ({
            id: worker.id._id,
            name: worker.id.name,
            phoneNum: worker.id.phoneNum,
            avatar: worker.id.photos ? URL + worker.id.photos.user : null,
            isDriver: worker.id.isDriver,
            stateCarNumber: worker.id.veh_stateCarNumber,
        }));

        const myWorkers = [];
        let index = 0;
        thirdPartyWorkers.forEach((thirdPartyWorker) => {
            const tempThirdPartyWorker = {
                id: thirdPartyWorker.invitedByWorker + '-' + index++,
                invitedByWorker: thirdPartyWorker.invitedByWorker,
                phoneNum: mapWorkers[thirdPartyWorker.invitedByWorker].phoneNum,
                avatar: null,
                name: 'Сторонний грузчик',
                isDriver: false,
            };

            workersData.push(tempThirdPartyWorker);

            if (tempThirdPartyWorker.invitedByWorker === this.userId) {
                tempThirdPartyWorker.name = 'Мой грузчик';
                myWorkers.push(tempThirdPartyWorker);
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

const store = new ObservableStore();

autorun(async () => {
    if (
        store.appVersion &&
        (store.appVersion.android !== appVersion().android || store.appVersion.ios !== appVersion().ios)
    ) {
        await NetworkRequests.setAppVersion(store.userId, appVersion());
    }
    console.log('APP VERSION !', appVersion());
});

export default store;
//userName: response.data.name,
//userType: response.data.isDriver,
//workingStatus: response.data.onWork
