import React from 'react';
import {
    StyleSheet,
    View,
    AsyncStorage,
    TextInput,
    Text,
    ImageBackground,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import bgImage from '../images/background.png';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
const { width: WIDTH } = Dimensions.get('window');

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
                                style={styles.input}
                                placeholder="_ _ _ _"
                                placeholderTextColor="grey"
                                keyboardType='numeric'
                                onChangeText={(smsCode) => this.setState({ smsCode })}
                            />

                        </View>
                       
                        <TouchableOpacity style={styles.btnLogin} onPress={() => this._signInAsync()}>
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
                //console.log('token: ' + res.data.token);     
                //console.log('token: ' + JSON.stringify(res.data));              
                 //await AsyncStorage.setItem('userToken', 'abc');
                 //
            
                //  await axios.get('/user/info', { headers: { Authorization: 'Bearer ' + res.data.token } })
                
                // .catch((err) => {
                //     console.log(err);
                // })
                // .then((res)=>{
                //     console.log('infoooooooooooooooo: ' + JSON.stringify(res.data));
                //     this.props.navigation.navigate('App');
                // });
            
        }
        
    };
}

const styles = StyleSheet.create({
    backgroundContainer: {
        flex:1,
        width: null,
        height: null,
    },
    logoContainer: {
        marginLeft: 24,
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: '5%'
    },
    logoText: {
        color: 'white',
        fontSize: 32,
        fontWeight: '500',
    },
    logoIcon: {
        marginTop: 15
    },
    inputBlock: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    input: {
        width: WIDTH - 55,
        height: 45,
        borderWidth: 1,
        borderRadius: 15,
        fontSize: 16,
        paddingLeft: 65,
        marginHorizontal: 25
    },
    inputIcon: {
        position: 'absolute',
        top: 8,
        left: 37
    },
    inputContainer: {
        marginTop: 10
    },
    btnEye: {
        position: 'absolute',
        top: 8,
        right: 37
    },
    btnLogin: {
        width: WIDTH / 2,
        height: 45,
        borderRadius: 25,
        backgroundColor: 'black',
        justifyContent: 'center',
        marginTop: 30
    },
    text: {
        color: '#FFC234',
        fontSize: 16,
        textAlign: 'center'
    },
    h2: {
        fontSize: 18
    }

})
export default SmsScreen;

