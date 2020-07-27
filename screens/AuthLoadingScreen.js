import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { toJS } from 'mobx';
import { inject } from 'mobx-react/native';
import React, { Fragment } from 'react';
import { ActivityIndicator, Platform, Text, NativeModules, TouchableOpacity, View, Alert } from 'react-native';
import registerForPushNotificationsAsync from '../components/registerForPushNotificationsAsync';
import LoadingButton from '../components/LoadingButton';
import { prepareNotificationListener, execPendingNotificationListener } from '../utils/NotificationListener';
import styles from '../styles';
import NetworkRequests from '../mobx/NetworkRequests';
import Permissons from '../utils/Permissions';
import { RESULTS } from 'react-native-permissions';

const TAG = '~AuthLoadingScreen~';
@inject('store')
class AuthLoadingScreen extends React.Component {
    state = {
        error: '',
    };

    componentDidMount() {
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const { store, navigation } = this.props;
        console.log(TAG, 'bootstrapAsync');

        this.setState({ error: '' });

        await Platform.select({
            android: async () => {
                const locationPermissionResult = await Permissons.askLocation();
                console.log('locations permission result', locationPermissionResult);

                if (locationPermissionResult !== RESULTS.GRANTED) {
                    Alert.alert('Внимание', 'Для работы с приложением вам необходимо предоставить доступ к геолокации');
                    return;
                }
            },
            ios: async () => {},
        })();
        prepareNotificationListener(navigation);

        const userToken = await AsyncStorage.getItem('token');
        console.log(TAG, 'user token: ', userToken);

        const userId = await AsyncStorage.getItem('userId');
        this.props.store.setUserId(userId);

        let screenNeedToGo = 'Auth';

        if (userToken) {
            axios.defaults.headers = {
                Authorization: 'Bearer ' + userToken,
            };
            Platform.select({
                android: () => {
                    NativeModules.WorkManager.stopWorkManager();
                    NativeModules.WorkManager.startWorkManager(userToken);
                },
                ios: () => {},
            })();
            try {
                await store.getUserInfo();
                registerForPushNotificationsAsync(store.hasPushToken);

                if (store.orderIdOnWork) {
                    console.log(TAG, 'user has an order in work, order id:', store.orderIdOnWork);

                    await store.pullFulfilingOrderInformation();

                    const workersData = toJS(store.order).workers.data;

                    let sumEntered = true;
                    // проверка на то, указал ли пользователь полученную сумму
                    if (!workersData.find((wrkr) => wrkr.id._id == userId).sum) {
                        sumEntered = false;
                    }
                    Platform.select({
                        android: () => {
                            NativeModules.ForegroundTaskModule.stopService();
                            NativeModules.ForegroundTaskModule.startService(userToken, 'В работе');
                        },
                        ios: () => {},
                    })();
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
                    // this.props.navigation.navigate('SignIn');
                    return;
                }
            }
        }

        navigation.navigate(screenNeedToGo);
        execPendingNotificationListener();
    };

    _signOutAsync = async () => {
        try {
            await NativeModules.RNFirebasePushToken.deleteInstanceId();
            await AsyncStorage.clear();
            await Platform.select({
                android: async () => {
                    await NativeModules.ForegroundTaskModule.stopService();
                },
                ios: async () => {},
            })();
            this.props.navigation.navigate('SignIn');
        } catch (error) {
            this.setState({ error: error.toString() });
        }
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
                {this.state.error ? (
                    <Fragment>
                        <Text style={{ textAlign: 'center', fontSize: 16 }}>{this.state.error}</Text>
                        <View style={{ height: 40 }} />
                        <TouchableOpacity style={styles.buttonBottom} onPress={this._bootstrapAsync}>
                            <Text style={styles.text}>Обновить</Text>
                        </TouchableOpacity>
                        <LoadingButton
                            blackText
                            style={[styles.buttonConfirm, { width: styles.buttonConfirm.width * 2 }]}
                            onPress={this._signOutAsync}
                            // eslint-disable-next-line react-native/no-raw-text
                        >
                            Выйти из аккаунта
                        </LoadingButton>
                    </Fragment>
                ) : (
                    <ActivityIndicator size={Platform.OS === 'android' ? 60 : 'large'} color="#FFC234" />
                )}
            </View>
        );
    }
}

export default AuthLoadingScreen;
