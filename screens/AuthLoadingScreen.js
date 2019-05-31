import axios from 'axios';
import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native';
import { inject } from 'mobx-react/native';

@inject('store')
class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const { store, navigation } = this.props;

        console.log('AuthLoadingScreen bootstrapAsync');
        const userToken = await AsyncStorage.getItem('token');
        
        console.log('user token: ', userToken);
        const userId = await AsyncStorage.getItem('userId');
        this.props.store.setUserId(userId);
        const filledProfile = await AsyncStorage.getItem('filledProphile');
        //заполнен ли профиль

        let screenNeedToGo = 'Auth';

        if (userToken) {
            axios.defaults.headers = {
                Authorization: 'Bearer ' + userToken
            };

            try {
                await store.getUserInfo();
            } catch (error) {
                // TODO добавить вывод ошибки пользователю
                console.log('Ошибка при получении данных, проверьте подключение к сети');
                return;
            }

            if (store.orderIdOnWork) {
                console.log('User on work, order id:', store.orderIdOnWork);

                try {
                    await store.pullFulfilingOrderInformation();
                } catch (error) {
                    // TODO добавить вывод ошибки пользователю
                    console.log('Ошибка при получении данных о выполняемом заказе, проверьте подключение к сети');
                    return;
                }

                screenNeedToGo = 'OrderDetail';
            } else if (filledProfile) {
                screenNeedToGo = 'App';
            } else {
                screenNeedToGo = 'Main';
            }
        }

        navigation.navigate(screenNeedToGo);
    };

    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle='default' />
            </View>
        );
    }
}

export default AuthLoadingScreen;
