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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import styles from '../styles';

class SmsScreen extends React.Component {
    state = {
        phone: '',
        smsCode: ''
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
                        <Text style={styles.h2}>Введите код из СМС</Text>
                        <View style={styles.inputContainer} behavior="padding" enabled>

                            <Icon name={'phone'} size={28} color="#FFC234" style={styles.inputIcon} />

                            <TextInput
                                style={styles.inputWithIcon}
                                placeholder="_ _ _ _"
                                placeholderTextColor="grey"
                                keyboardType='numeric'
                                onChangeText={(smsCode) => this.setState({ smsCode })}
                            />

                        </View>
                       
                        <TouchableOpacity style={styles.button} onPress={() => this._signInAsync()}>
                            <Text style={styles.text} >ВХОД</Text>
                        </TouchableOpacity>

                    </View>
                </ImageBackground>

        );
    }

    _signInAsync = async () => {
        if(this.state.smsCode) {
            const phoneNum = await AsyncStorage.getItem('phoneNum')
            const res = await axios.post('/enter/sms_code', 
            {
                phoneNum: phoneNum,
                smsCode: this.state.smsCode
            })
            .catch((err) => {
                console.log(err);
            });
            if (res.data.token) {
                await AsyncStorage.setItem('token', res.data.token);
                await AsyncStorage.setItem('userId', res.data._id);
                if (res.data.height !== 0) {
                    this.props.navigation.navigate('App');
                } else {
                    this.props.navigation.navigate('RegisterPerson')
                }
                
            }            
        }       
    };
}

export default SmsScreen;

