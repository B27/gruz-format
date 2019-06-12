import axios from 'axios';
import { toJS } from 'mobx';
import { inject } from 'mobx-react/native';
import React from 'react';
import { ActivityIndicator, AsyncStorage, PermissionsAndroid, View } from 'react-native';

@inject('store')
class AuthLoadingScreen extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this._bootstrapAsync();
	}

	_bootstrapAsync = async () => {
		const { store, navigation } = this.props;

		console.log('AuthLoadingScreen bootstrapAsync');
		const userToken = await AsyncStorage.getItem('token');

		console.log('user token: ', userToken);
		const userId = await AsyncStorage.getItem('userId');
		this.props.store.setUserId(userId);

		let screenNeedToGo = 'Auth';

		if (userToken) {
			axios.defaults.headers = {
				Authorization: 'Bearer ' + userToken
			};

			try {
				await store.getUserInfo();
			} catch (error) {
				// TODO добавить вывод ошибки пользователю
				console.log('Ошибка при получении данных, проверьте подключение к сети');
				return;
			}

			if (store.orderIdOnWork) {
				console.log('User on work, order id:', store.orderIdOnWork);

				try {
					await store.pullFulfilingOrderInformation();

					const workersData = toJS(store.order).workers.data;

					let sumEntered = true;
					if (!workersData.find(wrkr => wrkr.id._id == userId).sum) {
						sumEntered = false;
					}

					if (store.order.status === 'ended' && sumEntered) {
						screenNeedToGo = 'WaitCompleteOrder';
					} else {
						screenNeedToGo = 'OrderDetail';
					}
				} catch (error) {
					console.log('start  log');
					console.log(error);
					// TODO добавить вывод ошибки пользователю
					console.log('end log');
					console.log('Ошибка при получении данных о выполняемом заказе, проверьте подключение к сети');
					return;
				}
			} else {
				screenNeedToGo = 'Main';
			}
		}

		navigation.navigate(screenNeedToGo);
    };
    
    // requestCameraPermission = async () => {
    //     try {
    //       const granted = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.CAMERA,
    //         {
    //           title: 'Cool Photo App Camera Permission',
    //           message:
    //             'Cool Photo App needs access to your camera ' +
    //             'so you can take awesome pictures.',
    //           buttonNeutral: 'Ask Me Later',
    //           buttonNegative: 'Cancel',
    //           buttonPositive: 'OK',
    //         },
    //       );
    //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //         console.log('You can use the camera');
    //       } else {
    //         console.log('Camera permission denied');
    //       }
    //     } catch (err) {
    //       console.warn(err);
    //     }
    //   }

	render() {
		return (
			<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				<ActivityIndicator size={60} color='#FFC234'/>
				{/* <StatusBar barStyle='default' /> */}
			</View>
		);
	}
}

export default AuthLoadingScreen;
