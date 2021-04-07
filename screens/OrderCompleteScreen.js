import AsyncStorage from '@react-native-community/async-storage';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { Image, NativeModules, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import IconCam from 'react-native-vector-icons/MaterialIcons';
import ExpandCardBase from '../components/ExpandCardBase';
import LoadingButton from '../components/LoadingButton';
import NumericInput from '../components/NumericInput';
import StarRating from '../components/StarRating';
import NetworkRequests from '../mobx/NetworkRequests';
import styles from '../styles';
import { logButtonPress, logError, logScreenView } from '../utils/FirebaseAnalyticsLogger';

const TAG = '~OrderCompleteScreen~';
@inject('store')
@observer
class OrderCompleteScreen extends React.Component {
    state = {
        sumText: '',
        sumTextForThirdPartyWorkers: [],
        buttonDisabled: false,
        message: false,
    };

    static navigationOptions = {
        title: 'Завершение заказа',
        headerTintColor: 'black',
    };

    starsSet = new Set(); // id пользователей для которых не стоит оценка
    requestData = { sum: null, data: [], thirdPartyWorkers: [] }; // данные для отправки на сервер
    timeoutsSet = new Set();

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
            logScreenView(TAG);
        });
        const { workers: workersObservable, dispatcher, userId, myThirdPartyWorkers } = this.props.store;
        const sumTextForThirdPartyWorkers = [];
        myThirdPartyWorkers.forEach((values) => {
            sumTextForThirdPartyWorkers.push('');
        });
        this.setState({ sumTextForThirdPartyWorkers });

        const workers = workersObservable.slice().filter((worker) => worker.id != userId);
        console.log('[OrderCompleteScreen].componentDidMount() workers', workers);

        this.starsSet.add(dispatcher._id);

        workers.forEach((worker) => {
            console.log(
                '[OrderCompleteScreen].() worker',
                worker.invitedByWorker,
                'userId',
                userId,
                worker.invitedByWorker == userId,
            );
            if (worker.invitedByWorker != userId) this.starsSet.add(worker.id);
        });

        console.log('[OrderCompleteScreen].componentDidMount() this.starsSet', this.starsSet);
    }

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
        for (let timeout of this.timeoutsSet) {
            clearTimeout(timeout);
        }
        this.timeoutsSet.clear();
    }

    _onChangeStarRating = (workerId, rating) => {
        let workerRating = { worker_id: workerId, rating: rating };
        let data = this.requestData.data;

        if (this.starsSet.delete(workerId)) {
            this.requestData.data = [...data, workerRating];
        } else {
            this.requestData.data = data.map((wrkRtng) => {
                return wrkRtng.worker_id == workerId ? workerRating : wrkRtng;
            });
        }
    };

    _onChangeSum = (text) => {
        this.setState({ sumText: text });
    };

    _onChangeThirdPartySum = (index) => (text) => {
        this.setState((prevState) => {
            const updatableState = {
                ...prevState,
            };
            updatableState.sumTextForThirdPartyWorkers[index] = text;
            return {
                ...updatableState,
            };
        });
    };

    _cancelPress = () => {
        logButtonPress({ TAG, info: 'cancel' });
        this.props.navigation.goBack();
    };

    checkFields() {
        if (this.starsSet.size) {
            return 'Оцените всех участников заказа';
        }
        if (!this.state.sumText) {
            return 'Укажите полученную вами сумму';
        }
        if (this.state.sumText === '') {
            return 'Укажите полученную вами сумму';
        }

        for (let i = 0; i < this.state.sumTextForThirdPartyWorkers.length; i++) {
            if (!this.state.sumTextForThirdPartyWorkers[i]) {
                return 'Укажите полученную вашим ' + (i + 1) + ' грузчиком сумму в рублях';
            }
        }

        return null;
    }

    _confirmPress = async () => {
        await logButtonPress({ TAG, info: 'completeOrder' });
        const errorString = this.checkFields();
        if (errorString) {
            this._showErrorMessage(errorString);
            console.log(errorString);
            return;
        }

        const requestData = {
            ...this.requestData,
            sum: +this.state.sumText,
            thirdPartyWorkers: this.state.sumTextForThirdPartyWorkers,
        };

        this.setState({
            buttonDisabled: true,
        });

        try {
            await NetworkRequests.completeOrder(requestData);
            const userToken = await AsyncStorage.getItem('token');
            Platform.select({
                android: () => {
                    NativeModules.WorkManager.startWorkManager(userToken);
                },
                ios: () => {},
            })();
            this.props.navigation.navigate('AuthLoading');
        } catch (error) {
            await logError({ TAG, error, info: 'complete order' });
            this.setState({
                buttonDisabled: false,
            });
            this._showErrorMessage(error);
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

    renderThirdPartyTextFields() {
        return this.state.sumTextForThirdPartyWorkers.map((value, index) => {
            return (
                <NumericInput
                    style={styles.inputSumComplete}
                    key={index}
                    placeholder={'Полученная вашим ' + (index + 1) + ' грузчиком сумма в рублях'}
                    onChangeText={this._onChangeThirdPartySum(index)}
                    value={this.state.sumTextForThirdPartyWorkers[index]}
                />
            );
        });
    }

    render() {
        const { workers: workersObservable, dispatcher, userId } = this.props.store;

        const workers = workersObservable.slice();

        const driver = workers.find((worker) => worker.isDriver && worker.id != userId);
        const movers = workers.filter(
            (worker) => !worker.isDriver && worker.id != userId && worker.invitedByWorker != userId,
        );
        return (
            <>
                <ScrollView>
                    {this.state.message && <Text style={styles.errorMessage}>{this.state.message}</Text>}
                    <NumericInput
                        style={styles.inputSumComplete}
                        placeholder="Полученная вами сумма в рублях"
                        onChangeText={this._onChangeSum}
                        value={this.state.sumText}
                    />
                    {this.renderThirdPartyTextFields()}
                    <ExpandCardBase
                        expandAlways
                        OpenComponent={<Text style={styles.cardExecutorH2}>Исполнители</Text>}
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
                                                    <StarRating
                                                        id={dispatcher._id}
                                                        onChange={this._onChangeStarRating}
                                                    />
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
                                                    <StarRating id={driver.id} onChange={this._onChangeStarRating} />
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                    {movers.length != 0 && (
                                        <View>
                                            <Text style={styles.executorText}>
                                                {movers.length > 1 ? 'Грузчики:' : 'Грузчик'}
                                            </Text>
                                            {movers.map((mover) => (
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
                                                        <StarRating id={mover.id} onChange={this._onChangeStarRating} />
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </>
                        }
                        cardStyle={[styles.cardMargins, styles.spaceBottom]}
                    />
                </ScrollView>
                <View style={styles.absoluteButtonContainer}>
                    <SafeAreaView style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonCancel} onPress={this._cancelPress}>
                            <Text style={styles.buttonText}>ОТМЕНА</Text>
                        </TouchableOpacity>
                        <LoadingButton
                            blackText
                            style={styles.buttonConfirm}
                            disabled={this.state.buttonDisabled}
                            onPress={this._confirmPress}
                            // eslint-disable-next-line react-native/no-raw-text
                        >
                            ГОТОВО
                        </LoadingButton>
                    </SafeAreaView>
                    {Platform.OS === 'ios' && <KeyboardSpacer />}
                </View>
            </>
        );
    }
}

export default OrderCompleteScreen;
