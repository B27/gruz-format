import React from "react";
import {
	View,
	ScrollView,
	TextInput,
	Text,
	TouchableOpacity,
	DatePickerAndroid,
	Picker
} from "react-native";
import styles from "../styles";
import LocalImage from "../components/LocalImage";
import { Permissions, ImagePicker } from "expo";
import ChoiceCameraRoll from "./modals/ChoiceCameraRoll";
import axios from "axios";
import { maxFromBits } from "uuid-js";

class EditUserScreen extends React.Component {
	state = {
		choiceModalVisible: false,
		pictureUri: require("../images/unknown.png"),
		lastname: "",
		firstname: "",
		patronimyc: "",
		phone: "",
		password: "",
		birthDate: "Дата рождения",
		city: "",
		street: "",
		house: "",
		flat: "",
		height: "",
		weight: "",
		message: "",
		cities: [{name:'Город'}, {name:'Улан-Удэ'}, {name:'Чита'}],
		list: []
	};
	static navigationOptions = {
		title: "Регистрация",
		headerLeft: null,
		headerTitleStyle: {
			textAlign: "center",
			flexGrow: 1,
			alignSelf: "center"
		}
	};

	componentDidMount(){
		(async () => {
			try{
				( async () => this.setState({
					cities:
					[{name:'Город'},...(await axios.get("/cities/1000/1")).data.map(
						({name,id}) => ({name,id})
					)]
					}
				)
				)();
			}catch(err){
				console.log(err);
			}
		})();
		
	};
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
					<LocalImage
						source={this.state.pictureUri}
						originalWidth={909}
						originalHeight={465}
					/>
				</TouchableOpacity>

				<View style={styles.inputContainer} behavior="padding" enabled>
					
					<TextInput
						style={styles.input}
						placeholder="Номер телефона"
						placeholderTextColor="grey"
						onChangeText={phone => this.setState({ phone })}
					/>

					{/* [var_name]: "phone" */}

					<TextInput
						style={styles.input}
						placeholder="Пароль"
						secureTextEntry={true}
						placeholderTextColor="grey"
						onChangeText={password => this.setState({ password })}
					/>
					<TextInput
						style={styles.input}
						placeholder="Имя"
						placeholderTextColor="grey"
						onChangeText={firstname => this.setState({ firstname })}
					/>
					<TextInput
						style={styles.input}
						placeholder="Фамилия"
						placeholderTextColor="grey"
						onChangeText={lastname => this.setState({ lastname })}
					/>
					<TextInput
						style={styles.input}
						placeholder="Отчество"
						placeholderTextColor="grey"
						onChangeText={patronimyc => this.setState({ patronimyc })}
					/>
					<TextInput
						style={styles.input}
						placeholder="Город"
						placeholderTextColor="grey"
						onChangeText={city => this.setState({ city })}
					/>
					<View
						style={{
							height: 45,
							borderWidth: 1,
							borderRadius: 15,
							paddingLeft: 5,
							marginBottom: 15,
							justifyContent: "center"
						}}
					>
						<Picker
							onValueChange={(itemValue, itemIndex) =>
								this.setState({ city: itemValue })
							}
							placeholder="Тип кузова"
							style={{color: 'grey'}}
						>
							{this.state.cities.map(({name:city}, index) => <Picker.Item color = {!index ? 'grey' : 'black'} key={city} label={city} value={city} />)}
						</Picker>
					</View>
					<TextInput
						style={styles.input}
						placeholder="Улица"
						placeholderTextColor="grey"
						onChangeText={street => this.setState({ street })}
					/>
					<View style={{ flex: 1, flexDirection: "row" }}>
						<TextInput
							style={styles.inputHalf}
							placeholder="Дом"
							placeholderTextColor="grey"
							onChangeText={house => this.setState({ house })}
						/>
						<View style={{ width: 15 }} />
						<TextInput
							style={styles.inputHalf}
							placeholder="Квартира"
							placeholderTextColor="grey"
							onChangeText={flat => this.setState({ flat })}
						/>
					</View>
					<TouchableOpacity
						style={styles.input}
						onPress={() => this.openDatePicker()}
					>
						<Text style={styles.datePickerText}>
							{this.state.birthDate != "Дата рождения"
								? `${this.state.birthDate.getDate()}.${this.state.birthDate.getMonth()}.${this.state.birthDate.getFullYear()}`
								: this.state.birthDate}
						</Text>
					</TouchableOpacity>

					<View style={{ flex: 1, flexDirection: "row" }}>
						<TextInput
							style={styles.inputHalf}
							placeholder="Рост"
							placeholderTextColor="grey"
							keyboardType="numeric"
							onChangeText={height => this.setState({ height })}
						/>
						<View style={{ width: 15 }} />
						<TextInput
							style={styles.inputHalf}
							placeholder="Вес"
							placeholderTextColor="grey"
							keyboardType="numeric"
							onChangeText={weight => this.setState({ weight })}
						/>
					</View>
				</View>
				<Text style={{ color: "red" }}>{this.state.message}</Text>
				<TouchableOpacity
					style={styles.buttonBottom}
					onPress={() => this._nextScreen()}
				>
					<Text style={styles.text}>ПРОДОЛЖИТЬ</Text>
				</TouchableOpacity>
			</ScrollView>
		);
	}
	_nextScreen = async () => {
		if (
			typeof this.state.pictureUri === "number" ||
			this.state.lastname === "" ||
			this.state.firstname === "" ||
			this.state.patronimyc === "" ||
			this.state.phone === "" ||
			this.state.password === "" ||
			this.state.birthDate === "Дата рождения" ||
			this.state.height === "" ||
			this.state.weight === "" ||
			this.state.city === "" ||
			this.state.street === "" ||
			this.state.house === "" ||
			this.state.flat === ""
		) {
			this.setState({ message: "Все поля должны быть заполнены" });
		} else {
			await axios
				.post("/worker", {
					name: `${this.state.lastname} ${this.state.firstname} ${
						this.state.patronimyc
					}`,
					login: this.state.phone,
					phoneNum: this.state.phone,
					password: this.state.password,
					birthDate: this.state.birthDate,
					address: `${this.state.city} ${this.state.street} ${
						this.state.house
					} ${this.state.flat}`,
					city: this.state.city,
					height: this.state.height,
					weight: this.state.weight
				})
				.catch(err => {
					console.log(err);
				})
				.then(async res => {
					console.log(res.data);
					//await AsyncStorage.setItem("phoneNum", this.state.phone);
					this.props.navigation.navigate("Documents");
				});
		}
	};

	openDatePicker = async () => {
		try {
			const { action, year, month, day } = await DatePickerAndroid.open({
				date: new Date()
			});
			if (action !== DatePickerAndroid.dismissedAction) {
				console.log(year, month, day);

				let date = new Date(year, month, day);
				this.setState({ birthDate: date });
			}
		} catch ({ code, message }) {
			console.warn("Cannot open date picker", message);
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
		if (status === "granted") {
			this.setState({ choiceModalVisible: false });
			const { cancelled, uri } = await ImagePicker.launchCameraAsync({
				mediaTypes: "Images"
			});
			if (!cancelled) this.setState({ pictureUri: uri });
		}
	};

	selectPicture = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		if (status === "granted") {
			this.setState({ choiceModalVisible: false });
			const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: "Images",
				aspect: [1, 1],
				allowsEditing: true
			});
			if (!cancelled) this.setState({ pictureUri: uri });
		}
	};
}

export default EditUserScreen;
