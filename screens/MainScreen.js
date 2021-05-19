import AsyncStorage from '@react-native-community/async-storage';
import { autorun } from 'mobx';
// import { Constants, Location, Notifications, Permissions, TaskManager } from 'expo';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { FlatList, NativeModules, Platform, Text, View, YellowBox } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import DefaultPreference from 'react-native-default-preference';
import { checkMultiple, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import OrderCard from '../components/OrderCard';
import NetworkRequests from '../mobx/NetworkRequests';
import styles from '../styles';
import { logButtonPress, logError, logInfo, logOrdersViews, logScreenView } from '../utils/FirebaseAnalyticsLogger';
import * as NotificationListener from '../utils/NotificationListener';
import showAlert from '../utils/showAlert';

// const LOCATION_TASK_NAME = 'background-location-task';

const TAG = '~MainScreen~';
const PAUSE_BETWEEN_SEND_LOCATION = 1000 * 60 * 30;

YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
]);

@inject('store')
@observer
class MainScreen extends React.Component {
    state = {
        notification: {},
        refreshing: false,
        message: '',
    };

    static navigationOptions = {
        headerTintColor: 'black',
    };

    showMessageAboutActivation = true;

    timeoutsSet = new Set();

    componentDidMount() {
        this.componentIsMount = true;
        this._onRefresh();
        NotificationListener.setRefreshCallback(this._onRefresh);
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
            logScreenView(TAG);
            // окно с информацией об активации диспетчером перекрывает
            // окно с раскрытием информации об разрешениях
            if (!this.props.store.disabled) {
                if (Platform.OS === 'android') {
                    this._checkAndroidLocationPermissions();
                }
            }
        });
        this.disposeAutorun = autorun(() => {
            const ordersIds = this.props.store.orders
                .slice()
                .sort((a, b) => a.start_time < b.start_time)
                .map((order) => ({ item_name: order.start_time, item_list_id: order._id, item_id: order._id }));
            logOrdersViews({ TAG, ids: ordersIds });
        });
    }

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
        for (let timeout of this.timeoutsSet) {
            clearTimeout(timeout);
        }
        this.timeoutsSet.clear();
        this.componentIsMount = false;
        NotificationListener.setRefreshCallback(null);
        if (this.disposeAutorun) {
            this.disposeAutorun();
        }
    }

    async _checkAndroidLocationPermissions() {
        const isInfoDisclosureShown = await DefaultPreference.get('isInfoDisclosureShown');
        const results = await checkMultiple([
            PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ]);

        const locationGranted =
            results[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED &&
            (results[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION] === RESULTS.UNAVAILABLE ||
                results[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION] === RESULTS.GRANTED);

        if (locationGranted) {
            return;
        }

        if (!isInfoDisclosureShown) {
            showAlert(
                '',
                'Чтобы поддерживать работу функции контроля за выполнением принятого заказа приложение собирает данные о местоположении, даже когда приложение закрыто или не используется',
                {
                    cancelable: true,
                    okFn: async () => {
                        await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
                        await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION, {
                            title: 'Внимание',
                            message: 'Необходимо разрешить доступ к гелокации в любом режиме',
                        });
                        await DefaultPreference.set('isInfoDisclosureShown', 'y');
                    },
                },
            );
        } else {
            await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION, {
                title: 'Внимание',
                message: 'Необходимо разрешить доступ к местоположению в любом режиме',
            });
        }
    }

    _topUpBalance = () => {
        this.props.navigation.navigate('Balance');
    };

    _keyExtractor = (item, index) => ' ' + item._id; // для идентификации каждой строки нужен key типа String

    _onPressOrderItemButton = (order) => {
        logButtonPress({ TAG, info: 'goToOrderPreview', data: order._id });
        this.props.navigation.navigate('OrderPreview', { order });
    };

    _onRefresh = async () => {
        //  const {updateUserInfo, getOrders} = this.props.store; так делать нельзя! mobx не сможет отследить вызов функции
        const { store } = this.props;
        try {
            await logInfo({ TAG, info: 'refresh orders list' });
            this.setState({ refreshing: true });

            await Promise.all([store.updateUserInfo(), store.getOrders()]);
        } catch (error) {
            logError({ TAG, error, info: 'refresh orders list' });
            if (error.response) {
                this._showErrorMessage(error.response.data.message);
            } else {
                this._showErrorMessage(error.toString());
            }

            await Platform.select({
                android: async () => {
                    await NativeModules.LocationModule.stopSendLocations();
                },
                ios: async () => {
                    await BackgroundGeolocation.stop();
                    await BackgroundGeolocation.destroyLocations();
                },
            })();
        }

        if (store.orderIdOnWork) {
            await logInfo({ TAG, info: `on refresh detect then user has order ${store.orderIdOnWork}` });
            await store.pullFulfilingOrderInformation();
        }

        if (this.componentIsMount) {
            this.setState({ refreshing: false });
        }
        if (store.disabled) {
            if (this.showMessageAboutActivation) {
                showAlert(
                    'Учетная запись неактивна',
                    'Дождитесь когда диспетчер подтвердит ваши данные.\n' +
                        'Если вы не получаете ответ слишком долго - свяжитесь с дипетчером',
                );
                this.showMessageAboutActivation = false;
            }
        }

        const needSendGeo = await this._checkNeedSendGeolocation();
        if (needSendGeo) {
            await this._sendGeolocationOnce(store.userId);
        }
    };

    _checkNeedSendGeolocation = async () => {
        const lastSendGeo = await AsyncStorage.getItem('lastSendGeo');
        if (+lastSendGeo + PAUSE_BETWEEN_SEND_LOCATION < Date.now()) {
            return true;
        }
        return false;
    };

    _sendGeolocationOnce = async (userId) => {
        await Platform.select({
            android: async () => {
                try {
                    logInfo({ TAG, info: 'send geo on Android once' });
                    const token = await AsyncStorage.getItem('token');
                    await NativeModules.LocationModule.sendOneLocation(token);
                } catch (error) {
                    logError({ TAG, error, info: 'send geo on Android once' });
                }
            },
            ios: async () => {
                try {
                    logInfo({ TAG, info: 'send geo on iOS once' });
                    await BackgroundGeolocation.ready({ locationAuthorizationRequest: 'Always' });

                    const location = await BackgroundGeolocation.getCurrentPosition({ timeout: 30 });
                    // console.log('location recieved', location);

                    await NetworkRequests.sendLocation({ location }, userId);
                    await AsyncStorage.setItem('lastSendGeo', Date.now().toString());
                    await BackgroundGeolocation.stop();
                } catch (error) {
                    logError({ TAG, error, info: 'send geo on iOS once' });
                }
            },
        })();
    };

    _showErrorMessage = (message) => {
        this.setState({ message: message });
        this.timeoutsSet.add(
            setTimeout(() => {
                this.setState({ message: '' });
            }, 3000),
        );
    };

    _renderItem = ({ item }) => {
        let orderType = '';
        if (item) {
            if (item.need_loaders && item.need_driver) {
                orderType = `Водитель и ${item.loaders_count} грузчика`;
            } else if (item.need_loaders) {
                orderType = `Только ${item.loaders_count} ГРУЗЧИКА`;
            } else if (item.need_driver) {
                orderType = `Только ВОДИТЕЛЬ`;
            }
        }
        return (
            <OrderCard
                order={item}
                orderType={orderType}
                time={item.start_time}
                addresses={item.locations}
                description={item.comment}
                cardStyle={styles.cardMargins}
                onPressButton={this._onPressOrderItemButton}
                buttonName="ПРИНЯТЬ"
            />
        );
    };

    render() {
        const { store } = this.props;
        const orders = store.orders.slice().sort((a, b) => a.start_time < b.start_time); // возможно, эта сортировка когда-то будет работать неправильно

        return (
            // <SafeAreaView style={{ backgroundColor: 'red' }}>
            <>
                <FlatList
                    ListHeaderComponent={
                        <View>
                            <View style={styles.mainTopBackground}>
                                <Text style={styles.errorMessage}>{this.state.message}</Text>
                                <Text style={styles.mainFontUserName}>{store.name}</Text>
                                <Text style={styles.mainFontUserType}>{store.isDriver ? 'Водитель' : 'Грузчик'}</Text>
                                {!store.onWork && (
                                    <Text style={styles.errorMessage}>Уведомления о новых заказах отключены</Text>
                                )}
                                {store.isDriver || !!store.weight || (
                                    <Text style={styles.errorMessage}>Не указан вес</Text>
                                )}
                                {store.disabled && <Text style={styles.errorMessage}>Учетная запись неактивна</Text>}
                                {store.docStatus === 'notUploaded' ? (
                                    <Text style={styles.infoMessage}>Загрузите документы!</Text>
                                ) : store.docStatus === 'updated' ? (
                                    <Text style={styles.notificationMessage}>Ваши документы проверяются</Text>
                                ) : null}
                                {store.hasEndedOrder && (
                                    <Text style={styles.errorMessage}>
                                        {'Ожидайте завершения заказа диспетчером и списания комиссии\n' +
                                            'Баланс можно пополнить сейчас'}
                                    </Text>
                                )}
                                {/* <Context.Consumer>
								{value => <Text style={styles.mainFontBalance}>{`${value.balance} руб.`}</Text>}
							</Context.Consumer> */}

                                <Text style={styles.mainFontBalance}>{`${store.balance} руб.`}</Text>

                                <Text style={styles.mainFontTopUpBalance} onPress={this._topUpBalance}>
                                    Пополнить баланс
                                </Text>
                            </View>
                        </View>
                    }
                    keyExtractor={this._keyExtractor}
                    data={orders}
                    renderItem={this._renderItem}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    ListEmptyComponent={
                        +store.balance >= 0 ? (
                            <Text style={styles.mainFontUserType}>Нет доступных заявок</Text>
                        ) : (
                            <Text style={styles.needUpBalance}>Для принятия заявок необходимо пополнить баланс</Text>
                        )
                    }
                    contentInsetAdjustmentBehavior="automatic"
                />
            </>
        );
    }
}

export default MainScreen;
