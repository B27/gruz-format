import React from 'react';
import {
    StyleSheet,
    View,
    AsyncStorage,
    TextInput,
    Text,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import bgImage from '../images/background.png';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width: WIDTH } = Dimensions.get('window');

class SignInScreen extends React.Component {
    state = {
        login: '',
        password: '',
        showPass: true,
        press: false
    }
    static navigationOptions = {
        header: null
    };

    showPass = () => {
        if (this.state.press == false) {
            this.setState({ showPass: false, press: true })
        } else {
            this.setState({ showPass: true, press: false })
        }
    }

    render() {
        return (
            <KeyboardAwareScrollView
                style={{flex: 1}}
                contentContainerStyle={{ flex: 1 }}
                resetScrollToCoords={{ x: 0, y: 0 }}
                enableResetScrollToCoords='true'
                enableOnAndroid='true'
                enableAutomaticScroll='true'
            >
                <ImageBackground source={bgImage} style={styles.backgroundContainer}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>
                            ДОБРО {"\n"}ПОЖАЛОВАТЬ
                    </Text>
                        <Icon name={'fiber-manual-record'} size={42} color={'black'} style={styles.logoIcon} />
                        <Icon name={'fiber-manual-record'} size={42} color={'white'} style={styles.logoIcon} />
                    </View>
                    <View style={styles.inputBlock}>

                        <View style={styles.inputContainer} behavior="padding" enabled>

                            <Icon name={'person'} size={28} color="#FFC234" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Логин"
                                placeholderTextColor="grey"
                                onChangeText={(login) => this.setState({ login })}
                            />

                        </View>

                        <View style={styles.inputContainer}>
                            <Icon name={'lock'} size={28} color="#FFC234" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Пароль"
                                secureTextEntry={this.state.showPass}
                                placeholderTextColor="grey"
                                onChangeText={(password) => this.setState({ password })}
                            />
                            <TouchableOpacity style={styles.btnEye}
                                onPress={this.showPass.bind(this)}>
                                <Icon2 name={this.state.press == false ? 'md-eye' : 'md-eye-off'} size={26} color="grey" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.btnLogin} onPress={() => this._signInAsync()}>
                            <Text style={styles.text} >ВОЙТИ</Text>
                        </TouchableOpacity>

                    </View>
                </ImageBackground>
            </KeyboardAwareScrollView>
        );
    }

    _signInAsync = async () => {
        await AsyncStorage.setItem('userToken', 'abc');
        this.props.navigation.navigate('App');
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
        paddingLeft: 45,
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
        marginTop: 20
    },
    text: {
        color: '#FFC234',
        fontSize: 16,
        textAlign: 'center'
    }
})
export default SignInScreen;

