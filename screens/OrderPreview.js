import React, { Fragment } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';
import OrderCard from '../components/OrderCard';
import ExpandCardBase from '../components/ExpandCardBase';


class OrderPreview extends React.Component {
    state = {
        order: { id: '0', time: '13:23', address: 'Chertenkova 2', description: 'test 1' },
        gruzilinet: false,
    };

    static navigationOptions = {
        title: 'Заказы'
    };
    acceptOrder = () => {
        console.log('принимаю заказ');
    }

    render() {
        const { order, gruzilinet } = this.state;
        return (
            <Fragment>
                <ScrollView>
                    <OrderCard
                        expandAlways
                        time={order.time}
                        address={order.address}
                        description={order.description}
                        cardStyle={styles.cardMargins}
                    />
                    <ExpandCardBase
                        OpenComponent={ <Text style={styles.cardH2}>Комментарии</Text> } 
                        HiddenComponent={
                            <Fragment>
                                <View style={ styles.cardH2 }>
                                    { gruzilinet ? <Text>Грузчик Комментарии</Text> : <Text>Водитель Комментарии</Text> }
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

    _chatPress = () => {
        this.props.navigation.navigate('');
    };
}

export default OrderPreview;
