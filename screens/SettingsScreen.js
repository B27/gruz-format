import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
// import { TaskManager } from 'expo';
import md5 from 'md5';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { NativeModules, Text, TextInput, View, Platform } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import LoadingButton from '../components/LoadingButton';
import styles from '../styles';
import BackgroundGeolocation from 'react-native-background-geolocation';
import iid from '@react-native-firebase/iid';
import firebase from '@react-native-firebase/app';
import showAlert from '../utils/showAlert';

const TAG = '~SettingsScreen~';
@inject('store')
@observer
class SettingsScreen extends React.Component {
    state = {
        message: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        colorMessage: 'red',
    };

    static navigationOptions = {
        title: 'Настройки',
    };

    timeoutsSet = new Set();

    componentWillUnmount() {
        for (let timeout of this.timeoutsSet) {
            clearTimeout(timeout);
        }
        this.timeoutsSet.clear();
    }

    render() {
        return (
            <View style={styles.registrationScreen}>
                <Text style={{ fontSize: 18, marginBottom: 10 }}>Изменение пароля</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Текущий пароль"
                        placeholderTextColor="grey"
                        onChangeText={(currentPassword) => this.setState({ currentPassword })}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Новый пароль"
                        secureTextEntry={true}
                        placeholderTextColor="grey"
                        onChangeText={(newPassword) => this.setState({ newPassword })}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Повторите пароль"
                        secureTextEntry={true}
                        placeholderTextColor="grey"
                        onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                    />
                </View>
                <Text style={{ color: this.state.colorMessage }}>{this.state.message}</Text>
                <LoadingButton style={styles.buttonBottom} onPress={() => this._submitPassword()}>
                    СОХРАНИТЬ
                </LoadingButton>

                <LoadingButton
                    blackText
                    style={[styles.buttonConfirm, { width: styles.buttonConfirm.width * 2 }]}
                    onPress={this._signOutAsync}
                >
                    ВЫЙТИ ИЗ АККАУНТА
                </LoadingButton>
                <KeyboardSpacer />
            </View>
        );
    }

    _signOutAsync = async () => {
        try {
            await AsyncStorage.clear();
            await Platform.select({
                android: async () => {
                    await NativeModules.RNFirebasePushToken.deleteInstanceId();
                    await NativeModules.ForegroundTaskModule.stopService();
                },
                ios: async () => {
                    await firebase.iid().delete();
                    await BackgroundGeolocation.stop();
                    await BackgroundGeolocation.destroyLocations();
                },
            })();
            this.props.navigation.navigate('SignIn');
        } catch (error) {
            showAlert('Ошибка', error.toString());
        }
    };

    _submitPassword = async () => {
        const id = await AsyncStorage.getItem('userId');
        if (this.state.currentPassword === '' || this.state.newPassword === '' || this.state.confirmPassword === '') {
            this._showErrorMessage('Все поля должны быть заполнены', 'red');
        } else {
            if (this.state.newPassword === this.state.confirmPassword) {
                const pass = await AsyncStorage.getItem('password');
                if (md5(this.state.currentPassword) === pass) {
                    try {
                        const res = await axios.patch('/worker/' + id, {
                            password: this.state.newPassword,
                        });
                        console.log(res.data);
                        this._showErrorMessage('Данные успешно сохранены', 'green');
                    } catch (error) {
                        console.log(error);
                    }
                } else this._showErrorMessage('Вы ввели неверный пароль', 'red');
            } else this._showErrorMessage('Пароли не совпадают', 'red');
        }
    };

    _showErrorMessage = (message, color) => {
        this.setState({ message: message, colorMessage: color });
        this.timeoutsSet.add(
            setTimeout(() => {
                this.setState({ message: '' });
            }, 3000),
        );
    };
}

export default SettingsScreen;
