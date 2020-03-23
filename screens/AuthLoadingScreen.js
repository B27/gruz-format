import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { toJS } from 'mobx';
import { inject } from 'mobx-react/native';
import React, { Fragment } from 'react';
import { ActivityIndicator, Text, NativeModules, TouchableOpacity, View, Alert } from 'react-native';
import registerForPushNotificationAsync from '../components/registerForPushNotificationsAsync';
import { prepareNotificationListener } from '../utils/NotificationListener';
import styles from '../styles';
import NetworkRequests from '../mobx/NetworkRequests';
import * as Permissions from 'expo-permissions';

const TAG = '~AuthLoadingScreen~';
@inject('store')
class AuthLoadingScreen extends React.Component {
    state = {
        error: ''
    };

    componentDidMount() {
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const { store, navigation } = this.props;
        console.log(TAG, 'bootstrapAsync');

        this.setState({ error: '' });
        const { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            Alert.alert('Внимание', 'Для работы с приложением вам необходимо предоставить доступ к геолокации');
            return;
        }
        prepareNotificationListener(navigation);

        const userToken = await AsyncStorage.getItem('token');
        console.log(TAG, 'user token: ', userToken);

        const userId = await AsyncStorage.getItem('userId');
        this.props.store.setUserId(userId);

        let screenNeedToGo = 'Auth';

        if (userToken) {
            axios.defaults.headers = {
                Authorization: 'Bearer ' + userToken
            };
            NativeModules.WorkManager.stopWorkManager();
            NativeModules.WorkManager.startWorkManager(userToken);
            try {
                await Promise.all([registerForPushNotificationAsync(), store.getUserInfo()]);

                if (store.orderIdOnWork) {
                    console.log(TAG, 'user has an order in work, order id:', store.orderIdOnWork);



                    await store.pullFulfilingOrderInformation();

                    const workersData = toJS(store.order).workers.data;

                    let sumEntered = true;
                    // проверка на то, указал ли пользователь полученную сумму
                    if (!workersData.find(wrkr => wrkr.id._id == userId).sum) {
                        sumEntered = false;
                    }
                    NativeModules.ForegroundTaskModule.stopService();
                    NativeModules.ForegroundTaskModule.startService(userToken, "В работе");
                    if (store.order.status === 'ended' && sumEntered) {

                        screenNeedToGo = 'WaitCompleteOrder';
                    } else {
                        console.log(TAG, 'start foreground service');

                        screenNeedToGo = 'OrderDetail';
                    }
                } else {
                    screenNeedToGo = 'Main';
                }
            } catch (error) {
                console.log(TAG, error);

                if (error === 'Ошибка 403,  Not authorized') {
                    screenNeedToGo = 'SignIn';
                } else {
                    this.setState({ error: error.toString() });
                    this.props.navigation.navigate('SignIn');
                    return;
                }
            }
        }

        navigation.navigate(screenNeedToGo);
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {this.state.error ? (
                    <Fragment>
                        <Text style={{ textAlign: 'center', fontSize: 16 }}>{this.state.error}</Text>
                        <TouchableOpacity style={styles.buttonBottom} onPress={this._bootstrapAsync}>
                            <Text style={styles.text}>Обновить</Text>
                        </TouchableOpacity>
                    </Fragment>
                ) : (
                        <ActivityIndicator size={60} color='#FFC234' />
                    )}
            </View>
        );
    }
}

export default AuthLoadingScreen;
