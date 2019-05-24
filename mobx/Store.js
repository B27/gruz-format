import axios from 'axios';
import { action, observable, runInAction, computed, autorun } from 'mobx';
import { AsyncStorage } from 'react-native';
import io from 'socket.io-client';
import { URL } from '../constants';

class ObservableStore {
	@observable.shallow orders = [];

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

	@observable socketChat = undefined;

	@action async updateUserInfo() {
		const userId = await AsyncStorage.getItem('userId');

		try {
			const response = await axios.get(`/worker/${userId}`);

			runInAction(() => {
				//     console.log(`get /worker/${userId} response.data >>>>`, response.data);
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
				this.firstName = response.data.name.split(' ')[1];
				this.lastName = response.data.name.split(' ')[0];
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
		this.onWork = value;
	}

	@action async getOrders() {
		try {
			const response = await axios.get(`order/open/60/1`);
			this.orders = response.data;

			runInAction(() => {
				console.log('get order/open/60/1 response.data >>>> ', response.data);
				//  console.log('this.orders', this.orders);
				//  console.log('this.balance', this.balance);

				this.orders = response.data;
			});
		} catch (error) {
			console.log('get order/open/60/1 error >>>> ', error);
		}
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
}

const Store = new ObservableStore();

export default Store;
//userName: response.data.name,
//userType: response.data.isDriver,
//workingStatus: response.data.onWork
