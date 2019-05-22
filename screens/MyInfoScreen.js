import React from 'react';
import {
	View,
	ScrollView,
	TextInput,
	Text,
	TouchableOpacity,
	DatePickerAndroid,
	Picker,
	AsyncStorage
} from 'react-native';
import styles from '../styles';
import LocalImage from '../components/LocalImage';
import { Permissions, ImagePicker } from 'expo';
import ChoiceCameraRoll from './modals/ChoiceCameraRoll';
import axios from 'axios';
import { maxFromBits } from 'uuid-js';
import { inject, observer } from 'mobx-react/native';

@inject('store')
@observer
class MyInfoScreen extends React.Component {
	state = {
		choiceModalVisible: false,
		pictureUri: require('../images/unknown.png'),
		lastname: '',
		firstname: '',
		patronimyc: '',
		phone: '',
		password: '',
		birthDate: 'Дата рождения',
		city: '',
		cityId: null,
		street: '',
		house: '',
		flat: '',
		height: '',
		weight: '',
		message: '',
		cities: [],
		list: [],
		userId: null
	};
	static navigationOptions = {
		title: 'Моя информация',
		headerLeft: null
	};

	componentDidMount() {
		(async () => {
			try {
				(async () =>
					this.setState({
						cities: [
							{ name: 'Город', id: 1 },
							...(await axios.get('/cities/1000/1')).data.map(({ name, id }) => ({
								name,
								id
							}))
						]
					}))();
			} catch (err) {
				console.log(err);
			}
		})();
		this.props.store.getUserInfo();
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
				<TouchableOpacity onPress={() => this.openCameraRoll()}>
					<LocalImage source={this.props.store.avatar} originalWidth={909} originalHeight={465} />
				</TouchableOpacity>

				<View style={styles.inputContainer} behavior='padding' enabled>
					<TextInput
						style={styles.input}
						placeholder='Номер телефона'
						placeholderTextColor='grey'
						onChangeText={phone => this.setState({ phone })}
						value={this.props.store.phone}
					/>

					{/* [var_name]: "phone" */}

					<TextInput
						style={styles.input}
						placeholder='Пароль'
						secureTextEntry={true}
						placeholderTextColor='grey'
						onChangeText={password => this.setState({ password })}
					/>
					<TextInput
						style={styles.input}
						placeholder='Имя'
						placeholderTextColor='grey'
						onChangeText={firstname => this.setState({ firstname })}
						value={this.props.store.firstName}
					/>
					<TextInput
						style={styles.input}
						placeholder='Фамилия'
						placeholderTextColor='grey'
						onChangeText={lastname => this.setState({ lastname })}
						value={this.props.store.lastName}
					/>
					<TextInput
						style={styles.input}
						placeholder='Отчество'
						placeholderTextColor='grey'
						onChangeText={patronimyc => this.setState({ patronimyc })}
						value={this.props.store.patronymic}
					/>

					<View
						style={{
							height: 45,
							borderWidth: 1,
							borderRadius: 15,
							paddingLeft: 5,
							marginBottom: 15,
							justifyContent: 'center'
						}}
					>
						<Picker
							selectedValue={this.state.cityId}
							onValueChange={(itemValue, itemIndex) =>
								this.setState({
									cityId: itemValue
								})
							}
							placeholder='Тип кузова'
							style={{ color: 'grey' }}
						>
							{this.state.cities.map(({ name: city, id: id }, index) => {
								console.log(city, id);

								return (
									<Picker.Item color={!index ? 'grey' : 'black'} key={city} label={city} value={id} />
								);
							})}
						</Picker>
					</View>
					<TextInput
						style={styles.input}
						placeholder='Улица'
						placeholderTextColor='grey'
						onChangeText={street => this.setState({ street })}
						value={this.props.store.street}
					/>
					<View style={{ flex: 1, flexDirection: 'row' }}>
						<TextInput
							style={styles.inputHalf}
							placeholder='Дом'
							placeholderTextColor='grey'
							onChangeText={house => this.setState({ house })}
							value={this.props.store.house}
						/>
						<View style={{ width: 15 }} />
						<TextInput
							style={styles.inputHalf}
							placeholder='Квартира'
							placeholderTextColor='grey'
							onChangeText={flat => this.setState({ flat })}
							value={this.props.store.flat}
						/>
					</View>
					<TouchableOpacity style={styles.input} onPress={() => this.openDatePicker()}>
						<Text style={styles.datePickerText}>{this.getBirthDate()}</Text>
					</TouchableOpacity>

					<View style={{ flex: 1, flexDirection: 'row' }}>
						<TextInput
							style={styles.inputHalf}
							placeholder='Рост'
							placeholderTextColor='grey'
							keyboardType='numeric'
                            onChangeText={height => this.setState({ height })}
                            value={this.props.store.height.toString()}
						/>
						<View style={{ width: 15 }} />
						<TextInput
							style={styles.inputHalf}
							placeholder='Вес'
							placeholderTextColor='grey'
							keyboardType='numeric'
                            onChangeText={weight => this.setState({ weight })}
                            value={this.props.store.weight.toString()}
						/>
					</View>
				</View>
				<Text style={{ color: 'red' }}>{this.state.message}</Text>
				<TouchableOpacity style={styles.buttonBottom} onPress={() => this._nextScreen()}>
					<Text style={styles.text}>СОХРАНИТЬ</Text>
				</TouchableOpacity>
			</ScrollView>
		);
	}
	getBirthDate = () => {
        
		if (this.props.store.birthDate !== undefined && this.props.store.birthDate !== 'Дата рождения') {
            const date = this.props.store.birthDate;
            console.log(date + ' ----------------------');
			return `${this.props.store.birthDate.getDate()}.${this.props.store.birthDate.getMonth()}.${this.props.store.birthDate.getFullYear()}`;
		} else {
			return ;
		}

		
	};
	_nextScreen = async () => {
		if (
			typeof this.state.pictureUri === 'number' ||
			this.state.lastname === '' ||
			this.state.firstname === '' ||
			this.state.patronimyc === '' ||
			this.state.phone === '' ||
			this.state.password === '' ||
			this.state.birthDate === 'Дата рождения' ||
			this.state.height === '' ||
			this.state.weight === '' ||
			this.state.cityId === '' ||
			this.state.street === '' ||
			this.state.house === '' ||
			this.state.flat === ''
		) {
			this.setState({ message: 'Все поля должны быть заполнены' });
		} else {
            const id = await AsyncStorage.getItem('userId');
			await axios
				.patch('/worker/' + id, {
					name: `${this.state.lastname} ${this.state.firstname} ${this.state.patronimyc}`,
					login: this.state.phone,
					phoneNum: this.state.phone,
					password: this.state.password,
					birthDate: this.state.birthDate,
					address: `${this.state.city} ${this.state.street} ${this.state.house} ${this.state.flat}`,
					city: this.state.cityId,
					height: this.state.height,
					weight: this.state.weight
				})
				.catch(err => {
					console.log(err);
				})
				.then(res => {
					console.log(res.data);
					//await AsyncStorage.setItem("phoneNum", this.state.phone);
					this.setState({ userId: res.data._id });
					this.props.navigation.navigate('Documents');
				});
			const response = await axios
				.post('/login', {
					login: this.state.phone,
					password: this.state.password
				})
				.catch(err => {
					console.log(err);
				});

			console.log(response.data);
			await AsyncStorage.setItem('token', response.data.token);
			axios.defaults.headers = {
				Authorization: 'Bearer ' + response.data.token
			};

			const data = new FormData();
			console.log(this.state.pictureUri);

			data.append('user', {
				uri: this.state.pictureUri,
				type: 'image/jpeg',
				name: 'image.jpg'
			});
			console.log(data);
			await AsyncStorage.setItem('userId', this.state.userId);
			await axios.patch('/worker/upload/' + this.state.userId, data);
		}
	};

	openDatePicker = async () => {
		try {
			const { action, year, month, day } = await DatePickerAndroid.open({
				date: this.props.store.birthDate
			});
			if (action !== DatePickerAndroid.dismissedAction) {
				console.log(year, month, day);

				let date = new Date(year, month, day);
				this.setState({ birthDate: date });
			}
		} catch ({ code, message }) {
			console.warn('Cannot open date picker', message);
		}
	};

	openCameraRoll = () => {
		this.setState({ choiceModalVisible: true });
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
			if (!cancelled) this.setState({ pictureUri: uri });
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
			if (!cancelled) this.setState({ pictureUri: uri });
		}
	};
}

export default MyInfoScreen;
