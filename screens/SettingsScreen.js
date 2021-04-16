import AsyncStorage from '@react-native-community/async-storage';
import iid from '@react-native-firebase/iid';
import axios from 'axios';
// import { TaskManager } from 'expo';
import md5 from 'md5';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { ActivityIndicator, NativeModules, Platform, Switch, Text, TextInput, View } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import LoadingButton from '../components/LoadingButton';
import messaging from '@react-native-firebase/messaging';
import styles from '../styles';
import {
    logButtonPress,
    logDisableOrderNotification,
    logEnableOrderNotification,
    logError,
    logInfo,
    logScreenView,
    logSignOut,
} from '../utils/FirebaseAnalyticsLogger';
import showAlert from '../utils/showAlert';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NetworkRequests from '../mobx/NetworkRequests';

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
        loadOnWork: false,
    };

    static navigationOptions = {
        title: 'Настройки',
    };

    timeoutsSet = new Set();

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
            logScreenView(TAG);
        });
    }
    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
        for (let timeout of this.timeoutsSet) {
            clearTimeout(timeout);
        }
        this.timeoutsSet.clear();
    }

    render() {
        return (
            <View style={styles.registrationScreen}>
                <View
                    style={{
                        alignSelf: 'stretch',
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 48,
                        justifyContent: 'space-between',
                        marginHorizontal: 16,
                        marginBottom: 16,
                    }}
                >
                    <Text onPress={this._changeNotificationsEnabled} style={{ fontSize: 18, flexWrap: 'wrap' }}>
                        Уведомления о новых заказах
                    </Text>
                    {this.state.loadOnWork ? (
                        <ActivityIndicator size="large" color="#FFC234" />
                    ) : (
                        <Switch
                            style={styles.flex1}
                            onValueChange={this._changeNotificationsEnabled}
                            value={this.props.store.onWork}
                        />
                    )}
                </View>
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
                <LoadingButton
                    style={styles.buttonBottom}
                    onPress={() => this._submitPassword()}
                    // eslint-disable-next-line react-native/no-raw-text
                >
                    СОХРАНИТЬ
                </LoadingButton>

                <LoadingButton
                    blackText
                    style={[styles.buttonConfirm, { width: styles.buttonConfirm.width * 2 }]}
                    onPress={this._signOutAsync}
                    // eslint-disable-next-line react-native/no-raw-text
                >
                    ВЫЙТИ ИЗ АККАУНТА
                </LoadingButton>
                {Platform.OS === 'ios' && <KeyboardSpacer />}
            </View>
        );
    }

    _changeNotificationsEnabled = async (value) => {
        this.setState({ loadOnWork: true });
        try {
            await this.props.store.setOnWork(value);
            if (value) {
                await logEnableOrderNotification();
            } else {
                await logDisableOrderNotification();
            }
        } catch (error) {
            logError({ TAG, error, info: `switch onWork to ${value}` });
            showAlert('Ошибка', error.toString());
        } finally {
            this.setState({ loadOnWork: false });
        }
    };

    _signOutAsync = async () => {
        try {
            await logButtonPress({ TAG, info: 'sign out' });
            await AsyncStorage.clear();
            await Platform.select({
                android: async () => {
                    await NativeModules.RNFirebasePushToken.deleteInstanceId();
                    await NativeModules.ForegroundTaskModule.stopService();
                },
                ios: async () => {
                    await iid().delete();
                    await BackgroundGeolocation.stop();
                    await BackgroundGeolocation.destroyLocations();
                },
            })();
            await logSignOut();
            this.props.navigation.navigate('SignIn');
        } catch (error) {
            logError({ TAG, error, info: 'user sign out' });
            showAlert('Ошибка', error.toString());
        }
    };

    _submitPassword = async () => {
        await logButtonPress({ TAG, info: 'submit password' });
        const id = await AsyncStorage.getItem('userId');
        if (this.state.currentPassword === '' || this.state.newPassword === '' || this.state.confirmPassword === '') {
            this._showErrorMessage('Все поля должны быть заполнены', 'red');
        } else {
            if (this.state.newPassword === this.state.confirmPassword) {
                const pass = await AsyncStorage.getItem('password');
                if (md5(this.state.currentPassword) === pass) {
                    try {
                        await logInfo({ TAG, info: 'patch worker' });
                        const res = await axios.patch('/worker/' + id, {
                            password: this.state.newPassword,
                        });
                        this._showErrorMessage('Данные успешно сохранены', 'green');
                    } catch (error) {
                        logError({ TAG, error, info: 'patch worker' });
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
