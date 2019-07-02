import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import React, { Fragment } from 'react';
import { Alert, AppState, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconCam from 'react-native-vector-icons/MaterialIcons';
import ExpandCardBase from '../components/ExpandCardBase';
import OrderCard from '../components/OrderCard';
import styles from '../styles';
import * as NotificationListener from '../utils/NotificationListener';
import showAlert from '../utils/showAlert';

const TAG = '~OrderDetailScreen.js~';

@inject('store')
@observer
class OrderDetailScreen extends React.Component {
    state = {
        message: false,
        refreshing: false
    };

    static navigationOptions = {
        title: 'Выполнение заказа'
    };

    timeoutsSet = new Set();

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        this.componentIsMount = true;
        NotificationListener.setRefreshCallback(this._onRefresh);
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', this._orderRefresher);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        NotificationListener.setRefreshCallback(null);

        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }

        for (let timeout of this.timeoutsSet) {
            clearTimeout(timeout);
        }
        this.timeoutsSet.clear();

        this.componentIsMount = false;
    }

    _orderRefresher = () => {
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
            this._checkOrderChanges();
        } catch (error) {
            console.log(TAG, error);
            this._showErrorMessage(error.toString());
        }

        if (this.componentIsMount) {
            this.setState({ refreshing: false });
        }
    };

    _handleAppStateChange = nextAppState => {
        console.log(TAG, 'state changed', nextAppState);
        if (nextAppState === 'active') {
            console.log(TAG, 'App has come to the foreground!');
            this._onRefresh();
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
            console.log(TAG, error);
            this._showErrorMessage(error.toString());
        }
    };

    _completeOrderPress = () => {
        this.props.navigation.navigate('OrderComplete');
    };

    _chatPress = () => {
        this.props.navigation.navigate('OrderChat');
    };

    _checkOrderChanges = () => {
        console.log(TAG, 'check order changes');

        const order = toJS(this.props.store.order);
        const workers = toJS(this.props.store.workers);
        const userId = toJS(this.props.store.userId);

        console.log(TAG, 'order status', order.status);
        console.log(TAG, 'workers', workers);
        console.log(TAG, 'userId', userId);

        if (order.status === 'rejected') {
            console.log(TAG, 'order rejected');
            showAlert('Отмена заказа', 'Заказ над которым вы работаете был отменён', { okFn: undefined });
            this.props.navigation.navigate('AuthLoading');
            return;
        }

        if (!workers.filter(worker => worker.id == userId).length) {
            console.log(TAG, 'user not in order');
            showAlert('Исключение из заказа', 'Вы были исключены из заказа', { okFn: undefined });
            this.props.navigation.navigate('AuthLoading');
            return;
        }
    };

    _showErrorMessage = message => {
        this.setState({ message: message });
        this.timeoutsSet.add(
            setTimeout(() => {
                this.setState({ message: false });
            }, 3000)
        );
    };

    render() {
        const { workers: workersObservable, order, dispatcher } = this.props.store;

        const workers = toJS(workersObservable);

        const driver = workers.find(worker => worker.isDriver);
        const movers = workers.filter(worker => !worker.isDriver);
        return (
            <Fragment>
                <ScrollView
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}
                >
                    {this.state.message && (
                        <Text style={{ color: 'red', textAlign: 'center', fontSize: 16 }}>{this.state.message}</Text>
                    )}
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
