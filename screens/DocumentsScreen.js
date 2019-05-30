import axios from 'axios';
import { ImagePicker, Permissions } from 'expo';
import React from 'react';
import {
	AsyncStorage,
	CheckBox,
	KeyboardAvoidingView,
	Linking,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';
import LocalImage from '../components/LocalImage';
import styles from '../styles';
import ChoiceCameraRoll from './modals/ChoiceCameraRoll';

class DocumentsScreen extends React.Component {
	state = {
		choiceModalVisible: false,
		firstPageUri: require('../images/unknown.png'),
		secondPageUri: require('../images/unknown.png'),
		firstPage: true,
		passportNumber: '435',
		passportSeries: '435',
		agreement: '34',
		message: null,
		policy: true,
		policyURL: 'https://gruz.bw2api.ru/policy.pdf'
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
		//console.log(axios.defaults.headers);
		console.log('phone', this.props.navigation.state.params);
	}
	render() {
		return (
            <KeyboardAvoidingView keyboardVerticalOffset={85} behavior='padding'>
                <ScrollView contentContainerStyle={styles.registrationScreen}>
                    <ChoiceCameraRoll
                        pickFromCamera={this.pickFromCamera}
                        selectPicture={this.selectPicture}
                        visible={this.state.choiceModalVisible}
                        closeModal={this.closeModals}
                    />
                    <View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							placeholder='Номер паспорта'
							placeholderTextColor='grey'
							keyboardType='numeric'
							onChangeText={passportNumber => this.setState({ passportNumber })}
						/>
						<TextInput
							style={styles.input}
							placeholder='Серия паспорта'
							placeholderTextColor='grey'
							keyboardType='numeric'
							onChangeText={passportSeries => this.setState({ passportSeries })}
						/>
						<Text>Фотография первой страницы паспорта:</Text>
						<TouchableOpacity style={styles.fullScreenPicture} onPress={() => this.openFirstCameraRoll()}>
							<LocalImage source={this.state.firstPageUri} originalWidth={909} originalHeight={465} />
						</TouchableOpacity>
						<Text>Фотография страницы паспорта c пропиской:</Text>
						<TouchableOpacity style={styles.fullScreenPicture} onPress={() => this.openSecondCameraRoll()}>
							<LocalImage source={this.state.secondPageUri} originalWidth={909} originalHeight={465} />
						</TouchableOpacity>
						<TextInput
							style={styles.input}
							placeholder='Номер договора'
							placeholderTextColor='grey'
							onChangeText={agreement => this.setState({ agreement })}
						/>
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
								Политика конфиденциальности
							</Text>
						</View>
					</View>

					<Text style={{ color: 'red' }}>{this.state.message}</Text>
					<TouchableOpacity style={styles.buttonBottom} onPress={() => this._nextScreen()}>
						<Text style={styles.text}>ПРОДОЛЖИТЬ</Text>
					</TouchableOpacity>
				</ScrollView>
			</KeyboardAvoidingView>
		);
	}
	_nextScreen = async () => {
		if (
			typeof this.state.firstPageUri === 'number' ||
			typeof this.state.secondPageUri === 'number' ||
			this.state.passportNumber === null ||
			this.state.passportSeries === null ||
			this.state.agreement === null ||
			!this.state.policy
		) {
			this.setState({ message: 'Все поля должны быть заполнены' });
		} else {
			const dataToSend = {
				...this.props.navigation.state.params,
				passportNumber: this.state.passportNumber,
				passportSeries: this.state.passportSeries,
                agreement: this.state.agreement,
                pass: this.state.firstPageUri,
                pass_reg: this.state.secondPageUri
                
			};

			if (this.props.navigation.getParam('isDriver')) {
				this.props.navigation.navigate('EditCar', dataToSend);
			} else {
				try {
					console.log('Data to server: ', dataToSend);
					const res = await axios.post('/worker', dataToSend);
					//console.log('REGISTRATION: ', res);
					this.setState({ userId: res.data._id });
					await AsyncStorage.setItem('userId', this.state.userId);
					//this.props.navigation.navigate('Documents');
				} catch (error) {
					console.log('ERROR_LOGIN:', error);
				}
				try {
					const response = await axios.post('/login', {
						login: this.props.navigation.getParam('login'),
						password: this.props.navigation.getParam('password')
					});
					//console.log('respLogin: ', response);
					await AsyncStorage.setItem('token', response.data.token);

					axios.defaults.headers = {
						Authorization: 'Bearer ' + response.data.token
					};
				} catch (err) {
					console.log('ОШИБКА', err);
				}

				try {
					const data = new FormData();
					//console.log(this.state.pictureUri);

					data.append('user', {
						uri: this.props.navigation.getParam('avatar'),
						type: 'image/jpeg',
						name: 'image.jpg'
					});
					data.append('pass', {
						uri: this.state.firstPageUri,
						type: 'image/jpeg',
						name: 'image.jpg'
					});
					data.append('pass_reg', {
						uri: this.state.secondPageUri,
						type: 'image/jpeg',
						name: 'image.jpg'
					});
					//console.log(data);

					await axios.patch('/worker/upload/' + this.state.userId, data);
					this.props.navigation.navigate('Main');
				} catch (err) {
					console.log('Download photos error: ', err);
				}
				// await axios
				// 	.patch('/worker/' + id, {
				// 		passportNumber: this.state.passportNumber,
				// 		passportSeries: this.state.passportSeries,
				// 		agreement: this.state.agreement
				// 	})
				// 	.catch(err => {
				// 		console.log(err);
				// 	})
				// 	.then(res => {
				// 		console.log(res.data);
				// 		//await AsyncStorage.setItem("phoneNum", this.state.phone);
				// 		this.props.navigation.navigate('EditCar');
				// 	});

				// const data = new FormData();
				// console.log(this.state.pictureUri);

				// data.append('pass', {
				// 	uri: this.state.firstPageUri,
				// 	type: 'image/jpeg',
				// 	name: 'image.jpg'
				// });
				// data.append('pass_reg', {
				// 	uri: this.state.secondPageUri,
				// 	type: 'image/jpeg',
				// 	name: 'image.jpg'
				// });

				// console.log(data);

				// await axios.patch('/worker/upload/' + id, data);
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
				mediaTypes: 'Images'
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
				aspect: [1, 1],
				allowsEditing: true
			});
			if (!cancelled) {
				if (this.state.first) this.setState({ firstPageUri: uri });
				else if (!this.state.first) this.setState({ secondPageUri: uri });
			}
		}
	};
}

export default DocumentsScreen;
