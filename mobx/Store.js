import axios from 'axios';
import { action, observable, runInAction, computed, autorun } from 'mobx';
import { AsyncStorage } from 'react-native';
import { URL } from '../constants';

class ObservableStore {
    @observable.shallow applications = [];

    @observable balance = '';
    @observable name = '';
    @observable isDriver = false;
    @observable onWork = false;

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

    @computed get report() {
        return `Next ${this.balance} ${this.applications}`;
    }

    @action async updateUserInfo() {
        const userId = await AsyncStorage.getItem('userId');

        try {
            const response = await axios.get(`/worker/${userId}`);

            runInAction(() => {
                console.log(`get /worker/${userId} response.data >>>>`, response.data);
                this.balance = response.data.balance;
                this.name = response.data.name;
                this.isDriver = response.data.isDriver;
                this.onWork = response.data.onWork;
                this.avatar = URL + response.data.photos.user;
                console.log('avatar ', this.avatar);
            });
        } catch (error) {
            console.log(`get /worker/${userId} error >>>> `, error);
        }
    }

    @action async getUserInfo() {
        const userId = await AsyncStorage.getItem('userId');

        try {
            const response = await axios.get(`/worker/${userId}`);

            runInAction(() => {
                console.log(`get /worker/${userId} response.data >>>>`, response.data);
                const date = new Date(response.data.birthDate);

                this.balance = response.data.balance;
                this.name = response.data.name;
                this.isDriver = response.data.isDriver;
                this.onWork = response.data.onWork;
                this.avatar = URL + response.data.photos.user;
                this.phone = response.data.phoneNum;
                this.firstName = response.data.name.split(' ')[0];
                this.lastName = response.data.name.split(' ')[1];
                this.patronymic = response.data.name.split(' ')[2];
                this.city = response.data.address.split(' ')[0];
                this.cityId = response.data.city;
                this.street = response.data.address.split(' ')[1];
                this.house = response.data.address.split(' ')[2];
                this.flat = response.data.address.split(' ')[3];
                this.birthDate = date;
                this.height = response.data.height;
                this.weight = response.data.weight;

                console.log('date in store >>>> ', date);
            });
        } catch (error) {
            console.log(`get /worker/${userId} error >>>> `, error);
        }
    }

    @action async setOnWork(value) {
        const userId = await AsyncStorage.getItem('userId');
        console.log(`>>>> call store.setOnWork(${value})`);

        try {
            const response = await axios.patch(`/worker/${userId}`, {
                onWork: value
            });

            runInAction(() => {
                //console.log(response.data.onWork);
                this.onWork = value;
            });
        } catch (error) {
            console.log(`patch /worker/${userId} { onWork: ${value} } error >>>> `, error);
        }
    }

    @action async getApplications() {
        try {
            const response = await axios.get(`order/open/60/1`);
            this.applications = response.data;

            runInAction(() => {
                //     console.log('get order/open/60/1 response.data >>>> ', response.data);
                //  console.log('this.applications', this.applications);
                //  console.log('this.balance', this.balance);

                this.applications = response.data;
            });
        } catch (error) {
            console.log('get order/open/60/1 error >>>> ', error);
        }
    }
}

const Store = new ObservableStore();

autorun(() => console.log(Store.report));
export default Store;
//userName: response.data.name,
//userType: response.data.isDriver,
//workingStatus: response.data.onWork
