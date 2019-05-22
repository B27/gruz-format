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
    acceptOrder = () => {
        console.log('принимаю заказ');
    };

    render() {
        const { navigation } = this.props;
        const { isDriver } = this.props.store;

        const order = navigation.getParam('order');

        return (
            <Fragment>
                <ScrollView>
                    <OrderCard
                        expandAlways
                        time={order.start_time}
                        addresses={order.locations}
                        description={order.description}
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
                    <View style={styles.orderAccept}>
                        <TouchableOpacity style={styles.buttonConfirm} onPress={this.acceptOrder}>
                            <Text style={styles.buttonText}>ПРИНЯТЬ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Fragment>
        );
    }
}

export default OrderPreview;
