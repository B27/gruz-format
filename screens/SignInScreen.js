import React from 'react';
import {
    View,
    AsyncStorage,
    TextInput,
    Text,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import bgImage from '../images/background.png';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import styles from '../styles'

class SignInScreen extends React.Component {
    state = {
        phone: ''
    }
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <ImageBackground source={bgImage} style={styles.backgroundContainer}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>
                        ДОБРО {"\n"}ПОЖАЛОВАТЬ
                    </Text>
                    <Icon name={'fiber-manual-record'} size={42} color={'black'} style={styles.logoIcon} />
                    <Icon name={'fiber-manual-record'} size={42} color={'white'} style={styles.logoIcon} />
                </View>
                <View style={styles.inputBlock}>
                    <Text style={styles.h2}>Введите номер телефона</Text>
                    <View style={styles.inputContainer} behavior="padding" enabled>

                        <Icon name={'phone'} size={28} color="#FFC234" style={styles.inputIcon} />
                        <Text style={styles.countryCode}>+7</Text>
                        <TextInput
                            style={styles.inputWithIconCountryCode}
                            placeholder="Номер телефона"
                            placeholderTextColor="grey"
                            keyboardType='numeric'
                            onChangeText={(phone) => this.setState({ phone })}
                        />

                    </View>
                    <Text style={styles.description}>На указанный Вами номер будет отправлено СМС с кодом подтверждения</Text>

                    <TouchableOpacity style={styles.button} onPress={() => this._signInAsync()}>
                        <Text style={styles.text} >ПРОДОЛЖИТЬ</Text>
                    </TouchableOpacity>

                </View>
            </ImageBackground>

        );
    }
    _signInAsync = async () => {
        if (this.state.phone) {
            console.log(this.state.phone);

            await axios.post('/enter/phone', { phoneNum: this.state.phone })
                .catch((err) => {
                    console.log(err);
                })
                .then(async (res) => {
                    console.log(res.data);
                    await AsyncStorage.setItem('phoneNum', this.state.phone)
                    this.props.navigation.navigate('Sms');
                });

        }
    };
}

export default SignInScreen;

