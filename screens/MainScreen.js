import AsyncStorage from '@react-native-community/async-storage';
import * as Permissions from 'expo-permissions';
// import { Constants, Location, Notifications, Permissions, TaskManager } from 'expo';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { Alert, FlatList, NativeModules, Platform, Text, View, YellowBox } from 'react-native';
import OrderCard from '../components/OrderCard';
import SwitchToggle from '../components/SwitchToggle';
import styles from '../styles';

// const LOCATION_TASK_NAME = 'background-location-task';

const TAG = '~MainScreen~';

YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

@inject('store')
@observer
class MainScreen extends React.Component {
    state = {
        notification: {},
        refreshing: false,
        message: ''
    };

    timeoutsSet = new Set();

    componentDidMount() {
        this.componentIsMount = true;
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

    _onChangeSwitchValue = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            Alert.alert('Внимание', 'Для работы с приложением вам необходимо предоставить доступ к геолокации');
            return;
        }

        if (this.props.store.isDriver && this.props.store.veh_width === '' && !this.props.store.onWork) {
            this._showErrorMessage('Заполните данные об автомобиле');
            return;
        }

        if (this.props.store.balance < 0) {
            this._showErrorMessage('Вы не можете выполнять заказы при отрицательном балансе. Пополните баланс');
            return;
        }

        if (!this.props.store.onWork) {
            if (!Platform.OS === 'android') {
                console.log('Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
            } else {
                this.props.store.setOnWork(!this.props.store.onWork);

                await NativeModules.ForegroundTaskModule.startService(await AsyncStorage.getItem('token'));
                this._onRefresh();
            }
        } else {
            this.props.store.setOnWork(!this.props.store.onWork);
            await NativeModules.ForegroundTaskModule.stopService();
            this._onRefresh();
        }
    };

    _onPressOrderItemButton = order => {
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
            this._showErrorMessage(error.toString());
        }

        if (store.orderIdOnWork) {
            this.props.navigation.navigate('AuthLoading');
        }

        if (this.componentIsMount) {
            this.setState({ refreshing: false });
        }
    };

    _showErrorMessage = message => {
        this.setState({ message: message });
        this.timeoutsSet.add(
            setTimeout(() => {
                this.setState({ message: '' });
            }, 3000)
        );
    };

    _renderItem = ({ item }) => (
        <OrderCard
            order={item}
            time={item.start_time}
            addresses={item.locations}
            description={item.comment}
            cardStyle={styles.cardMargins}
            onPressButton={this._onPressOrderItemButton}
            buttonName='ПРИНЯТЬ'
        />
    );

    render() {
        const { store } = this.props;
        return (
            <FlatList
                ListHeaderComponent={
                    <View>
                        <View style={styles.mainTopBackground}>
                            <Text style={{ color: 'red', textAlign: 'center', fontSize: 16 }}>
                                {this.state.message}
                            </Text>
                            <Text style={styles.mainFontUserName}>{store.name}</Text>
                            <Text style={styles.mainFontUserType}>{store.isDriver ? 'Водитель' : 'Грузчик'}</Text>
                            {/* <Context.Consumer>
								{value => <Text style={styles.mainFontBalance}>{`${value.balance} руб.`}</Text>}
							</Context.Consumer> */}

                            <Text style={styles.mainFontBalance}>{`${store.balance} руб.`}</Text>

                            <Text style={styles.mainFontTopUpBalance} onPress={this._topUpBalance}>
                                Пополнить баланс
                            </Text>
                        </View>
                        <View style={styles.mainWorkingItem}>
                            <Text style={styles.drawerFontTopItem}>Работаю</Text>
                            <View>
                                <SwitchToggle switchOn={store.onWork} onPress={this._onChangeSwitchValue} />
                            </View>
                        </View>
                    </View>
                }
                keyExtractor={this._keyExtractor}
                data={store.orders.slice().sort((a, b) => a.start_time < b.start_time)} // возможно, эта сортировка когда-то будет работать неправильно
                renderItem={this._renderItem}
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
                ListEmptyComponent={<Text style={styles.mainFontUserType}>Нет доступных заявок</Text>}
            />
        );
    }
}

export default MainScreen;
