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
const TAG = '~DocumentsScreen~';
class DocumentsScreen extends React.Component {
    state = {
        choiceModalVisible: false,
        firstPageUri: require('../images/unknown.png'),
        secondPageUri: require('../images/unknown.png'),
        firstPage: true,
        passportNumber: '',
        passportSeries: '',
        message: null,
        policy: false,
        policyURL: 'https://gruz.bw2api.ru/policy.pdf',
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
    componentDidMount() {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            Keyboard.dismiss();
        });
        console.log(TAG, typeof this.state.firstPageUri);
        console.log(TAG, typeof this.state.secondPageUri);
    }

    componentWillUnmount() {
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
                        placeholder="Номер паспорта"
                        onChangeText={passportNumber => this.setState({ passportNumber })}
                        value={this.state.passportNumber}
                    />
                    <NumericInput
                        onlyNum
                        style={styles.input}
                        placeholder="Серия паспорта"
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
                <LoadingButton
                    style={styles.buttonBottom}
                    onPress={this._nextScreen}
                    // eslint-disable-next-line react-native/no-raw-text
                >
                    ПРОДОЛЖИТЬ
                </LoadingButton>
            </ScrollView>
        );
    }
    _nextScreen = async () => {
        if (this.state.policy === false) {
            this.setState({
                message: 'Для продолжения регистрации необходимо принять условия сублицензионного соглашения',
            });
        } else {
            let passPic = null;
            let passRegPic = null;
            if (typeof this.state.firstPageUri === 'string') {
                passPic = this.state.firstPageUri;
            }
            if (typeof this.state.secondPageUri === 'string') {
                passRegPic = this.state.secondPageUri;
            }

            const dataToSend = {
                ...this.props.navigation.state.params,
                passportNumber: this.state.passportNumber,
                passportSeries: this.state.passportSeries,
                agreement: this.state.agreement,
                pass: passPic,
                pass_reg: passRegPic,
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
                        password: this.props.navigation.getParam('password'),
                    });
                    //console.log('respLogin: ', response);
                    await AsyncStorage.setItem('token', response.data.token);

                    axios.defaults.headers = {
                        Authorization: 'Bearer ' + response.data.token,
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
                        name: 'image.jpg',
                    });
                    if (passPic !== null) {
                        data.append('pass', {
                            uri: passPic,
                            type: 'image/jpeg',
                            name: 'image.jpg',
                        });
                    }
                    if (passRegPic !== null) {
                        data.append('pass_reg', {
                            uri: passRegPic,
                            type: 'image/jpeg',
                            name: 'image.jpg',
                        });
                    }
                    //console.log(data);

                    await axios.patch('/worker/upload/' + this.state.userId, data);
                    this.props.navigation.navigate('AuthLoading');
                } catch (err) {
                    console.log('Download photos error: ', err);
                }
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
            choiceModalVisible: false,
        });
    };

    pickFromCamera = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status === 'granted') {
            this.setState({ choiceModalVisible: false });
            const { cancelled, uri } = await ImagePicker.launchCameraAsync({
                mediaTypes: 'Images',
                quality: 0.3,
            });
            if (!cancelled) {
                if (this.state.first) {
                    this.setState({ firstPageUri: uri });
                } else if (!this.state.first) {
                    this.setState({ secondPageUri: uri });
                }
            }
        }
    };

    selectPicture = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === 'granted') {
            this.setState({ choiceModalVisible: false });
            const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'Images',
                quality: 0.3,
            });
            if (!cancelled) {
                if (this.state.first) {
                    this.setState({ firstPageUri: uri });
                } else if (!this.state.first) {
                    this.setState({ secondPageUri: uri });
                }
                console.log(TAG, typeof this.state.firstPageUri);
            }
        }
    };
}

export default DocumentsScreen;
