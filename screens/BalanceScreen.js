import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { AsyncStorage, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../styles';

@inject('store')
@observer
class BalanceScreen extends React.Component {
    state = {
        sum: null,
        message: ''
    };

    static navigationOptions = {
        title: 'Пополнить баланс'
    };

    willFocusSubscription = null;

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
            (async () => {
                try {
                    await this.props.store.getUserInfo();
                    //await CacheManager.clearCache();
                } catch (error) {
                    // TODO добавить вывод ошибки пользователю
                    console.log(error);
                    console.log('awdwadawdОшибка при получении новых данных, проверьте подключение к сети');
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
            <KeyboardAvoidingView style={styles.flex1} contentContainerStyle={styles.flex1} behavior='padding'>
                <View contentContainerStyle={styles.registrationScreen}>
                    <View style={styles.inputContainer}>
                        <Text style={{ marginBottom: 15, fontSize: 16 }}>
                            Ваш баланс:{' '}
                            <Text style={{ marginBottom: 10, fontSize: 16 }}>{this.props.store.balance}</Text> р.
                        </Text>
                        <Text style={{ marginBottom: 15, fontSize: 16 }}>
                            Введите сумму на которую хотите пополнить счет:
                        </Text>
                        <TextInput
                            ref={ref => (this.textInputRef = ref)}
                            style={styles.input}
                            placeholder='Сумма'
                            placeholderTextColor='grey'
                            keyboardType='numeric'
                            onChangeText={sum => this.setState({ sum })}
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
            </KeyboardAvoidingView>
        );
    }

    _goToRobokassa = async () => {
        if (!this.state.sum) return this.setState({ message: "Необходимо заполнить поле 'Сумма'" });

        this.props.navigation.navigate('Robokassa', {
            sum: this.state.sum,
            userId: await AsyncStorage.getItem('userId')
        });
    };
}

export default BalanceScreen;
