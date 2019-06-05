import { inject, observer } from 'mobx-react/native';
import React, { Fragment } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import IconCam from 'react-native-vector-icons/MaterialIcons';
import ExpandCardBase from '../components/ExpandCardBase';
import NumericInput from '../components/NumericInput';
import StarRating from '../components/StarRating';
import NetworkRequests from '../mobx/NetworkRequests';
import styles from '../styles';

@inject('store')
@observer
class OrderCompleteScreen extends React.Component {
    state = {
        sumText: '',
        buttonDisabled: false
    };

    static navigationOptions = {
        title: 'Завершение заказа'
    };

    componentDidMount() {
        const { workers: workersObservable, dispatcher, userId } = this.props.store;

        const workers = workersObservable.slice().filter(worker => worker.id != userId);
        this.starsSet.add(dispatcher._id);
        workers.forEach(worker => {
            this.starsSet.add(worker.id);
        });
    }

    starsSet = new Set(); // id пользователей для которых не стоит оценка
    requestData = { sum: null, data: [] }; // данные для отправки на сервер

    render() {
        const { workers: workersObservable, dispatcher, userId } = this.props.store;

        const workers = workersObservable.slice();

        const driver = workers.find(worker => worker.isDriver && worker.id != userId);
        const movers = workers.filter(worker => !worker.isDriver && worker.id != userId);
        return (
            <Fragment>
                <ScrollView>
                    <NumericInput
                        style={styles.inputSumComplete}
                        placeholder='Полученная вами сумма в рублях'
                        onChangeText={this._onChangeSum}
                        value={this.state.sumText}
                    />
                    <ExpandCardBase
                        expandAlways
                        OpenComponent={<Text style={styles.cardExecutorH2}>Исполнители</Text>}
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
                                                        <StarRating id={mover.id} onChange={this._onChangeStarRating} />
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </Fragment>
                        }
                        cardStyle={[styles.cardMargins, styles.spaceBottom]}
                    />
                </ScrollView>
                <View style={styles.absoluteButtonContainer}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonCancel} onPress={this._cancelPress}>
                            <Text style={styles.buttonText}>ОТМЕНА</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonConfirm}
                            disabled={this.state.buttonDisabled}
                            onPress={this._confirmPress}
                        >
                            <Text style={styles.buttonText}>ГОТОВО</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Fragment>
        );
    }

    _onChangeStarRating = (workerId, rating) => {
        let workerRating = { worker_id: workerId, rating: rating };
        let data = this.requestData.data;

        if (this.starsSet.delete(workerId)) {
            this.requestData.data = [...data, workerRating];
        } else {
            this.requestData.data = data.map(wrkRtng => {
                console.log(wrkRtng.worker_id == workerId);
                return wrkRtng.worker_id == workerId ? workerRating : wrkRtng;
            });
        }

        console.log('starsRating set _onChangeStarRating:', this.starsSet);

        console.log('request data _onChangeStarRating:', this.requestData);
    };

    _onChangeSum = text => {
        this.setState({ sumText: text });
    };

    _cancelPress = () => {
        this.props.navigation.goBack();
    };

    _confirmPress = async () => {
        if (this.starsSet.size != 0) {
            // TODO добавить вывод польователю
            console.log('Оцените всех участников заказа');
            return;
        }
        if (!this.state.sumText) {
            // TODO добавить вывод польователю
            console.log('Укажите полученную ваму сумму');
            return;
        }

        const requestData = { ...this.requestData, sum: +this.state.sumText };

        this.setState({
            buttonDisabled: true
        });

        try {
            await NetworkRequests.completeOrder(requestData);
            this.props.navigation.navigate('AuthLoading');
        } catch (error) {
            this.setState({
                buttonDisabled: false
            });
            console.log('Ошибка в OrderCompleteScreen');
        }
    };
}

export default OrderCompleteScreen;
