import React, { Fragment } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';
import OrderCard from '../components/OrderCard';
import ExpandCardBase from '../components/ExpandCardBase';
import { inject } from 'mobx-react/native';

@inject('store')
class OrderPreview extends React.Component {
    state = {
        order: { id: '0', time: '13:23', address: 'Chertenkova 2', description: 'test 1' },
        gruzilinet: false
    };

    static navigationOptions = {
        title: 'Заказы'
    };

    _acceptOrder = async () => {
        const { store, navigation } = this.props;
        console.log('принимаю заказ');
        const order = navigation.getParam('order');

        try {
            store.setOrder(order);
            await store.startFulfillingOrder();         
            navigation.navigate('OrderDetail');
        } catch (error) {
            console.log('error in OrderPreviewScreen acceptOrder', error);
        }
    };

    render() {
        const { isDriver } = this.props.store;

        const order = this.props.navigation.getParam('order');

        return (
            <Fragment>
                <ScrollView>
                    <OrderCard
                        expandAlways
                        time={order.start_time}
                        addresses={order.locations}
                        description={order.comment}
                        cardStyle={styles.cardMargins}
                    />
                    <ExpandCardBase
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
                <View style={styles.absoluteButtonContainer}>
                    <View style={styles.buttonContainerAlone}>
                        <TouchableOpacity style={styles.buttonConfirmAlone} onPress={this._acceptOrder}>
                            <Text style={styles.buttonText}>ПРИНЯТЬ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Fragment>
        );
    }
}

export default OrderPreview;
