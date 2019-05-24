import axios from 'axios';
import { Provider } from 'mobx-react/native';
import React from 'react';
import { AsyncStorage, StyleSheet, View, StatusBar } from 'react-native';
import Store from './mobx/Store';
import AppContainer from './navigation/Navigation';

let token;
(async () => (token = await AsyncStorage.getItem('token')))(); //Этот говнокод для того чтобы не вернулся промис
if (token) {
    axios.defaults.headers = {
        Authorization: 'Bearer ' + token
    };
}
axios.defaults.baseURL = 'https://gruz.bw2api.ru';

export default class App extends React.Component {
    render() {
        return (
            <Provider store={Store}>
                    <AppContainer />
            </Provider>
        );
    }
}
