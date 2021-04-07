import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import {
    Modal,
    Alert,
    AppState,
    Image,
    Linking,
    NativeModules,
    Platform,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    TextInput,
} from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconCam from 'react-native-vector-icons/MaterialIcons';
import ExpandCardBase from '../components/ExpandCardBase';
import LoadingButton from '../components/LoadingButton';
import OrderCard from '../components/OrderCard';
import Store from '../mobx/Store';
import styles from '../styles';
import { logError, logCancelOrder, logButtonPress, logMakeCall, logScreenView, logInfo } from '../utils/FirebaseAnalyticsLogger';
import * as NotificationListener from '../utils/NotificationListener';
import showAlert from '../utils/showAlert';

const TAG = '~OrderDetailScreen~';

@inject('store')
@observer
class OrderDetailScreen extends React.Component {
    state = {
        message: false,
        refreshing: false,
        phoneNumberModalVisible: false,
        phone: '',
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

    _makeCall = async () => {
        await logButtonPress({ TAG, info: 'make call' });
        let phoneNumber;
        let number = await AsyncStorage.getItem('numberCallToClient');

        if (!number) {
            showAlert('Ошибка', 'В данный момент звонок невозможен: администратор не указал номер для звонка');
            await logError({ TAG, info: 'number not exist' });
            return;
        }
        phoneNumber = `tel:${number}`;

        logMakeCall({ TAG });
        Linking.openURL(phoneNumber);
    };

    _orderRefresher = () => {
        logScreenView(TAG);
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
        logButtonPress({ TAG, info: 'cancel_order' });
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
                ios: async () => {
                    await BackgroundGeolocation.stop();
                    await BackgroundGeolocation.destroyLocations();
                },
            })();
            this.props.navigation.navigate('Main');
            await logCancelOrder({ TAG, orderId: this.props.store.orderIdOnWork });
        } catch (error) {
            await logError({ TAG, error, info: 'cancel order' });
            if (error.response.status === 400) {
                showAlert('Ошибка', error.response.data.message);
                return;
            }
            showAlert('Ошибка', error.message.toString());
        }
    };

    _completeOrderPress = () => {
        logButtonPress({ TAG, info: 'complete order' });
        this.props.navigation.navigate('OrderComplete');
    };

    _chatPress = () => {
        logButtonPress({ TAG, info: 'chat' });
        this.props.navigation.navigate('OrderChat');
    };

    _addThirdPartyWorker = async () => {
        try {
            logInfo({ TAG, info: 'add third party worker' });
            await this.props.store.addThirdPartyWorkerToOrder();
            await this._onRefresh();
        } catch (error) {
            logError({ TAG, error, info: 'add third party worker' });
            if (error.toString().indexOf('allowed') !== -1) {
                showAlert('Ошибка', 'Вы не можете добавлять больше рабочих');
            } else if (error.toString().indexOf('anymore') !== -1) {
                showAlert('Ошибка', 'Набрано максимум рабочих на заказе');
            } else if (error.toString().indexOf('need loaders') !== -1) {
                showAlert('Ошибка', 'В заказе рабочие не нужны');
            } else {
                showAlert('Ошибка при добавлении', error);
            }
        }
    };

    _savePhoneNum = async () => {
        logButtonPress({ TAG, info: 'save new number' });
        const id = this.props.store.userId;

        if (this.state.phone === '') {
            showAlert('Ошибка', 'Заполните номер');
            return;
        }
        if (/^8/g.test(this.state.phone) && this.state.phone.length !== 11) {
            showAlert('Ошибка', 'Ваш номер должен содержать ровно 11 цифр');
            return;
        }
        if (/^\+7/g.test(this.state.phone) && this.state.phone.length !== 12) {
            showAlert('Ошибка', 'Ваш номер должен содержать ровно 12 символов');
            return;
        }
        try {
            logInfo({ TAG, info: 'save new number' });
            await axios.patch('/worker/' + id, {
                phoneNum: this.state.phone,
            });
            this.setState({ phoneNumberModalVisible: false });
            this._onRefresh();
        } catch (error) {
            logError({ TAG, error, info: 'save new number' });
        }
    };

    _deleteThirdPartyWorker = async () => {
        logButtonPress({ TAG, info: 'delete third party worker' });
        try {
            await this.props.store.deleteThirdPartyWorkerToOrder();
            this._onRefresh();
        } catch (error) {
            logError({ TAG, error, info: 'delete third party worker' });
            if (error.response) {
                showAlert('Ошибка при удалении', error.response.data.message);
            } else {
                showAlert('Ошибка при удалении', error);
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
                        <View style={styles.flex1}>
                            <Text>{`${worker.name} ${worker.isDriver ? `(${worker.stateCarNumber})` : ''}`}</Text>
                            <Text>{worker.phoneNum}</Text>
                        </View>
                        {this.props.store.userId === worker.id && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ phoneNumberModalVisible: true });
                                }}
                            >
                                <Icon name="pencil" size={24} />
                            </TouchableOpacity>
                        )}
                        {canDelete && (
                            <View>
                                <TouchableOpacity
                                    style={styles.buttonDeleteWorker}
                                    onPress={this._deleteThirdPartyWorker}
                                >
                                    <Text style={styles.buttonText}>X</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        );
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
        const me = workers.find((worker) => this.props.store.userId === worker.id);

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
            <>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.phoneNumberModalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}
                    onShow={() => this.setState({ phone: me.phoneNum })}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalHeaderText}>Изменение номера телефона</Text>
                            <TextInput
                                style={[styles.input, { alignSelf: 'stretch', marginHorizontal: 12, marginBottom: 2 }]}
                                placeholder="Номер телефона"
                                keyboardType="numeric"
                                placeholderTextColor="grey"
                                onChangeText={(phone) => this.setState({ phone: phone.replace(/[ \(\)]/g, '') })}
                                value={this.state.phone}
                                fullWidth
                            />
                            <Text style={styles.modalDesctiption}>
                                На этот номер вам будут звонить другие участники заказа
                            </Text>
                            <View style={styles.modalBottomButtons}>
                                <TouchableOpacity
                                    style={styles.buttonCancelBottomModal}
                                    onPress={() => {
                                        this.setState({ phoneNumberModalVisible: !this.state.phoneNumberModalVisible });
                                    }}
                                >
                                    <Text style={styles.buttonText}>ОТМЕНА</Text>
                                </TouchableOpacity>
                                <LoadingButton
                                    style={styles.buttonSaveBottomModal}
                                    onPress={this._savePhoneNum}
                                    // eslint-disable-next-line react-native/no-raw-text
                                >
                                    СОХРАНИТЬ
                                </LoadingButton>
                            </View>
                        </View>
                    </View>
                </Modal>
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

                    <TouchableOpacity style={styles.buttonCallClient} onPress={this._makeCall}>
                        <Text style={styles.buttonSmallText}>ПОЗВОНИТЬ ЗАКАЗЧИКУ</Text>
                    </TouchableOpacity>

                    <ExpandCardBase
                        OpenComponent={
                            <Text style={styles.cardH2}>
                                Исполнители ({order.workers.has_driver + order.workers.loaders_count} /{' '}
                                {order.need_driver + order.loaders_count})
                            </Text>
                        }
                        HiddenComponent={
                            <>
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
                                </View>
                            </>
                        }
                        cardStyle={styles.cardMargins}
                    />

                    <ExpandCardBase
                        expanded
                        OpenComponent={<Text style={styles.cardH2}>Мои грузчики</Text>}
                        HiddenComponent={
                            <>
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
                            </>
                        }
                        cardStyle={styles.cardMargins}
                    />

                    <ExpandCardBase
                        OpenComponent={<Text style={styles.cardH2}>Комментарий к заказу</Text>}
                        HiddenComponent={
                            <>
                                <View style={styles.cardDescription}>
                                    <Text style={styles.instructionText}>{order.comment}</Text>
                                    {isDriver ? (
                                        <Text style={styles.instructionText}>{order.driver_comment}</Text>
                                    ) : (
                                        <Text style={styles.instructionText}>{order.loader_comment}</Text>
                                    )}
                                </View>
                            </>
                        }
                        cardStyle={styles.cardMargins}
                    />
                    <TouchableOpacity style={styles.cardChat} onPress={this._chatPress}>
                        <View style={styles.cardRowTopContainer}>
                            <Text style={styles.cardH2}>Чат</Text>
                            <Icon name="chevron-right" size={42} color="#c4c4c4" />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.buttonContainerBottom}>
                        <TouchableOpacity style={styles.buttonCancel} onPress={this._cancelOrderPress}>
                            <Text style={styles.buttonText}>ОТМЕНА</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonConfirm} onPress={this._completeOrderPress}>
                            <Text style={styles.buttonText}>ЗАВЕРШИТЬ</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </>
        );
    }
}

export default OrderDetailScreen;
