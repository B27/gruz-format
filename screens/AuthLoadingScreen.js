import AsyncStorage from '@react-native-community/async-storage';
import iid from '@react-native-firebase/iid';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { inject } from 'mobx-react/native';
import React, { Fragment } from 'react';
import { ActivityIndicator, NativeModules, Platform, Text, TouchableOpacity, View } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import LoadingButton from '../components/LoadingButton';
import registerForPushNotificationsAsync from '../components/registerForPushNotificationsAsync';
import styles from '../styles';
import {
    logError,
    logInfo,
    logScreenView,
    logSignOut,
    logUserOnWork,
    setUserIdForFirebase,
} from '../utils/FirebaseAnalyticsLogger';
import { execPendingNotificationListener, prepareNotificationListener } from '../utils/NotificationListener';

const TAG = '~AuthLoadingScreen~';

@inject('store')
class AuthLoadingScreen extends React.Component {
    state = {
        error: '',
    };

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
            logScreenView(TAG);
        });
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const { store, navigation } = this.props;
        console.log(TAG, 'bootstrapAsync');

        this.setState({ error: '' });

        prepareNotificationListener(navigation);

        const userToken = await AsyncStorage.getItem('token');
        // console.log(TAG, 'user token: ', userToken);

        const userId = await AsyncStorage.getItem('userId');
        this.props.store.setUserId(userId);

        let screenNeedToGo = 'Auth';

        if (userToken) {
            axios.defaults.headers = {
                Authorization: 'Bearer ' + userToken,
            };
            await Platform.select({
                android: async () => {},
                ios: async () => {
                    await this._requestNotificationsPermission();
                },
            })();
            try {
                logInfo({ TAG, info: 'pull user info' });
                await store.getUserInfo();
                registerForPushNotificationsAsync(store.pushToken);
                await setUserIdForFirebase({ id: userId });

                if (store.orderIdOnWork) {
                    console.log(TAG, 'user has an order in work, order id:', store.orderIdOnWork);
                    logUserOnWork({ TAG, info: store.orderIdOnWork });

                    await store.pullFulfilingOrderInformation();

                    if (store.hasEndedOrder) {
                        await logInfo({ TAG, info: 'user has ended order' });
                        screenNeedToGo = 'Main';
                    } else {
                        await logInfo({ TAG, info: 'user has active order' });
                        console.log(TAG, 'start foreground service');
                        await this._startBackgroundGelocation(userId, userToken);

                        screenNeedToGo = 'OrderDetail';
                    }
                } else {
                    logInfo({ TAG, info: 'no order go to main screen' });
                    screenNeedToGo = 'Main';
                }
            } catch (error) {
                logError({ TAG, error, info: 'error in AuthLoadingScreen process' });

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
            await logInfo({ TAG, info: 'user sign out' });
            await AsyncStorage.clear();
            await Platform.select({
                android: async () => {
                    await NativeModules.RNFirebasePushToken.deleteInstanceId();
                    await NativeModules.LocationModule.stopSendLocations();
                },
                ios: async () => {
                    await iid().delete();
                    await BackgroundGeolocation.stop();
                    await BackgroundGeolocation.destroyLocations();
                },
            })();

            logSignOut();
            this.props.navigation.navigate('SignIn');
        } catch (error) {
            logError({ TAG, error, info: 'sign out' });
            this.setState({ error: error.toString() });
        }
    };

    _requestNotificationsPermission = async () => {
        const authStatus = await messaging().requestPermission();
        // const enabled =
        //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        logInfo({ TAG, info: `iOS notifications permissions status: ${authStatus}` });
    };

    _startBackgroundGelocation = async (userId, userToken) => {
        await Platform.select({
            android: async () => {
                logInfo({ TAG, info: 'start background geolocation on Android' });
                try {
                    NativeModules.LocationModule.startSendLocations(userToken);
                } catch (error) {
                    logError({ TAG, info: 'start background location Android', error });
                }
            },
            ios: async () => {
                try {
                    logInfo({ TAG, info: 'start background geolocation on iOS' });
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
                    logError({ TAG, info: 'start background location iOS', error });
                }
            },
        })();
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
