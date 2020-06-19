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
import { PERMISSIONS, checkMultiple, requestMultiple, RESULTS } from 'react-native-permissions';

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

        let permissionsGranted = true;

        switch (Platform.OS) {
            case 'android':
                const requiredPermissions = [
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
                    PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
                ];

                let statuses;
                try {
                    statuses = await checkMultiple(requiredPermissions);
                } catch (error) {
                    console.log(TAG, 'error while check permissions');
                }

                let permissionsForRequest = [];
                requiredPermissions.forEach(permission => {
                    if (statuses[permission] !== RESULTS.UNAVAILABLE && statuses[permission] !== RESULTS.GRANTED) {
                        permissionsGranted = false;
                        permissionsForRequest.push(permission);
                    }
                });

                if (permissionsForRequest.length > 0) {
                    try {
                        statuses = await requestMultiple(permissionsForRequest);
                    } catch (error) {
                        console.log(TAG, 'error in request multiple permissions', error);
                        this.setState({ error: 'Ошибка при запросе разрешений' });
                        return;
                    }
                }
                break;

            case 'ios':
                break;
        }

        if (!permissionsGranted) {
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
                Authorization: 'Bearer ' + userToken,
            };
            NativeModules.WorkManager.stopWorkManager();
            NativeModules.WorkManager.startWorkManager(userToken);
            try {
                await store.getUserInfo();
                registerForPushNotificationsAsync(store.hasPushToken);

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
                    NativeModules.ForegroundTaskModule.startService(userToken, 'В работе');
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
            await NativeModules.ForegroundTaskModule.stopService();
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
                    <ActivityIndicator size={60} color="#FFC234" />
                )}
            </View>
        );
    }
}

export default AuthLoadingScreen;
