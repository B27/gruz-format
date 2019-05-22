import axios from 'axios';
import { action, observable, runInAction, computed, autorun } from 'mobx';
import { AsyncStorage } from 'react-native';


class ObservableStore {
    @observable balance = '';
    @observable name = '';
    @observable isDriver = false;
    @observable onWork = false;
    @observable.shallow applications = [];
   

    @computed get report() {
        return `Next ${this.balance} ${this.applications}`; 
    }

    @action async updateUserInfo() {
        const userId = await AsyncStorage.getItem('userId');

        try {
            const response = await axios.get(`/worker/${userId}`);
            runInAction(() => {
            //    console.log(`get /worker/${userId} response.data >>>>`, response.data);
                this.balance = response.data.balance;
                this.name = response.data.name;
                this.isDriver = response.data.isDriver;
                this.onWork = response.data.onWork;
            });
        } catch (error) {
            console.log(`get /worker/${userId} error >>>> `, err);
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
