import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import md5 from 'md5';
import React from 'react';
import { ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoadingButton from '../components/LoadingButton';
import bgImage from '../images/background.png';
import styles from '../styles';

const TAG = '~SignInScreen.js~';

class SignInScreen extends React.Component {
    state = {
        phone: '',
        password: '',
        showPass: true,
        press: false,
        message: null
    };

    static navigationOptions = {
        header: null
    };

    timeoutsSet = new Set();

    componentWillUnmount() {
        for (let timeout of this.timeoutsSet) {
            clearTimeout(timeout);
        }
        this.timeoutsSet.clear();
    }

    //flow
    render() {
        return (
            // <KeyboardAvoidingView
            //     style={styles.flex1}
            //     //contentContainerStyle={styles.flex1}
            //     behavior='padding'
            //     //keyboardVerticalOffset={-50}
            // >
            <ImageBackground source={bgImage} style={styles.backgroundContainer}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>ДОБРО {'\n'}ПОЖАЛОВАТЬ</Text>
                    <Icon name={'fiber-manual-record'} size={42} color={'black'} style={styles.logoIcon} />
                    <Icon name={'fiber-manual-record'} size={42} color={'white'} style={styles.logoIcon} />
                </View>
                <View style={styles.inputBlock}>
                    <View style={styles.inputContainer}>
                        <Icon name={'person'} size={28} color='#FFC234' style={styles.inputIcon} />
                        <TextInput
                            style={styles.inputWithIcon}
                            placeholder='Номер телефона'
                            placeholderTextColor='grey'
                            onChangeText={phone => this.setState({ phone })}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name={'lock'} size={28} color='#FFC234' style={styles.inputIcon} />
                        <TextInput
                            style={styles.inputWithIcon}
                            placeholder='Пароль'
                            secureTextEntry={this.state.showPass}
                            placeholderTextColor='grey'
                            onChangeText={password => this.setState({ password })}
                        />
                        <TouchableOpacity style={styles.btnEye} onPress={this.showPass.bind(this)}>
                            <Icon2 name={this.state.press == false ? 'md-eye' : 'md-eye-off'} size={26} color='grey' />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: 'red' }}>{this.state.message}</Text>

                    <LoadingButton style={styles.button} onPress={this._signInAsync}>
                        ВОЙТИ
                    </LoadingButton>

                    <Text style={styles.registrationQuestion}>
                        Нет аккаунта?{' '}
                        <Text style={{ color: '#FFC234', fontSize: 16 }} onPress={this.goToRegistartionScreen}>
                            Зарегистрироваться.
                        </Text>
                    </Text>
                </View>
            </ImageBackground>
            //</KeyboardAvoidingView>
        );
    }

    goToRegistartionScreen = () => {
        console.log(TAG, 'goToRegistartionScreen');

        this.props.navigation.navigate('RegisterPerson');
    };

    _signInAsync = async () => {
        this._showErrorMessage('');
        if (!this.state.phone || !this.state.password) {
            this._showErrorMessage('Введите логин и пароль');
        } else {
            try {
                const response = await axios.post('/login', {
                    login: this.state.phone,
                    password: this.state.password
                });
                console.log(TAG, response.data);

                let promiseArr = [];
                promiseArr.push(AsyncStorage.setItem('password', md5(this.state.password)));
                promiseArr.push(AsyncStorage.setItem('token', response.data.token));
                promiseArr.push(AsyncStorage.setItem('userId', response.data._id));

                await Promise.all(promiseArr);

                axios.defaults.headers = {
                    Authorization: 'Bearer ' + response.data.token
                };

                this.props.navigation.navigate('AuthLoading');
            } catch (error) {
                if (error.isAxiosError) {
                    if (error.response) {
                        console.log(TAG, 'error post /login', error.response.status, error.response.data.message);
                        switch (error.response.status) {
                            case 404:
                                this._showErrorMessage('Пользователь не найден');
                                break;
                            case 403:
                                this._showErrorMessage('Введён неверный пароль');
                                break;
                        }
                    }
                    if (error.message.includes('Network Error')) {
                        console.log(TAG, 'error network');
                        this._showErrorMessage('Ошибка, проверьте подключение к сети');
                    }
                } else {
                    console.log(TAG, 'other error', error);
                    this._showErrorMessage(`Внутренняя ошибка, ${error}`);
                }
            }
        }
    };

    showPass = () => {
        if (this.state.press == false) {
            this.setState({ showPass: false, press: true });
        } else {
            this.setState({ showPass: true, press: false });
        }
    };

    _showErrorMessage = message => {
        this.setState({ message: message });
        this.timeoutsSet.add(
            setTimeout(() => {
                this.setState({ message: '' });
            }, 3000)
        );
    };
}

export default SignInScreen;
