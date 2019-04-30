import React from 'react';
import {
    View,
    ScrollView,
    TextInput,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import styles from '../styles'
import LocalImage from '../components/LocalImage'
import { Permissions, ImagePicker } from "expo";
import ChoiceCameraRoll from "./modals/ChoiceCameraRoll";


class DocumentsScreen extends React.Component {

    state = {
        choiceModalVisible: false,
        firstPageUri: require("../images/unknown.png"),
        secondPageUri: require("../images/unknown.png"),
        firstPage: true,
        lastname: '',
        firstname: '',
        patronimyc: '',
        birthDate: '',
        address: '',
        height: '',
        weight: ''
    };
    static navigationOptions = {
        title: 'Регистрация',
        headerLeft: null,
        headerTitleStyle: {
            textAlign: 'center',
            flexGrow: 1,
            alignSelf: 'center',
        },
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
                <View style={styles.inputContainer} behavior="padding" enabled>
                
                    <TextInput
                        style={styles.input}
                        placeholder="Номер паспорта"
                        placeholderTextColor="grey"
                        onChangeText={(firstname) => this.setState({ firstname })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Серия паспорта"
                        placeholderTextColor="grey"
                        onChangeText={(lastname) => this.setState({ lastname })}
                    />
                    <Text>Фотография первой страницы паспорта:</Text>
                    <TouchableOpacity style={styles.fullScreenPicture} onPress={() => this.openFirstCameraRoll()}>
					<LocalImage
						source={this.state.firstPageUri}
						originalWidth={909}
						originalHeight={465}
					/>
				</TouchableOpacity>
                    <Text>Фотография страницы паспорта c пропиской:</Text>
                    <TouchableOpacity style={styles.fullScreenPicture} onPress={() => this.openSecondCameraRoll()}>
					<LocalImage
						source={this.state.secondPageUri}
						originalWidth={909}
						originalHeight={465}
					/>
				</TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Номер договора"
                        placeholderTextColor="grey"
                        onChangeText={(patronimyc) => this.setState({ patronimyc })}
                    />

                </View>

                <TouchableOpacity style={styles.buttonBottom} onPress={() => this._signInAsync()}>
                    <Text style={styles.text} >ПРОДОЛЖИТЬ</Text>
                </TouchableOpacity>

            </ScrollView>
        );
    }
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
		if (status === "granted") {
			this.setState({ choiceModalVisible: false });
			const { cancelled, uri } = await ImagePicker.launchCameraAsync({
				mediaTypes: "Images"
			});
			if (!cancelled) {
                if (this.state.first) this.setState({ firstPageUri: uri });
                else if (!this.state.first) this.setState({ secondPageUri: uri });
            } 
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
			if (!cancelled) {
                if (this.state.first) this.setState({ firstPageUri: uri });
                else if (!this.state.first) this.setState({ secondPageUri: uri });
            }
		}
	};
}


export default DocumentsScreen;

