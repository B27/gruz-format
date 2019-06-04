import axios from 'axios';
import { TaskManager } from 'expo';
import md5 from 'md5';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { AsyncStorage, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import styles from '../styles';

@inject('store')
@observer
class WaitCompleteOrder extends React.Component {
    state = {
        message: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        colorMessage: 'red'
    };
    static navigationOptions = {
        title: 'Настройки'
    };

    render() {
        return (
            <View style={{ width: '90%', height: '100%', alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
                        <Text style={{textAlign: 'center', fontSize: 16}}>Ожидайте подтверждение выполнения заказа диспетчером, чтобы продолжить работу с приложением</Text>
                    
                
                <TouchableOpacity style={styles.buttonBottom} onPress={() => this.props.navigation.navigate('AuthLoading')}>
                    <Text style={styles.text}>Обновить</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default WaitCompleteOrder;
