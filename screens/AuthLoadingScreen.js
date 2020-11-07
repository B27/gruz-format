import AsyncStorage from '@react-native-community/async-storage';
import iid from '@react-native-firebase/iid';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { inject } from 'mobx-react/native';
import React, { Fragment } from 'react';
import { ActivityIndicator, Alert, NativeModules, Platform, Text, TouchableOpacity, View } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { RESULTS } from 'react-native-permissions';
import LoadingButton from '../components/LoadingButton';
import registerForPushNotificationsAsync from '../components/registerForPushNotificationsAsync';
import styles from '../styles';
import { execPendingNotificationListener, prepareNotificationListener } from '../utils/NotificationListener';
import Permissons from '../utils/Permissions';

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
            await Platform.select({
                android: async () => {
                    NativeModules.WorkManager.stopWorkManager();
                    NativeModules.WorkManager.startWorkManager(userToken);
                },
                ios: async () => {
                    await this._requestNotificationsPermission();
                },
            })();
            try {
                await store.getUserInfo();
                registerForPushNotificationsAsync(store.hasPushToken);

                if (store.orderIdOnWork) {
                    console.log(TAG, 'user has an order in work, order id:', store.orderIdOnWork);

                    await store.pullFulfilingOrderInformation();

                    if (store.hasEndedOrder) {
                        screenNeedToGo = 'Main';
                    } else {
                        console.log(TAG, 'start foreground service');
                        await Platform.select({
                            android: async () => {
                                NativeModules.ForegroundTaskModule.stopService();
                                NativeModules.ForegroundTaskModule.startService(userToken, 'В работе');
                            },
                            ios: async () => {
                                await this._startBackgroundGelocation(userId);
                            },
                        })();

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
            await AsyncStorage.clear();
            await Platform.select({
                android: async () => {
                    await NativeModules.RNFirebasePushToken.deleteInstanceId();
                    await NativeModules.ForegroundTaskModule.stopService();
                },
                ios: async () => {
                    await iid().delete();
                    await BackgroundGeolocation.stop();
                    await BackgroundGeolocation.destroyLocations();
                },
            })();
            this.props.navigation.navigate('SignIn');
        } catch (error) {
            this.setState({ error: error.toString() });
        }
    };

    _requestNotificationsPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    };

    _startBackgroundGelocation = async (userId) => {
        try {
            const state = await BackgroundGeolocation.ready({
                elasticityMultiplier: 2,
                url: `${axios.defaults.baseURL}/worker/location/${userId}`,
                logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
                distanceFilter: 250,
                autoSync: true,
                autoSyncThreshold: 0,
                maxRecordsToPersist: 1,
                headers: axios.defaults.headers,
            });
            if (!state.enabled) {
                BackgroundGeolocation.start();
            }
        } catch (error) {
            console.error('error in location', error);
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
