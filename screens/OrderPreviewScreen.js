import { inject } from 'mobx-react/native';
import React, { Fragment } from 'react';
import { ScrollView, Text, View } from 'react-native';
import ExpandCardBase from '../components/ExpandCardBase';
import LoadingButton from '../components/LoadingButton';
import OrderCard from '../components/OrderCard';
import styles from '../styles';

@inject('store')
class OrderPreview extends React.Component {
    static navigationOptions = {
        title: 'Заказ'
    };

    _acceptOrder = async () => {
        const { store, navigation } = this.props;

        const order = navigation.getParam('order');

        try {
            await store.startFulfillingOrder(order._id);
            navigation.navigate('OrderDetail');
            console.log('Accept order successful');
        } catch (error) {
            console.log('error in OrderPreviewScreen acceptOrder:', error);
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
                <View style={styles.absoluteButtonContainer}>
                    <View style={styles.buttonContainerAlone}>
                        <LoadingButton blackText style={styles.buttonConfirmAlone} onPress={this._acceptOrder}>
                            ПРИНЯТЬ
                        </LoadingButton>
                    </View>
                </View>
            </Fragment>
        );
    }
}

export default OrderPreview;
