import { inject, observer } from 'mobx-react/native';
import React, { Fragment } from 'react';
import { Alert, AppState, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconCam from 'react-native-vector-icons/MaterialIcons';
import ExpandCardBase from '../components/ExpandCardBase';
import OrderCard from '../components/OrderCard';
import styles from '../styles';

const TAG = '~OrderDetailScreen.js~';

@inject('store')
@observer
class OrderDetailScreen extends React.Component {
    state = {
        refreshing: false
    };

    static navigationOptions = {
        title: 'Выполнение заказа'
    };

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);

        this.willFocusSubscription = this.props.navigation.addListener('willFocus', this._orderRefresher);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);

        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
    }

    _orderRefresher = () => {
        console.log(TAG, 'willFocus');
        const { lastOrderPullTime } = this.props.store;
        const timeDiff = Date.now() - lastOrderPullTime;
        if (timeDiff > 5 * 60 * 1000) {
            console.log(TAG, 'time to refresh');
            this._onRefresh();
        }
    };

    _onRefresh = async () => {
        this.setState({ refreshing: true });
        try {
            await this.props.store.pullFulfilingOrderInformation();
        } catch (error) {
            // TODO добавить вывод ошибки пользователю
            console.log('onRefresh OrderDetailScreen error', error);
        }
        this.setState({ refreshing: false });
    };

    _handleAppStateChange = nextAppState => {
        console.log(TAG, 'state changed', nextAppState);
        if (nextAppState === 'active') {
            console.log(TAG, 'App has come to the foreground!');
            this._orderRefresher();
        }
    };

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
        this.props.navigation.navigate('OrderComplete');
    };

    _chatPress = () => {
        this.props.navigation.navigate('OrderChat');
    };

    render() {
        const { workers: workersObservable, order, dispatcher } = this.props.store;

        const workers = workersObservable.slice();

        const driver = workers.find(worker => worker.isDriver);
        const movers = workers.filter(worker => !worker.isDriver);
        return (
            <Fragment>
                <ScrollView
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}
                >
                    <OrderCard
                        fullAddress
                        expandAlways
                        time={order.start_time}
                        addresses={order.locations}
                        description={order.comment}
                        cardStyle={styles.cardMargins}
                    />
                    <ExpandCardBase
                        OpenComponent={<Text style={styles.cardH2}>Исполнители</Text>}
                        HiddenComponent={
                            <Fragment>
                                <View style={styles.cardDescription}>
                                    {dispatcher && (
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
                                                    <Text>{dispatcher.name}</Text>
                                                    <Text>{dispatcher.phoneNum}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                    {driver && (
                                        <View>
                                            <Text style={styles.executorText}>Водитель:</Text>
                                            <View style={styles.executorsRow}>
                                                <View>
                                                    {driver.avatar ? (
                                                        <Image
                                                            style={styles.executorImage}
                                                            source={{ uri: driver.avatar }}
                                                        />
                                                    ) : (
                                                        <IconCam
                                                            name={'camera'}
                                                            color={'#FFC234'}
                                                            size={50}
                                                            style={styles.orderIcon}
                                                        />
                                                    )}
                                                </View>
                                                <View>
                                                    <Text>{driver.name}</Text>
                                                    <Text>{driver.phoneNum}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                    {movers.length != 0 && (
                                        <View>
                                            <Text style={styles.executorText}>
                                                {movers.length > 1 ? 'Грузчики:' : 'Грузчик'}
                                            </Text>
                                            {movers.map(mover => (
                                                <View key={mover.id} style={styles.executorsRow}>
                                                    <View>
                                                        {mover.avatar ? (
                                                            <Image
                                                                style={styles.executorImage}
                                                                source={{ uri: mover.avatar }}
                                                            />
                                                        ) : (
                                                            <IconCam
                                                                name={'camera'}
                                                                color={'#FFC234'}
                                                                size={50}
                                                                style={styles.orderIcon}
                                                            />
                                                        )}
                                                    </View>
                                                    <View>
                                                        <Text>{mover.name}</Text>
                                                        <Text>{mover.phoneNum}</Text>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </Fragment>
                        }
                        cardStyle={styles.cardMargins}
                    />
                    <TouchableOpacity style={[styles.cardChat, styles.spaceBottom]} onPress={this._chatPress}>
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
                            <Text style={styles.buttonText}>ЗАВЕРШИТЬ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Fragment>
        );
    }
}

export default OrderDetailScreen;
