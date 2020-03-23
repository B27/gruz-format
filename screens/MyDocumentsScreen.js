import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React from 'react';
import { CheckBox, Keyboard, Linking, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LoadingButton from '../components/LoadingButton';
import LocalImage from '../components/LocalImage';
import NumericInput from '../components/NumericInput';
import styles from '../styles';
import ChoiceCameraRoll from './modals/ChoiceCameraRoll';
const TAG = '~SignUpDocumentsScreen~';
import showAlert from '../utils/showAlert';
import {inject, observer} from "mobx-react/native";
import {privacyPolicyURL} from "../constants";

@inject('store')
@observer
class MyDocumentsScreen extends React.Component {
	state = {
		choiceModalVisible: false,
		firstPageUri: require('../images/unknown.png'),
		secondPageUri: require('../images/unknown.png'),
		firstPage: true,
		passportNumber: '',
		passportSeries: '',
		message: null,
		policy: false,
		policyURL: privacyPolicyURL
	};
	static navigationOptions = {
		title: 'Регистрация',
		headerLeft: null,
		headerTitleStyle: {
			textAlign: 'center',
			flexGrow: 1,
			alignSelf: 'center'
		}
	};
	componentDidMount() {
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			Keyboard.dismiss();
		});

		this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
			(async () => {
				try {
					await this.props.store.getUserInfo();
					//await CacheManager.clearCache();
					this.setState({ ...this.props.store, message: '' });
					console.log('[MyDocumentsScreen].componentDidMount() this.state', this.state)
				} catch (error) {
					// TODO добавить вывод ошибки пользователю
					console.log(error);
					console.log('Ошибка при получении новых данных, проверьте подключение к сети');
					return;
				}


			})();

		});


		this.setState(this.props.store);

		console.log('[MyDocumentsScreen].componentDidMount() this.props', this.props)

	}

	componentWillUnmount() {

		if (this.willFocusSubscription) {
			this.willFocusSubscription.remove();
		}
		if (this.keyboardDidHideListener) {
			this.keyboardDidHideListener.remove();
		}
	}
	render() {
		return (
			<ScrollView contentContainerStyle={styles.registrationScreen}>
				<ChoiceCameraRoll
					pickFromCamera={this.pickFromCamera}
					selectPicture={this.selectPicture}
					visible={this.state.choiceModalVisible}
					closeModal={this.closeModals}
				/>
				<View style={styles.inputContainer}>
					<NumericInput
						onlyNum
						style={styles.input}
						placeholder='Номер паспорта'
						onChangeText={passportNumber => this.setState({ passportNumber })}
						value={this.state.passportNumber}
					/>
					<NumericInput
						onlyNum
						style={styles.input}
						placeholder='Серия паспорта'
						onChangeText={passportSeries => this.setState({ passportSeries })}
						value={this.state.passportSeries}
					/>
					<Text>Фотография первой страницы паспорта:</Text>
					<TouchableOpacity style={styles.fullScreenPicture} onPress={() => this.openFirstCameraRoll()}>
						<LocalImage source={this.state.firstPageUri} originalWidth={909} originalHeight={465} />
					</TouchableOpacity>
					<Text>Фотография страницы паспорта c пропиской:</Text>
					<TouchableOpacity style={styles.fullScreenPicture} onPress={() => this.openSecondCameraRoll()}>
						<LocalImage source={this.state.secondPageUri} originalWidth={909} originalHeight={465} />
					</TouchableOpacity>
				</View>
				<View style={styles.policy}>
					<CheckBox
						value={this.state.policy}
						onValueChange={() => this.setState({ policy: !this.state.policy })}
					/>
					<View style={{ flexDirection: 'column' }}>
						<Text>Я согласен на обработку моих персональных данных</Text>
						<Text
							style={{ color: '#c69523' }}
							onPress={() => {
								Linking.openURL(this.state.policyURL);
							}}
						>
							Сублицензионное соглашение
						</Text>
					</View>
				</View>

				<Text style={{ color: 'red' }}>{this.state.message}</Text>
				<LoadingButton style={styles.buttonBottom} onPress={this._nextScreen}>
					ПРОДОЛЖИТЬ
				</LoadingButton>
			</ScrollView>
		);
	}

	async uploadImages(pics){
		try {
			const data = new FormData();
			//console.log(this.state.pictureUri);
			if (pics.passPic !== null) {
				data.append('pass', {
					uri: pics.passPic,
					type: 'image/jpeg',
					name: 'image.jpg'
				});
			}
			if (pics.passRegPic !== null) {
				data.append('pass_reg', {
					uri: pics.passRegPic,
					type: 'image/jpeg',
					name: 'image.jpg'
				});
			}
			//console.log(data);

			await axios.patch('/worker/upload/' + this.state.userId, data);
		} catch (err) {
			console.log('Download photos error: ', err);
			if(error.response){
				showAlert('Ошибка при отправке данных', 'Попробуйте сделать это позже\n'+error.response.data.message, { okFn: undefined });
			} else {
				showAlert('Ошибка при отправке данных', 'Попробуйте попозже', { okFn: undefined });
			}
		}
	}

	_nextScreen = async () => {
		if (this.state.policy === false) {
			this.setState({
				message: 'Для продолжения необходимо принять условия сублицензионного соглашения'
			});
		} else {
			let passPic = null;
			let passRegPic = null;
			if (typeof this.state.firstPageUri === 'string') {
				passPic = this.state.firstPageUri;
			} else {
				this.setState({
					message: 'Для продолжения необходимо загрузить фото 1 страницы паспорта'
				});
				return;
			}
			if (typeof this.state.secondPageUri === 'string') {
				passRegPic = this.state.secondPageUri;
			} else {
				this.setState({
					message: 'Для продолжения необходимо загрузить фото страницы паспорта c регистрацией'
				});
				return;
			}
			if (!this.state.passportNumber || !this.state.passportSeries) {
				this.setState({
					message: 'Для продолжения необходимо указать номер и серию паспорта'
				});
				return;
			}

			const dataToSend = {
				passportNumber: this.state.passportNumber,
				passportSeries: this.state.passportSeries,
				agreement: this.state.agreement,
				docStatus: 'updated',
				pass: passPic,
				pass_reg: passRegPic
			};

			try {
				console.log('Data to server: ', dataToSend);
				const id = await AsyncStorage.getItem('userId');
				console.log('[MyDocumentsScreen]._nextScreen() user_id', id)
				const res = await axios.patch('/worker/' + id, dataToSend);
				console.log('[MyDocumentsScreen]._nextScreen() res from server', res)
				await this.uploadImages({passPic, passRegPic})
				showAlert('Успешно', 'Данные обновлены!', { okFn: undefined });
			} catch (error) {
				console.log('[MyDocumentsScreen]._nextScreen() err', error)
				if(error.response){
					showAlert('Ошибка при отправке данных', 'Попробуйте сделать это позже\n'+error.response.data.message, { okFn: undefined });
				} else {
					showAlert('Ошибка при отправке данных', 'Попробуйте сделать это позже', {okFn: undefined});
				}
				return;
			}


		}
	};
	openFirstCameraRoll = () => {
		this.setState({ choiceModalVisible: true, first: true });
	};

	openSecondCameraRoll = () => {
		this.setState({ choiceModalVisible: true, first: false });
	};

	closeModals = () => {
		this.setState({
			choiceModalVisible: false
		});
	};

	pickFromCamera = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		if (status === 'granted') {
			this.setState({ choiceModalVisible: false });
			const { cancelled, uri } = await ImagePicker.launchCameraAsync({
				mediaTypes: 'Images',
				quality: 0.3
			});
			if (!cancelled) {
				if (this.state.first) this.setState({ firstPageUri: uri });
				else if (!this.state.first) this.setState({ secondPageUri: uri });
			}
		}
	};

	selectPicture = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		if (status === 'granted') {
			this.setState({ choiceModalVisible: false });
			const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: 'Images',
				quality: 0.3
			});
			if (!cancelled) {
				if (this.state.first) this.setState({ firstPageUri: uri });
				else if (!this.state.first) this.setState({ secondPageUri: uri });
				console.log(TAG, typeof this.state.firstPageUri);
			}
		}
	};
}

export default MyDocumentsScreen;
