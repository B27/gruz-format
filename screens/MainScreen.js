import AsyncStorage from '@react-native-community/async-storage';

// import { Constants, Location, Notifications, Permissions, TaskManager } from 'expo';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { Alert, FlatList, NativeModules, Platform, Text, View, YellowBox, SafeAreaView } from 'react-native';
import OrderCard from '../components/OrderCard';
import SwitchToggle from '../components/SwitchToggle';
import styles from '../styles';
import showAlert from '../utils/showAlert';

// const LOCATION_TASK_NAME = 'background-location-task';

const TAG = '~MainScreen~';

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
            if (store.onWork) {
                //  this.fetchData();
                this.setState({ refreshing: true });

                await Promise.all([store.updateUserInfo(), store.getOrders()]);
            } else {
                await store.updateUserInfo();
                store.clearOrders();
            }
        } catch (error) {
            console.log(TAG, error);
            if (error.response) {
                this._showErrorMessage(error.response.data.message);
            } else {
                this._showErrorMessage(error.toString());
            }

            this.props.store.setOnWork(!this.props.store.onWork);
            await Platform.select({
                android: async () => {
                    await NativeModules.ForegroundTaskModule.stopService();
                },
                ios: async () => {},
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
            ios: () => {},
        })();
        //console.log('[MainScreen]._onRefresh() store', this.props.store)
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
                    ListFooterComponent={<SafeAreaView />}
                />
            </>
        );
    }
}

export default MainScreen;
