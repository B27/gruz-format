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

class SignInScreen extends React.Component {
    state = {
        phone: ''
    }
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            // <KeyboardAwareScrollView
            //     style={{flex: 1}}
            //     contentContainerStyle={{ flex: 1 }}
            //     resetScrollToCoords={{ x: 0, y: 0 }}
            //     enableResetScrollToCoords={true}
            //     enableOnAndroid={true}
            //     enableAutomaticScroll={true}
            // >
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
                                style={styles.input}
                                placeholder="Номер телефона"
                                placeholderTextColor="grey"
                                keyboardType='numeric'
                                onChangeText={(phone) => this.setState({ phone })}
                            />

                        </View>
                        <Text style={styles.description}>На указанный Вами номер будет отправлено СМС с кодом подтверждения</Text>

                        <TouchableOpacity style={styles.btnLogin} onPress={() => this._signInAsync()}>
                            <Text style={styles.text} >ПРОДОЛЖИТЬ</Text>
                        </TouchableOpacity>

                    </View>
                </ImageBackground>
            // </KeyboardAwareScrollView>
        );
    }

    _signInAsync = async () => {
        if(this.state.phone) {
            console.log(this.state.phone);
            
            await axios.post('/enter/phone', {phoneNum: this.state.phone})
            .catch((err) => {
                console.log(err);
            })
            .then(async (res)=> {
                console.log(res.data);
                await AsyncStorage.setItem('phoneNum', this.state.phone)
                this.props.navigation.navigate('Sms');
            });
            
        }
        //  await AsyncStorage.setItem('userToken', 'abc');
        // this.props.navigation.navigate('App');
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
        paddingLeft: 71,
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
    countryCode: {
        position: 'absolute',
        top: 12,
        paddingLeft: 71,
        
        fontSize: 16,
    },
    h2: {
        fontSize: 18
    },
    description: {
        color: 'grey',
        marginHorizontal: 35,
        textAlign: 'center',
        top: 10
    }
})
export default SignInScreen;

