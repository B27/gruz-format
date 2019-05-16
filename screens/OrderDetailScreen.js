import React, { Fragment } from "react";
import {
	View,
	ScrollView,
	Text,
	TouchableOpacity,
} from "react-native";
import styles from "../styles";
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Feather';
import OrderView from '../screens/OrderView'
import Executor from '../screens/Executor'
import Chat from '../screens/Chat'


class OrderDetailScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           order: { id:'0', time:'13:23', address:'Chertenkova 2', description:'test 1' }
        }
    }
    static navigationOptions = {
		title: "Заказы"
    };

	render() {
        const { order } = this.state;
		return (
        <ScrollView>
        <View style={ styles.orderBase }>
            <OrderView key={ order.id } time={ order.time } address={ order.address } description={ order.description }/>
            <Executor />
            <Chat/>
            <View style={ styles.orderDetailButton }>
                <TouchableOpacity >
                    <Text style={ styles.textButton }>ОТМЕНА</Text>
                </TouchableOpacity>
                <TouchableOpacity >
                    <Text style={ styles.textButton }>ГОТОВО</Text>
                </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
        )}
}

export default OrderDetailScreen;
