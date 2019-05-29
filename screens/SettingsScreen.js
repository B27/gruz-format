import axios from 'axios';
import md5 from 'md5';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import {
    AsyncStorage,
    Button,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import styles from '../styles';

@inject('store')
@observer
class MyInfoScreen extends React.Component {
    state = {
        message: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        colorMessage: 'red'
    };
    static navigationOptions = {
        title: 'Моя информация',
        headerLeft: null
    };

    render() {
        this.props.navigation.addListener('willFocus', () => {
            (async () => {
                try {
                    await store.getUserInfo();
                } catch (error) {
                    // TODO добавить вывод ошибки пользователю
                    console.log('Ошибка при получении новых данных, проверьте подключение к сети');                   
                }
                this.setState(this.props.store);
            })();
        });
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={85} behavior='padding'>
                <ScrollView contentContainerStyle={styles.registrationScreen}>
                    <Text style={{ fontSize: 18, marginBottom: 10 }}>Изменение пароля</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder='Текущий пароль'
                            placeholderTextColor='grey'
                            onChangeText={currentPassword => this.setState({ currentPassword })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder='Новый пароль'
                            secureTextEntry={true}
                            placeholderTextColor='grey'
                            onChangeText={newPassword => this.setState({ newPassword })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder='Повторите пароль'
                            secureTextEntry={true}
                            placeholderTextColor='grey'
                            onChangeText={confirmPassword => this.setState({ confirmPassword })}
                        />
                    </View>
                    <Text style={{ color: this.state.colorMessage }}>{this.state.message}</Text>
                    <TouchableOpacity style={styles.buttonBottom} onPress={() => this._submitPassword()}>
                        <Text style={styles.text}>СОХРАНИТЬ</Text>
                    </TouchableOpacity>
                    <View>
                        <Button title='Выйти из аккаунта' onPress={() => this._signOutAsync()} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    };
    _submitPassword = async () => {
        const id = await AsyncStorage.getItem('userId');
        if (this.state.currentPassword === '' || this.state.newPassword === '' || this.state.confirmPassword === '') {
            this.setState({ message: 'Все поля должны быть заполнены', colorMessage: 'red' });
        } else {
            if (this.state.newPassword === this.state.confirmPassword) {
                const pass = await AsyncStorage.getItem('password');
                if (md5(this.state.currentPassword) === pass) {
                    try {
                        const res = await axios.patch('/worker/' + id, {
                            password: this.state.newPassword
                        });
                        console.log(res.data);
                        this.setState({ message: 'Данные успешно сохранены', colorMessage: 'green' });
                    } catch (error) {
                        console.log(error);
                    }
                } else this.setState({ message: 'Вы ввели неверный пароль', colorMessage: 'red' });
            } else this.setState({ message: 'Пароли не совпадают', colorMessage: 'red' });
        }
    };
}

export default MyInfoScreen;
