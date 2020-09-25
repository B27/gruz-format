import AsyncStorage from '@react-native-community/async-storage';
import NetworkRequests from '../mobx/NetworkRequests';
import axios from 'axios';
// import { Constants, Location, Notifications, Permissions, TaskManager } from 'expo';
import { inject, observer } from 'mobx-react/native';
import { Observer } from 'mobx-react';
import React from 'react';
import { FlatList, NativeModules, Platform, SafeAreaView, Text, View, YellowBox } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import OrderCard from '../components/OrderCard';
import styles from '../styles';
import showAlert from '../utils/showAlert';

// const LOCATION_TASK_NAME = 'background-location-task';

const TAG = '~MainScreen~';
const pauseBetweenSendGeo = 1000 * 60 * 30;

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
    }

    componentWillUnmount() {
        for (let timeout of this.timeoutsSet) {
            clearTimeout(timeout);
        }
        this.timeoutsSet.clear();
        this.componentIsMount = false;
    }

    _topUpBalance = () => {
        this.props.navigation.navigate('Balance');
    };

    _keyExtractor = (item, index) => ' ' + item._id; // для идентификации каждой строки нужен key типа String

    // _onChangeSwitchValue = async () => {

    //     if (!this.props.store.onWork) {
    //         if (!Platform.OS === 'android') {
    //             console.log('Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
    //         } else {
    //             this.props.store.setOnWork(!this.props.store.onWork);

    //             await NativeModules.ForegroundTaskModule.startService(await AsyncStorage.getItem('token'));
    //             this._onRefresh();
    //         }
    //     } else {
    //         this.props.store.setOnWork(!this.props.store.onWork);
    //         await NativeModules.ForegroundTaskModule.stopService();
    //         this._onRefresh();
    //     }
    // };

    _onPressOrderItemButton = (order) => {
        this.props.navigation.navigate('OrderPreview', { order });
    };

    _onRefresh = async () => {
        //  const {updateUserInfo, getOrders} = this.props.store; так делать нельзя! mobx не сможет отследить вызов функции
        const { store } = this.props;
        try {
            this.setState({ refreshing: true });

            await Promise.all([store.updateUserInfo(), store.getOrders()]);
        } catch (error) {
            console.log(TAG, error);
            if (error.response) {
                this._showErrorMessage(error.response.data.message);
            } else {
                this._showErrorMessage(error.toString());
            }

            await Platform.select({
                android: async () => {
                    await NativeModules.ForegroundTaskModule.stopService();
                },
                ios: async () => {
                    await BackgroundGeolocation.stop();
                    await BackgroundGeolocation.destroyLocations();
                },
            })();
        }

        if (store.orderIdOnWork) {
            this.props.navigation.navigate('AuthLoading');
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
        } else {
            const userToken = await AsyncStorage.getItem('token');
            console.log(TAG, 'user token: ', userToken);
        }
        Platform.select({
            android: () => {
                NativeModules.ForegroundTaskModule.stopService();
            },
            ios: async () => {
                const needSendGeo = await this._checkNeedSendGeolocation();
                if (needSendGeo) {
                    await this._sendGeolocation(store.userId);
                }
            },
        })();
        //console.log('[MainScreen]._onRefresh() store', this.props.store)
    };

    _checkNeedSendGeolocation = async () => {
        const lastSendGeo = await AsyncStorage.getItem('lastSendGeo');
        if (+lastSendGeo + pauseBetweenSendGeo < Date.now()) {
            return true;
        }
        return false;
    };

    _sendGeolocation = async (userId) => {
        try {
            await BackgroundGeolocation.ready({ locationAuthorizationRequest: 'Always' });

            const location = await BackgroundGeolocation.getCurrentPosition({ timeout: 30 });
            // console.log('location recieved', location);

            await NetworkRequests.sendLocation({ location }, userId);
            await AsyncStorage.setItem('lastSendGeo', Date.now().toString());
            await BackgroundGeolocation.stop();
        } catch (error) {
            console.error('error in location', error);
        }
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
                                {store.disabled ? (
                                    <Text style={styles.errorMessage}>Учетная запись неактивна</Text>
                                ) : null}
                                {store.docStatus === 'notUploaded' ? (
                                    <Text style={styles.errorMessage}>Загрузите документы!</Text>
                                ) : store.docStatus === 'updated' ? (
                                    <Text style={styles.notificationMessage}>Ваши документы проверяются</Text>
                                ) : null}
                                {/* <Context.Consumer>
								{value => <Text style={styles.mainFontBalance}>{`${value.balance} руб.`}</Text>}
							</Context.Consumer> */}

                                <Text style={styles.mainFontBalance}>{`${store.balance} руб.`}</Text>

                                <Text style={styles.mainFontTopUpBalance} onPress={this._topUpBalance}>
                                    Пополнить баланс
                                </Text>
                            </View>
                            {/* <View style={styles.mainWorkingItem}>
                            <Text style={styles.drawerFontTopItem}>Работаю</Text>
                            <View>
                                <SwitchToggle switchOn={store.onWork} onPress={this._onChangeSwitchValue} />
                            </View>
                        </View> */}
                        </View>
                    }
                    keyExtractor={this._keyExtractor}
                    data={store.orders.slice().sort((a, b) => a.start_time < b.start_time)} // возможно, эта сортировка когда-то будет работать неправильно
                    renderItem={this._renderItem}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    ListEmptyComponent={<Text style={styles.mainFontUserType}>Нет доступных заявок</Text>}
                    contentInsetAdjustmentBehavior="automatic"
                />
            </>
        );
    }
}

export default MainScreen;
