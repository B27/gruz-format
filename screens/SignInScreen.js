import axios from 'axios';
import md5 from 'md5';
import React from 'react';
import {
    AsyncStorage,
    ImageBackground,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView
} from 'react-native';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import bgImage from '../images/background.png';
import styles from '../styles';
import LoadingButton from '../components/LoadingButton';

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
    //flow
    render() {
        return (
            <KeyboardAvoidingView
                style={styles.flex1}
                contentContainerStyle={styles.flex1}
                behavior='position'
                // keyboardVerticalOffset={-50}
            >
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
                                <Icon2
                                    name={this.state.press == false ? 'md-eye' : 'md-eye-off'}
                                    size={26}
                                    color='grey'
                                />
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
            </KeyboardAvoidingView>
        );
    }

    goToRegistartionScreen = () => {
        console.log('SignInScreen goToRegistartionScreen');

        this.props.navigation.navigate('RegisterPerson');
    };

    _signInAsync = async offButtonSetState => {
        this.setState({ message: '' });
        if (!this.state.phone || !this.state.password) {
            this.setState({ message: 'Введите логин и пароль' });
        } else {
            try {
                const response = await axios.post('/login', {
                    login: this.state.phone,
                    password: this.state.password
                });
                console.log(response.data);

                let promiseArr = [];
                promiseArr.push(AsyncStorage.setItem('password', md5(this.state.password)));
                promiseArr.push(AsyncStorage.setItem('token', response.data.token));
                promiseArr.push(AsyncStorage.setItem('userId', response.data._id));

                await Promise.all(promiseArr);

                axios.defaults.headers = {
                    Authorization: 'Bearer ' + response.data.token
                };

                offButtonSetState();
                this.props.navigation.navigate('AuthLoading');
            } catch (error) {
                if (error.response) {
                    console.log(
                        'Error axios in SignInScreen post /login',
                        error.response.status,
                        error.response.data.message
                    );
                    switch (error.response.status) {
                        case 404:
                            this.setState({ message: 'Пользователь не найден' });
                            break;
                        case 403:
                            this.setState({ message: 'Введён неверный пароль' });
                            break;
                    }
                } else {
                    console.log('Error in SignInScreen');
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
}

export default SignInScreen;
