import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles';

@inject('store')
@observer
class WaitCompleteOrder extends React.Component {
    state = {
        message: ''
    };

    render() {
        return (
            <View
                style={{
                    width: '90%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center'
                }}
            >
                <Text style={{ textAlign: 'center', fontSize: 16 }}>
                    Ожидайте подтверждение выполнения заказа диспетчером чтобы продолжить работу с приложением
                </Text>

                <TouchableOpacity
                    style={styles.buttonBottom}
                    onPress={() => this.props.navigation.navigate('AuthLoading')}
                >
                    <Text style={styles.text}>Обновить</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default WaitCompleteOrder;
