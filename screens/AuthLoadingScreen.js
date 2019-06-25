import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { toJS } from 'mobx';
import { inject } from 'mobx-react/native';
import React, { Fragment } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import registerForPushNotificationAsync from '../components/registerForPushNotificationsAsync';
import { prepareNotificationListener } from '../utils/NotificationListener';
import styles from '../styles';
import NetworkRequests from '../mobx/NetworkRequests';

const TAG = '~AuthLoadingScreen~';
@inject('store')
class AuthLoadingScreen extends React.Component {
    state = {
        error: ''
    };

    componentDidMount() {
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const { store, navigation } = this.props;
        console.log(TAG, 'bootstrapAsync');

        this.setState({ error: '' });

        prepareNotificationListener(navigation);

        const userToken = await AsyncStorage.getItem('token');
        console.log(TAG, 'user token: ', userToken);

        const userId = await AsyncStorage.getItem('userId');
        this.props.store.setUserId(userId);

        let screenNeedToGo = 'Auth';
        let params = undefined;

        if (userToken) {
            axios.defaults.headers = {
                Authorization: 'Bearer ' + userToken
            };

            try {
                await Promise.all([registerForPushNotificationAsync(), store.getUserInfo()]);

                if (store.orderIdOnWork) {
                    console.log(TAG, 'user has an order in work, order id:', store.orderIdOnWork);

                    await store.pullFulfilingOrderInformation();

                    const workersData = toJS(store.order).workers.data;

                    let sumEntered = true;
                    // проверка на то, указал ли пользователь полученную сумму
                    if (!workersData.find(wrkr => wrkr.id._id == userId).sum) {
                        sumEntered = false;
                    }

                    if (store.order.status === 'ended' && sumEntered) {
                        screenNeedToGo = 'WaitCompleteOrder';
                    } else {
                        screenNeedToGo = 'OrderDetail';
                    }
                } else {
                    screenNeedToGo = 'Main';
                }

                // если пользователь перешёл из уведомления, то переменная в store
                // будет = id заказа для предпросмотра
                if (store.orderPreview) {
                    const { data } = await NetworkRequests.getOrder(store.orderPreview);
                    params = { order: data };
                    console.log(TAG, 'params in getOrder()', params);
                    screenNeedToGo = 'OrderPreview';
                    store.setOrderPreview(null);
                }
            } catch (error) {
                this.setState({ error: error.toString() });
                return;
            }
        }

        navigation.navigate(screenNeedToGo, params);
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {this.state.error ? (
                    <Fragment>
                        <Text style={{ textAlign: 'center', fontSize: 16 }}>{this.state.error}</Text>
                        <TouchableOpacity style={styles.buttonBottom} onPress={this._bootstrapAsync}>
                            <Text style={styles.text}>Обновить</Text>
                        </TouchableOpacity>
                    </Fragment>
                ) : (
                    <ActivityIndicator size={60} color='#FFC234' />
                )}
            </View>
        );
    }
}

export default AuthLoadingScreen;
