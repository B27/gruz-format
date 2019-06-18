import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { toJS } from 'mobx';
import { inject } from 'mobx-react/native';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { setNavigationToNotifListener } from '../utils/NotificationListener';

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

        setNavigationToNotifListener(navigation);
        
        console.log('AuthLoadingScreen bootstrapAsync');
        const userToken = await AsyncStorage.getItem('token');

        console.log('user token: ', userToken);
        const userId = await AsyncStorage.getItem('userId');
        this.props.store.setUserId(userId);

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

                    const workersData = toJS(store.order).workers.data;

                    let sumEntered = true;
                    if (!workersData.find(wrkr => wrkr.id._id == userId).sum) {
                        sumEntered = false;
                    }

                    if (store.order.status === 'ended' && sumEntered) {
                        screenNeedToGo = 'WaitCompleteOrder';
                    } else {
                        screenNeedToGo = 'OrderDetail';
                    }
                } catch (error) {
                    console.log('start  log');
                    console.log(error);
                    // TODO добавить вывод ошибки пользователю
                    console.log('end log');
                    console.log('Ошибка при получении данных о выполняемом заказе, проверьте подключение к сети');
                    return;
                }
            } else {
                screenNeedToGo = 'Main';
            }
        }

        navigation.navigate(screenNeedToGo);
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size={60} color='#FFC234' />
                {/* <StatusBar barStyle='default' /> */}
            </View>
        );
    }
}

export default AuthLoadingScreen;
