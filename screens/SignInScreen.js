import React from 'react';
import {
    StyleSheet,
    View,
    Button,
    AsyncStorage,
    TextInput,
    Text,
    ImageBackground,
    Image
} from 'react-native';
import bgImage from '../images/background.png';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons'

class SignInScreen extends React.Component {
    state = {
        text: ''
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
                    <Icon name={'fiber-manual-record'} size={28} color={'black'} style={styles.logoIcon}/>
                    <Icon name={'fiber-manual-record'} size={28} color={'white'} style={styles.logoIcon}/>
                </View>
                <View style={styles.inputContainer}>
                    
                    <TextInput
                        style={{ height: 40 }}
                        placeholder="Type here to translate!"
                        onChangeText={(text) => this.setState({ text })}
                    />
                    <Text style={{ padding: 10, fontSize: 42 }}>
                        {this.state.text.split(' ').map((word) => word && '🍕').join(' ')}
                    </Text>
                    <Button title='Войти' onPress={() => this._signInAsync()} />
                </View>
            </ImageBackground>
        );
    }

    _signInAsync = async () => {
        await AsyncStorage.setItem('userToken', 'abc');
        this.props.navigation.navigate('App');
    };
}

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        width: null,
        height: null,
    },
    logoContainer: {
        
       
        marginLeft: 24,
        borderWidth: 2,
        borderColor: 'orange',
        flex: 1,
        justifyContent: 'center'
    },
    logoText: {
        color: 'white',
        fontSize: 30,
        fontWeight: '500',
        
    },
    inputContainer: {
        flex: 1,
        borderWidth: 2,
        borderColor: 'orange',
        justifyContent: 'center'
    }
})
export default SignInScreen;

