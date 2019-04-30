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
import ChoiceCameraRoll from "./modals/ChoiceCameraRoll";


class DocumentsScreen extends React.Component {

    state = {
        choiceModalVisible: false,
        pictureUri: require("../images/unknown.png"),
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
    };//style={styles.registrationPhoto}

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
                    <TouchableOpacity style={styles.fullScreenPicture} onPress={() => this.openCameraRoll()}>
					<LocalImage
						source={this.state.pictureUri}
						originalWidth={909}
						originalHeight={465}
					/>
				</TouchableOpacity>
                    <Text>Фотография страницы паспорта c пропиской:</Text>
                    <TouchableOpacity style={styles.fullScreenPicture} onPress={() => this.openCameraRoll()}>
					<LocalImage
						source={this.state.pictureUri}
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

                <TouchableOpacity style={styles.buttonBottom} onPress={() => this.props.navigation.navigate("EditCar")}>
                    <Text style={styles.text} >ПРОДОЛЖИТЬ</Text>
                </TouchableOpacity>

            </ScrollView>
        );
    }
    openCameraRoll = () => {
		this.setState({ choiceModalVisible: true });
	};
}


export default DocumentsScreen;

