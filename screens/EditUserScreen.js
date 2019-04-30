import React from "react";
import {
	View,
	ScrollView,
	TextInput,
	Text,
	TouchableOpacity
} from "react-native";
import styles from "../styles";
import LocalImage from "../components/LocalImage";
import { Permissions, ImagePicker } from "expo";
import ChoiceCameraRoll from "./modals/ChoiceCameraRoll";

class EditUserScreen extends React.Component {
	state = {
		choiceModalVisible: false,
		pictureUri: require("../images/unknown.png"),
		lastname: "",
		firstname: "",
		patronimyc: "",
		birthDate: "",
		address: "",
		height: "",
		weight: "",
		message: ""
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
				<Text>{this.state.message}</Text>
				<View style={styles.inputContainer} behavior="padding" enabled>
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
						onChangeText={lastname => this.setState({ lastname })}
					/>
					<TextInput
						style={styles.input}
						placeholder="Улица"
						placeholderTextColor="grey"
						onChangeText={lastname => this.setState({ lastname })}
					/>
					<View style={{ flex: 1, flexDirection: "row" }}>
						<TextInput
							style={styles.inputHalf}
							placeholder="Дом"
							placeholderTextColor="grey"
							onChangeText={lastname => this.setState({ lastname })}
						/>
						<View style={{ width: 15 }} />
						<TextInput
							style={styles.inputHalf}
							placeholder="Квартира"
							placeholderTextColor="grey"
							onChangeText={lastname => this.setState({ lastname })}
						/>
					</View>
					<TextInput
						style={styles.input}
						placeholder="Дата рождения"
						placeholderTextColor="grey"
						onChangeText={birthDate => this.setState({ birthDate })}
					/>
					<View style={{ flex: 1, flexDirection: "row" }}>
						<TextInput
							style={styles.inputHalf}
							placeholder="Рост"
							placeholderTextColor="grey"
							onChangeText={lastname => this.setState({ lastname })}
						/>
						<View style={{ width: 15 }} />
						<TextInput
							style={styles.inputHalf}
							placeholder="Вес"
							placeholderTextColor="grey"
							onChangeText={lastname => this.setState({ lastname })}
						/>
					</View>
				</View>

				<TouchableOpacity
					style={styles.buttonBottom}
					onPress={() => this._nextScreen()}
				>
					<Text style={styles.text}>ПРОДОЛЖИТЬ</Text>
				</TouchableOpacity>
			</ScrollView>
		);
	}
	_nextScreen = () => {
		this.props.navigation.navigate("Documents");
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
