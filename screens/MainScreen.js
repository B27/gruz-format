import Axios from 'axios';
import { Constants, Location, Notifications, Permissions, TaskManager } from 'expo';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { FlatList, Platform, Text, View, YellowBox } from 'react-native';
import OrderCard from '../components/OrderCard';
import registerForPushNotificationsAsync from '../components/registerForPushNotificationsAsync';
import { getSocket } from '../components/Socket';
import SwitchToggle from '../components/SwitchToggle';
import styles from '../styles';

const LOCATION_TASK_NAME = 'background-location-task';

YellowBox.ignoreWarnings([
	'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

@inject('store')
@observer
class MainScreen extends React.Component {
	state = {
		notification: {},
		workingStatus: false,
		refreshing: false,
		message: ''
	};

	componentDidMount = async () => {
		registerForPushNotificationsAsync();
		this._notificationSubscription = Notifications.addListener(this._handleNotification);
		// await this.props.store.updateUserInfo()
		// await store.getOrders();

		const socket = await getSocket();
		// if (!socket || !socket.connected) {
		//     setTimeout(()=>this.setState({message: 'Нет соединения с сервером'}), 2000)
		// } else this.setState({message: ''})

		this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
			this.setState({ message: '' });
		});
	};

	componentWillUnmount() {
		if (this.willFocusSubscription) {
			this.willFocusSubscription.remove();
		}
    }
    
	_getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				errorMessage: 'Permission to access location was denied'
			});
		}
		//let location = await Location.getCurrentPositionAsync({});

		await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
			accuracy: Location.Accuracy.High
		});
	};

	_handleNotification = async notification => {
		if (notification.origin === 'selected' && notification.data.type === 'accept') {
			const res = await Axios.get(`/order/${notification.data.order_id}`);

			//this.setState({ notification: notification, order: res.data });
			//const data = this.state.notification.data;
			// console.log('origin: ' + this.state.notification.origin);
			// console.log('data: ' + (data && data.order_id));
			this.props.navigation.navigate('OrderPreview', { order: res.data });
		} else if (notification.origin === 'received' && notification.data.type === 'reject') {
			console.log('Заказ отменен');

			this.props.navigation.navigate('AuthLoading');
		} else if (notification.origin === 'received' && notification.data.type === 'kicked') {
			console.log('Вас выпилили из заказа');

			this.props.navigation.navigate('AuthLoading');
		}
		//console.log(notification.origin, notification.data.type);
	};

	// static navigationOptions = ({ navigation }) => ({
	//     headerLeft: <MenuIcon navigationProps={navigation} />,
	//     headerLeftContainerStyle: { paddingLeft: 8 }
	// });

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

	_topUpBalance = () => {
		this.props.navigation.navigate('Balance');
	};

	_keyExtractor = (item, index) => ' ' + item._id; // для идентификации каждой строки нужен key типа String

	_onChangeSwitchValue = async () => {
		if (this.props.store.isDriver && this.props.store.veh_width === '') {
			this.setState({ message: 'Заполните данные об автомобиле' });
		} else {
			if (this.props.store.balance < 0) {
				this.setState({ message: 'Вы не можете выполнять заказы при отрицательном балансе. Пополните баланс' });
			} else {
				if (!this.props.store.onWork) {
					if (Platform.OS === 'android' && !Constants.isDevice) {
						console.log(
							'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
						);
					} else {
						this._getLocationAsync();
					}
				} else {
					TaskManager.unregisterAllTasksAsync();
				}

				console.log('1');

				const socket = await getSocket();

				if (socket && socket.connected) {
					socket.emit('set work', !this.props.store.onWork);
					this.props.store.setOnWork(!this.props.store.onWork);
					this._onRefresh();
				} else {
					this.setState({ message: 'Нет соединения с сервером' });
				}
			}
		}
	};

	_onPressOrderItemButton = order => {
		this.props.navigation.navigate('OrderPreview', { order });
	};

	_onRefresh = async () => {
		//  const {updateUserInfo, getOrders} = this.props.store; так делать нельзя! mobx не сможет отследить вызов функции
		this.setState({ message: '' });
		if (this.props.store.onWork) {
			const { store } = this.props;
			//  this.fetchData();
			this.setState({ refreshing: true });

			const UserInfoPromise = store.updateUserInfo();
			const OrdersPromise = store.getOrders();

			await Promise.all([UserInfoPromise, OrdersPromise]);

			this.setState({ refreshing: false });
		} else {
			await this.props.store.updateUserInfo();
			this.props.store.clearOrders();
		}
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
}

export default MainScreen;
