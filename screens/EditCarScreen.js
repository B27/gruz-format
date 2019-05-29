import { ImagePicker, Permissions } from 'expo';
import { Picker } from 'native-base';
import React from 'react';
import { AsyncStorage, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ImageChooser from '../components/ImageChooser';
import styles from '../styles';
import ChoiceCameraRoll from './modals/ChoiceCameraRoll';
import axios from 'axios';

class EditCarScreen extends React.Component {
	state = {
		imageNum: null,
		choiceModalVisible: false,
		pictureUri: require('../images/camera.png'),
		bodyType: null,
		isOpen: null,
		types: [
			{ name: 'Тип кузова', isOpen: null },
			{ name: 'Рефрижератор (крытый)', isOpen: false },
			{ name: 'Термобудка (крытый)', isOpen: false },
			{ name: 'Кран. борт', isOpen: true },
			{ name: 'Тент (крытый)', isOpen: false }
		],
		loadCapacity: 543,
		length: 32,
		width: 32,
		height: 23
	};

	static navigationOptions = {
		title: 'Мое авто',
		headerLeft: null,
		headerTitleStyle: {
			textAlign: 'center',
			flexGrow: 1,
			alignSelf: 'center'
		}
	};

	render() {
		return (
			<KeyboardAvoidingView style={styles.flex1} contentContainerStyle={styles.flex1} behavior='padding'>
				<ScrollView contentContainerStyle={styles.registrationScreen}>
					<ChoiceCameraRoll
						pickFromCamera={this.pickFromCamera}
						selectPicture={this.selectPicture}
						visible={this.state.choiceModalVisible}
						closeModal={this.closeModals}
					/>
					<Text>{this.state.message}</Text>
					<View style={styles.inputContainer} behavior='padding' enabled>
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
								selectedValue={this.state.bodyType}
								onValueChange={(itemValue, itemIndex) => {
									this.setState({
										bodyType: itemValue,
										isOpen: this.state.types[itemIndex].isOpen
									});
									console.log(itemValue, this.state.types[itemIndex].isOpen);
								}}
								placeholder='Тип кузова'
							>
								{this.state.types.map(({ name }, index) => {
									return (
										<Picker.Item
											color={!index ? 'grey' : 'black'}
											key={name}
											label={name}
											value={name}
										/>
									);
								})}
							</Picker>
						</View>

						<TextInput
							style={styles.input}
							placeholder='Грузоподъёмность (тонны)'
							placeholderTextColor='grey'
							onChangeText={loadCapacity => this.setState({ loadCapacity })}
						/>
						<Text style={styles.descriptionTwo}>Кузов:</Text>
						<TextInput
							style={styles.input}
							placeholder='Длина'
							placeholderTextColor='grey'
							onChangeText={length => this.setState({ length })}
						/>
						<TextInput
							style={styles.input}
							placeholder='Ширина'
							placeholderTextColor='grey'
							onChangeText={width => this.setState({ width })}
						/>
						<TextInput
							style={styles.input}
							placeholder='Высота'
							placeholderTextColor='grey'
							onChangeText={height => this.setState({ height })}
						/>
						<Text style={styles.descriptionTwo}>Фотографии:</Text>
						<View style={styles.photoButtonContainer}>
							<ImageChooser openModal={this.openModalImage(1)} img={this.state.image1} />
							<ImageChooser openModal={this.openModalImage(2)} img={this.state.image2} />
							<ImageChooser openModal={this.openModalImage(3)} img={this.state.image3} />
						</View>
					</View>

					<TouchableOpacity style={styles.buttonBottom} onPress={this.nextScreen}>
						<Text style={styles.text}>ПРОДОЛЖИТЬ</Text>
					</TouchableOpacity>
				</ScrollView>
			</KeyboardAvoidingView>
		);
	}

	nextScreen = async () => {
		if (
			!this.state.image1 ||
			!this.state.image2 ||
			!this.state.image3 ||
			this.state.bodyType === 'Тип кузова' ||
			this.state.isOpen === null ||
			this.state.loadCapacity === null ||
			this.state.length === null ||
			this.state.width === null ||
			this.state.height === null
		) {
			this.setState({ message: 'Все поля должны быть заполнены' });
		} else {
			const dataToSend = {
				...this.props.navigation.state.params,
				veh_is_open: this.state.isOpen,
				veh_height: this.state.height,
				veh_width: this.state.width,
				veh_length: this.state.length,
				veh_loadingCap: this.state.loadCapacity,
				veh_frameType: this.state.bodyType
			};
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
					uri: this.props.navigation.getParam('pass'),
					type: 'image/jpeg',
					name: 'image.jpg'
				});
				data.append('pass_reg', {
					uri: this.props.navigation.getParam('pass_reg'),
					type: 'image/jpeg',
					name: 'image.jpg'
                });
                data.append('vehicle0', {
                    uri: this.state.image1,
                    type: 'image/jpeg',
                    name: 'image.jpg'
                });
                data.append('vehicle1', {
                    uri: this.state.image2,
                    type: 'image/jpeg',
                    name: 'image.jpg'
                });
                data.append('vehicle2', {
                    uri: this.state.image3,
                    type: 'image/jpeg',
                    name: 'image.jpg'
                });
				//console.log(data);

				await axios.patch('/worker/upload/' + this.state.userId, data );
				this.props.navigation.navigate('Main');
			} catch (err) {
				console.log('Download photos error: ', err);
			}
		}
	};

	closeModals = () => {
		this.setState({
			choiceModalVisible: false
		});
	};

	openModalImage = num => () => {
		this.setState({
			choiceModalVisible: true,
			imageNum: num
		});
	};

	pickFromCamera = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		if (status === 'granted') {
			this.setState({ choiceModalVisible: false });
			const { cancelled, uri } = await ImagePicker.launchCameraAsync({
				mediaTypes: 'Images'
			});
			if (!cancelled) this.setState({ [`image${this.state.imageNum}`]: uri });
		}
	};

	selectPicture = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		if (status === 'granted') {
			this.setState({ choiceModalVisible: false });
			const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: 'Images',

				allowsEditing: true
			});
			if (!cancelled) this.setState({ [`image${this.state.imageNum}`]: uri });
		}
	};
}

export default EditCarScreen;
