import { inject } from 'mobx-react/native';
import React, { Fragment } from 'react';
import { ScrollView, SafeAreaView, Text, View, Alert, NativeModules, Platform } from 'react-native';
import ExpandCardBase from '../components/ExpandCardBase';
import LoadingButton from '../components/LoadingButton';
import OrderCard from '../components/OrderCard';
import styles from '../styles';
import AsyncStorage from '@react-native-community/async-storage';
import showAlert from "../utils/showAlert";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

@inject('store')
class OrderPreview extends React.Component {
    static navigationOptions = {
        title: 'Заказ',
        headerTintColor: 'black',
    };

    _acceptOrder = async () => {
        const { store, navigation } = this.props;
        if (this.props.store.isDriver && this.props.store.veh_width === '' && !this.props.store.onWork) {
            Alert.alert('Ошибка', 'Заполните данные об автомобиле');
            return;
        }

        if (this.props.store.balance < 0) {
            Alert.alert('Ошибка', 'Вы не можете выполнять заказы при отрицательном балансе. Пополните баланс');
            return;
        }
        const order = navigation.getParam('order');

        try {
            await store.startFulfillingOrder(order._id);
            await Platform.select({
                android: async () => {
                    await NativeModules.ForegroundTaskModule.startService(await AsyncStorage.getItem('token'), "В работе")
                },
                ios: async () => {},
            })();
            navigation.navigate('OrderDetail');
            console.log('Accept order successful');
        } catch (error) {
            console.log('error in OrderPreviewScreen acceptOrder:', error);
            if(error.response){
                showAlert('Ошибка при принятии заказа', error.response.data.message, { okFn: undefined });
            } else {
                showAlert('Ошибка при принятии заказа', 'Возникла ошибка в приложении при принятии заказа\n' + error.toString(), {okFn: undefined});
            }
        }
    };

    render() {
        const { isDriver } = this.props.store;

        const order = this.props.navigation.getParam('order');
        let orderType = ''
        if(order){
            if(order.need_loaders && order.need_driver) {orderType = `Водитель и ${order.loaders_count} грузчика`}
            else if(order.need_loaders) { orderType = `Только ${order.loaders_count} ГРУЗЧИКА` }
            else if(order.need_driver) { orderType = `Только ВОДИТЕЛЬ` }
        }
        return (
            <Fragment>
                <ScrollView>
                    <OrderCard
                        expandAlways
                        orderType={orderType}
                        time={order.start_time}
                        order={order}
                        addresses={order.locations}
                        description={order.comment}
                        cardStyle={styles.cardMargins}
                    />
                    <ExpandCardBase
                        expanded
                        OpenComponent={<Text style={styles.cardH2}>Набранные исполнители ({order.workers.has_driver + order.workers.loaders_count} / {order.need_driver+order.loaders_count})</Text>}
                        HiddenComponent={
                            <Fragment>
                                {order.need_driver ? <View style={styles.orderRow}>
                                    <Icon name='car-pickup' color='#FFC234' size={20} style={styles.orderIcon} />
                                    <Text style={styles.textInput}>Водитель:</Text>
                                    <Icon name={order.workers.hasDriver ? 'check' : 'window-close'} color='#FFC234' size={20} style={styles.orderIcon} />
                                </View> : null }
                                {order.need_loaders ? <View style={styles.orderRow}>
                                    <Icon name='human-handsup' color='#FFC234' size={20} style={styles.orderIcon} />
                                    <Text style={styles.textInput}>Грузчики:</Text>
                                    <Text style={styles.textInput}>{order.workers.loaders_count} из {order.loaders_count}</Text>
                                </View> : null }
                            </Fragment>
                        }
                        cardStyle={styles.cardMargins}
                    />
                    <ExpandCardBase
                        expanded
                        OpenComponent={<Text style={styles.cardH2}>Комментарий к заказу</Text>}
                        HiddenComponent={
                            <Fragment>
                                <View style={styles.cardDescription}>
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
                </ScrollView>
                <SafeAreaView style={styles.absoluteButtonContainer}>
                    <View style={styles.buttonContainerAlone}>
                        <LoadingButton blackText style={styles.buttonConfirmAlone} onPress={this._acceptOrder}>
                            ПРИНЯТЬ
                        </LoadingButton>
                    </View>
                </SafeAreaView>
            </Fragment>
        );
    }
}

export default OrderPreview;
