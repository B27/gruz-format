import axios from 'axios';
import { Provider } from 'mobx-react/native';
import React from 'react';
import { AsyncStorage, StyleSheet, View, StatusBar, Text } from 'react-native';
import Store from './mobx/Store';
import AppContainer from './navigation/Navigation';
import { getSocket } from './components/Socket';



let token;
(async () => {
	token = await AsyncStorage.getItem('token');
	if (token) {
		axios.defaults.headers = {
			Authorization: 'Bearer ' + token
		};
	}
	axios.defaults.baseURL = 'https://gruz.bw2api.ru';
})(); //Этот говнокод для того чтобы не вернулся промис

export default class App extends React.Component {
	
	componentWillUnmount() {
		(async () => {
			const socket = await getSocket();
			socket.emit('setWork', false);
		})();
	}
	render() {

		return (
			<Provider store={Store}>
				<AppContainer />
			</Provider>
		);
	}
}
