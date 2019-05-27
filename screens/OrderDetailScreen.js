import { inject, observer } from 'mobx-react/native';
import React, { Fragment } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconCam from 'react-native-vector-icons/MaterialIcons';
import ExpandCardBase from '../components/ExpandCardBase';
import OrderCard from '../components/OrderCard';
import styles from '../styles';

@inject('store')
@observer
class OrderDetailScreen extends React.Component {
    state = {
        order: { id: '0', time: '13:23', address: 'Chertenkova 2', description: 'test 1' },
        dispatcher: { name: 'Ваня', phone: '111111' },
        driver: { name: 'Вова', phone: '222222' },
        movers: [
            { _id: 1, name: 'Петя', phone: '333333' },
            { _id: 2, name: 'Петя', phone: '333333' },
            { _id: 3, name: 'Петя', phone: '333333' }
        ]
    };

    static navigationOptions = {
        title: 'Выполнение заказа'
    };
    componentDidMount = async () => {

    }
    render() {
        const { dispatcher, driver, movers } = this.state;
        const { store } = this.props;
        return (
            <Fragment>
                <ScrollView>
                    <OrderCard
                        fullAddress
                        expandAlways
                        time={store.order.start_time}
                        addresses={store.order.locations}
                        description={store.order.comment}
                        cardStyle={styles.cardMargins}
                    />
                    <ExpandCardBase
                        OpenComponent={<Text style={styles.cardH2}>Исполнители</Text>}
                        HiddenComponent={
                            <Fragment>
                                <View style={styles.cardDescription}>
                                    {store.dispatcher && (
                                        <View>
                                            <Text style={styles.executorTextDisp}>Диспетчер:</Text>
                                            <View style={styles.executorsRow}>
                                                <View>
                                                    <IconCam
                                                        name={'camera'}
                                                        color={'#FFC234'}
                                                        size={50}
                                                        style={styles.orderIcon}
                                                    />
                                                </View>
                                                <View>
                                                    <Text>{store.dispatcher.name}</Text>
                                                    <Text>{store.dispatcher.phoneNum}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                    <View>
                                        <Text style={styles.executorText}>Водитель:</Text>
                                        <View style={styles.executorsRow}>
                                            <View>
                                                <IconCam
                                                    name={'camera'}
                                                    color={'#FFC234'}
                                                    size={50}
                                                    style={styles.orderIcon}
                                                />
                                            </View>
                                            <View>
                                                <Text>{driver.name}</Text>
                                                <Text>{driver.phone}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={styles.executorText}>
                                            {movers.length > 1 ? 'Грузчики:' : 'Грузчик'}
                                        </Text>
                                        {movers.map(mover => (
                                            <View key={mover._id} style={styles.executorsRow}>
                                                <View>
                                                    <IconCam
                                                        name={'camera'}
                                                        color={'#FFC234'}
                                                        size={50}
                                                        style={styles.orderIcon}
                                                    />
                                                </View>
                                                <View>
                                                    <Text>{mover.name}</Text>
                                                    <Text>{mover.phone}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </Fragment>
                        }
                        cardStyle={styles.cardMargins}
                    />
                    <TouchableOpacity style={styles.cardChat} onPress={this._chatPress}>
                        <View style={styles.cardRowTopContainer}>
                            <Text style={styles.cardH2}>Чат</Text>
                            <Icon name='chevron-right' size={42} color='#c4c4c4' />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <View style={styles.absoluteButtonContainer}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonCancel} onPress={this._cancelOrderPress}>
                            <Text style={styles.buttonText}>ОТМЕНА</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonConfirm} onPress={this._completeOrderPress}>
                            <Text style={styles.buttonText}>ГОТОВО</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Fragment>
        );
    }

    _cancelOrderPress = () => {
        Alert.alert(
            'Вы уверены, что хотите отменить заказ ?',
            'За отказ вам будет выставлена минимальная оценка.',
            [
                {
                    text: 'ОТМЕНА',
                    style: 'cancel'
                },
                {
                    text: 'ОК',
                    onPress: this._cancelOrder
                }
            ],
            { cancelable: true }
        );
    };

    _cancelOrder = async () => {
        try {
            await this.props.store.cancelFulfillingOrder();
            this.props.navigation.navigate('Main');
        } catch (error) {
            console.log('error in OrderDetailScreen cancelOrder', error);
        }
   
    };

    _completeOrderPress = () => {
        this.props.navigation.navigate('Main');
    };

    _chatPress = () => {
        this.props.navigation.navigate('OrderChat');
    };
}

export default OrderDetailScreen;
