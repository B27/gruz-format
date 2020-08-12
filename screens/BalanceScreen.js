import AsyncStorage from '@react-native-community/async-storage';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import NumericInput from '../components/NumericInput';
import styles from '../styles';
import showAlert from '../utils/showAlert';
import axios from 'axios';
import qs from 'qs';

const axios2 = axios.create({
    baseURL: 'https://3dsec.sberbank.ru',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

@inject('store')
@observer
class BalanceScreen extends React.Component {
    state = {
        sum: null,
        message: '',
        sum: '',
    };

    static navigationOptions = {
        title: 'Пополнить баланс',
        headerTintColor: 'black',
    };

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
            (async () => {
                try {
                    await this.props.store.getUserInfo();
                    //await CacheManager.clearCache();
                } catch (error) {
                    // TODO добавить вывод ошибки пользователю
                    console.log(error);
                    console.log('Ошибка при получении новых данных, проверьте подключение к сети');
                    return;
                }

                this.setState({ ...this.props.store, message: '' });
            })();
        });
    }

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
    }

    render() {
        return (
            <View contentContainerStyle={styles.registrationScreen}>
                <View style={styles.inputContainer}>
                    <Text style={{ marginBottom: 15, fontSize: 16 }}>
                        Ваш баланс: <Text style={{ marginBottom: 10, fontSize: 16 }}>{this.props.store.balance}</Text>{' '}
                        р.
                    </Text>
                    <Text style={{ marginBottom: 15, fontSize: 16 }}>
                        Введите сумму на которую хотите пополнить счет:
                    </Text>
                    <NumericInput
                        style={styles.input}
                        placeholder="Сумма"
                        onChangeText={(sum) => this.setState({ sum })}
                        value={this.state.sum}
                    />
                </View>
                <Text style={{ color: 'red' }}>{this.state.message}</Text>
                <TouchableOpacity
                    style={[styles.buttonBottom, { marginTop: 0, alignSelf: 'center' }]}
                    onPress={this._goToRobokassa}
                >
                    <Text style={styles.text}>ПЕРЕЙТИ К ОПЛАТЕ</Text>
                </TouchableOpacity>
            </View>
        );
    }

    _goToRobokassa = async () => {
        if (!this.state.sum) {
            showAlert('Ошибка', "Необходимо заполнить поле 'Сумма'");
            return;
        }

        let url;

        try {
            const data = qs.stringify({
                userName: 'gruzformat-api',
                password: 'gruzformat',
                amount: `${this.state.sum}00`,
                orderNumber: `11`,
                returnUrl: '0',
                pageView: 'MOBILE',
            });
            const response = await axios2.post('/payment/rest/register.do', data);
            console.log(response.data);
            url = response.data.formUrl;
        } catch (error) {
            showAlert('Ошибка', error.toString());
            return;
        }

        this.props.navigation.navigate('Robokassa', {
            url,
            sum: this.state.sum,
            userId: await AsyncStorage.getItem('userId'),
        });
    };
}

export default BalanceScreen;
