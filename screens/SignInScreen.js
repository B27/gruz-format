import axios from 'axios';
import md5 from 'md5';
import React from 'react';
import { AsyncStorage, ImageBackground, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import bgImage from '../images/background.png';
import styles from '../styles';

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
            <KeyboardAvoidingView style={styles.flex1} contentContainerStyle={styles.flex1} behavior='position' keyboardVerticalOffset={-50}>
                <ImageBackground source={bgImage} style={styles.backgroundContainer}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>ДОБРО {'\n'}ПОЖАЛОВАТЬ</Text>
                        <Icon name={'fiber-manual-record'} size={42} color={'black'} style={styles.logoIcon} />
                        <Icon name={'fiber-manual-record'} size={42} color={'white'} style={styles.logoIcon} />
                    </View>
                    <View style={styles.inputBlock}>
                        <View style={styles.inputContainer} behavior='padding' enabled>
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
                        <TouchableOpacity style={styles.button} onPress={this._signInAsync}>
                            <Text style={styles.text}>ВОЙТИ</Text>
                        </TouchableOpacity>
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

    _signInAsync = async () => {
        if (!this.state.phone || !this.state.password) {
            return this.setState({ message: 'Введенные данные некорректны' });
        } else {
            const response = await axios
                .post('/login', {
                    login: this.state.phone,
                    password: this.state.password
                })
                .catch(err => {
                    console.log(err);
                });

            console.log(response.data);

            if (response.data.token) {
                await AsyncStorage.setItem('password', md5(this.state.password));
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('userId', response.data._id);
                axios.defaults.headers = {
                    Authorization: 'Bearer ' + response.data.token
                };
                console.log('SignInScreen navigate to Main', this.props.navigation.state);
                this.props.navigation.navigate('Main');
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
