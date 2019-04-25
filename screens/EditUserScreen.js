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
import { Permissions } from "expo";
import ChoiceCameraRoll from "./modals/ChoiceCameraRoll";
import CameraModal from "./modals/CameraModal";
import PreviewModal from './modals/PreviewModal';

class EditUserScreen extends React.Component {
	state = {
        choiceModalVisible: false,
		cameraModalVisible: false,
		previewModalVisible: false,
		previewUri: null,
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
            <ChoiceCameraRoll visible = {this.state.choiceModalVisible} closeModal={this.closeModals} openCamera={this.openCamera}/>
            <CameraModal visible = {this.state.cameraModalVisible} closeModal={this.closeModals} openPreview={this.openPreview}/>
			<PreviewModal previewUri = {this.state.previewUri} visible = {this.state.previewModalVisible} closeModal = {this.closePreviewModal} setPicture = {this.setPicture}/>
				<TouchableOpacity
					style={styles.registrationPhotoContainer}
					onPress={() => this.openCameraRoll()}
				>
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
    openCamera = () => {
        this.setState({ cameraModalVisible: true });
	}
	openPreview = (uri) => {
		console.log(uri);
		
		this.setState({ 
			previewModalVisible: true,
			previewUri: uri 
		})
	}
	setPicture = (uri) => {
		this.setState({
			pictureUri: uri,
			choiceModalVisible: false,
			cameraModalVisible: false,
			previewModalVisible: false
		})
		
	}
	closeModals = () => {
        this.setState({
            choiceModalVisible: false,
            cameraModalVisible: false
        });
	}
	closePreviewModal = () => {
		this.setState({
			previewModalVisible: false
		})
	}
}

export default EditUserScreen;
