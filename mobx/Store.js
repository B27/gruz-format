import axios from 'axios';
import { action, observable, runInAction } from 'mobx';
import { AsyncStorage } from 'react-native';
import { URL } from '../constants'

class ObservableStore {
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
    @observable street = '';
    @observable house = '';
    @observable flat = '';
    @observable birthDate = 'Дата рождения';
    @observable height = '';
    @observable weight = '';

	@action async updateUserInfo() {
		const userId = await AsyncStorage.getItem('userId');
		const result = await axios.get(`/worker/${userId}`).catch(err => {
			console.log('get /worker/:userId error ', err);
		});
		if (result) {
			console.log('get /worker/:userId result.data: ', result.data);
			runInAction(() => {
				this.balance = result.data.balance;
				this.name = result.data.name;
				this.isDriver = result.data.isDriver;
                this.onWork = result.data.onWork;
                this.avatar = URL + result.data.photos.user;
            });
            console.log(this.avatar)
        }
	}

	@action async setOnWork(value) {
        const id = await AsyncStorage.getItem('userId');
        console.log(value);
        
		await axios
			.patch('/worker/' + id, {
				onWork: value
			})
			.catch(err => {
				console.log(err);
            })
            .then((result)=>{
                runInAction(() => {
                    //console.log(result.data.onWork);
                    
                    this.onWork = value;
                });
            });
    }
    @action async getUserInfo(){
        const id = await AsyncStorage.getItem('userId');
        const result = await axios.get(`/worker/${id}`).catch(err => {
			console.log('get /worker/:userId error ', err);
		});
		if (result) {
            console.log('get /worker/:userId result.data: ', result.data);
            const date = new Date(result.data.birthDate);
            
            
			runInAction(() => {
				this.balance = result.data.balance;
				this.name = result.data.name;
				this.isDriver = result.data.isDriver;
                this.onWork = result.data.onWork;
                this.avatar = URL + result.data.photos.user;
                this.phone = result.data.phoneNum;
                this.firstName = result.data.name.split(' ')[0]
                this.lastName = result.data.name.split(' ')[1]
                this.patronymic = result.data.name.split(' ')[2]
                this.city = result.data.address.split(' ')[0];
                this.street = result.data.address.split(' ')[1];
                this.house = result.data.address.split(' ')[2];
                this.flat = result.data.address.split(' ')[3];
                this.birthDate = date;
                this.height = result.data.height;
                this.weight = result.data.weight;
            });
            console.log(date);
            
        }
    }
}

const Store = new ObservableStore();
export default Store;
//userName: result.data.name,
//userType: result.data.isDriver,
//workingStatus: result.data.onWork
