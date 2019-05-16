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
import OrderCard from '../components/OrderCard'


class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           orders: [{id:'0', time:'13:23', address:'Chertenkova 2', description:'test 1'}, {id:'1',time:'10:44', address:'Chertenkova 25', description:'test 36'}],
        }
    }
    static navigationOptions = {
		title: "Заказы",
		headerLeft: null,
		headerTitleStyle: {
			textAlign: "center",
			flexGrow: 1,
			alignSelf: "center"
		}
    };

	render() {
        const { orders } = this.state;
		return (
        <ScrollView>
            { orders.map(order => <OrderCard cardStyle={styles.cardMargins} key={ order.id } time={ order.time } address={ order.address } description={ order.description }/>)}
        </ScrollView>
        )}
}

export default OrderList;
