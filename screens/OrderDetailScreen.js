import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import React, { Fragment } from 'react';
import {
    Alert,
    AppState,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    NativeModules,
    Platform,
} from 'react-native';
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
        refreshing: false,
    };

    static navigationOptions = {
        title: 'Выполнение заказа',
        headerBackTitle: 'Назад',
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
            await this.props.store.pullFulfilingOrderInformation(this.props.store.order._id);

            this._checkOrderChanges();
        } catch (error) {
            console.log(TAG, error);
            this._showErrorMessage(error.toString());
        }

        if (this.componentIsMount) {
            this.setState({ refreshing: false });
        }
    };

    _handleAppStateChange = (nextAppState) => {
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
                    style: 'cancel',
                },
                {
                    text: 'ОК',
                    onPress: this._cancelOrder,
                },
            ],
            { cancelable: true },
        );
    };

    _cancelOrder = async () => {
        try {
            await this.props.store.cancelFulfillingOrder();
            await Platform.select({
                android: async () => {
                    await NativeModules.ForegroundTaskModule.stopService();
                },
                ios: async () => {},
            })();
            this.props.navigation.navigate('Main');
        } catch (error) {
            console.log(TAG, error);
            if (error.response.status === 400) {
                showAlert('Ошибка', error.response.data.message);
            }
            showAlert('Ошибка', error.message.toString());
        }
    };

    _completeOrderPress = () => {
        this.props.navigation.navigate('OrderComplete');
    };

    _chatPress = () => {
        this.props.navigation.navigate('OrderChat');
    };

    _addThirdPartyWorker = async () => {
        try {
            await this.props.store.addThirdPartyWorkerToOrder();
            await this._onRefresh();
        } catch (e) {
            console.log('[OrderDetailScreen]._AddThirdPartyWorker() e', e);
            if (e.toString().indexOf('allowed') !== -1) {
                showAlert('Ошибка', 'Вы не можете добавлять больше рабочих');
            } else if (e.toString().indexOf('anymore') !== -1) {
                showAlert('Ошибка', 'Набрано максимум рабочих на заказе');
            } else if (e.toString().indexOf('need loaders') !== -1) {
                showAlert('Ошибка', 'В заказе рабочие не нужны');
            } else {
                showAlert('Ошибка при добавлении', e);
            }
        }
    };

    _DeleteThirdPartyWorker = async () => {
        try {
            await this.props.store.deleteThirdPartyWorkerToOrder();
            this._onRefresh();
        } catch (e) {
            if (e.response) {
                showAlert('Ошибка при удалении', e.response.data.message);
            } else {
                showAlert('Ошибка при удалении', e);
            }
        }
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
            showAlert('Отмена заказа', 'Заказ над которым вы работаете был отменён');
            this.props.navigation.navigate('AuthLoading');
            return;
        }

        if (!workers.filter((worker) => worker.id == userId).length) {
            console.log(TAG, 'user not in order');
            showAlert('Исключение из заказа', 'Вы были исключены из заказа');
            this.props.navigation.navigate('AuthLoading');
            return;
        }
    };

    _showErrorMessage = (message) => {
        this.setState({ message: message });
        this.timeoutsSet.add(
            setTimeout(() => {
                this.setState({ message: false });
            }, 3000),
        );
    };

    renderWorkerInfo(workers, name, canDelete) {
        if (!workers) return null;
        if (workers.length == 0) return null;

        return (
            <View>
                <Text style={styles.executorText}>{name}</Text>
                {workers.map((worker) => (
                    <View key={worker.id} style={styles.executorsRow}>
                        <View>
                            {worker.avatar ? (
                                <Image style={styles.executorImage} source={{ uri: worker.avatar }} />
                            ) : (
                                <IconCam name={'camera'} color={'#FFC234'} size={50} style={styles.orderIcon} />
                            )}
                        </View>
                        <View>
                            <Text>{worker.name}</Text>
                            <Text>{worker.phoneNum}</Text>
                        </View>
                        {canDelete && (
                            <View>
                                <TouchableOpacity
                                    style={styles.buttonDeleteWorker}
                                    onPress={this._DeleteThirdPartyWorker}
                                >
                                    <Text style={styles.buttonText}>X</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        );

        /*return workers.map((worker, index) => {
            return <View key={name+index}>
                <Text style={styles.executorText}>{name}</Text>
                <View style={styles.executorsRow}>
                    <View>
                        {worker.avatar ? (
                            <Image
                                style={styles.executorImage}
                                source={{ uri: worker.avatar }}
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
                        <Text>{worker.name}</Text>
                        <Text>{worker.phoneNum}</Text>
                    </View>
                </View>
            </View>
        })*/
    }

    render() {
        const {
            workers: workersObservable,
            order,
            dispatcher,
            isDriver,
            thirdPartyWorkers,
            myThirdPartyWorkers,
        } = this.props.store;

        const workers = toJS(workersObservable);

        const driver = workers.find((worker) => worker.isDriver);
        const movers = workers.filter((worker) => !worker.isDriver);

        let orderType = '';
        if (order) {
            if (order.need_loaders && order.need_driver) {
                orderType = `Водитель и ${order.loaders_count} грузчика`;
            } else if (order.need_loaders) {
                orderType = `Только ${order.loaders_count} ГРУЗЧИКА`;
            } else if (order.need_driver) {
                orderType = `Только ВОДИТЕЛЬ`;
            }
        }

        return (
            <Fragment>
                <ScrollView
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}
                >
                    {this.state.message && <Text style={styles.errorMessage}>{this.state.message}</Text>}
                    <OrderCard
                        order={order}
                        orderType={orderType}
                        fullAddress
                        expandAlways
                        time={order.start_time}
                        addresses={order.locations}
                        description={order.comment}
                        cardStyle={styles.cardMargins}
                    />
                    <ExpandCardBase
                        OpenComponent={
                            <Text style={styles.cardH2}>
                                Исполнители ({order.workers.has_driver + order.workers.loaders_count} /{' '}
                                {order.need_driver + order.loaders_count})
                            </Text>
                        }
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

                                    {driver && this.renderWorkerInfo([driver], 'Водитель', false)}
                                    {this.renderWorkerInfo(movers, movers.length > 1 ? 'Грузчики:' : 'Грузчик', false)}

                                    {/*{driver && (
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
                                    )}*/}
                                </View>
                            </Fragment>
                        }
                        cardStyle={styles.cardMargins}
                    />

                    <ExpandCardBase
                        expanded
                        OpenComponent={<Text style={styles.cardH2}>Мои грузчики</Text>}
                        HiddenComponent={
                            <Fragment>
                                <View style={styles.cardDescription}>
                                    {/*{this.renderWorkerInfo([driver], 'Водитель')}
                                    {this.renderWorkerInfo(movers, movers.length > 1 ? 'Грузчики:' : 'Грузчик')}*/}
                                    {this.renderWorkerInfo(
                                        this.props.store.myThirdPartyWorkers,
                                        movers.length > 1 ? 'Грузчики:' : 'Грузчик',
                                        true,
                                    )}
                                    <TouchableOpacity
                                        style={styles.buttonAddWorker}
                                        onPress={this._addThirdPartyWorker}
                                    >
                                        <Text style={styles.buttonText}>Добавить</Text>
                                    </TouchableOpacity>
                                </View>
                            </Fragment>
                        }
                        cardStyle={styles.cardMargins}
                    />

                    <ExpandCardBase
                        OpenComponent={<Text style={styles.cardH2}>Комментарий к заказу</Text>}
                        HiddenComponent={
                            <Fragment>
                                <View style={styles.cardDescription}>
                                    <Text style={styles.instructionText}>{order.comment}</Text>
                                    {isDriver ? (
                                        <Text style={styles.instructionText}>{order.driver_comment}</Text>
                                    ) : (
                                        <Text style={styles.instructionText}>{order.loader_comment}</Text>
                                    )}
                                </View>
                            </Fragment>
                        }
                        cardStyle={styles.cardMargins}
                    />
                    <TouchableOpacity style={[styles.cardChat, styles.spaceBottom]} onPress={this._chatPress}>
                        <View style={styles.cardRowTopContainer}>
                            <Text style={styles.cardH2}>Чат</Text>
                            <Icon name="chevron-right" size={42} color="#c4c4c4" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <View style={styles.absoluteButtonContainer}>
                    <SafeAreaView style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonCancel} onPress={this._cancelOrderPress}>
                            <Text style={styles.buttonText}>ОТМЕНА</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonConfirm} onPress={this._completeOrderPress}>
                            <Text style={styles.buttonText}>ЗАВЕРШИТЬ</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>
            </Fragment>
        );
    }
}

export default OrderDetailScreen;
