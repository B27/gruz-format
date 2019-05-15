import React from 'react';
import { View, AsyncStorage, TextInput, Text, ImageBackground, TouchableOpacity } from 'react-native';
import bgImage from '../images/background.png';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import styles from '../styles';

class SignInScreen extends React.Component {
    state = {
        login: '',
        password: '',
        showPass: true,
        press: false
    };
    static navigationOptions = {
        header: null
    };
    //flow
    render() {
        return (
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
                            placeholder='Логин'
                            placeholderTextColor='grey'
                            onChangeText={login => this.setState({ login })}
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
        );
    }
    goToRegistartionScreen = () => {
        console.log('SignInScreen goToRegistartionScreen');

        this.props.navigation.navigate('RegisterPerson');
    };
    _signInAsync = async () => {
        // console.log("SignInScreen navigate to Main", this.props.navigation.state);
        this.props.navigation.navigate("Main") ;
        // Удалить перед слиянием
        // if (this.state.phone) {
        //     console.log(this.state.phone);

        //     await axios
        //         .post('/enter/phone', { phoneNum: this.state.phone })
        //         .catch(err => {
        //             console.log(err);
        //         })
        //         .then(async res => {
        //             console.log(res.data);
        //             await AsyncStorage.setItem('phoneNum', this.state.phone);
        //             this.props.navigation.navigate('Sms');
        //         });
        // }
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
