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


class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderV: false,
        }
    }
    pressOrder = () => {
        this.setState({ 
            orderV: !this.state.orderV,
        })
    }

	render() {
        const { orderV } = this.state;
		return (
            <View style={ styles.orderBase } key={this.props.id}>
            <TouchableOpacity onPress={ this.pressOrder } >
                    <View style={ styles.orderRowView }>
                        <View>
                            <View style={ styles.orderRow }>
                                <Icon name={ 'md-time' } color={ '#FFC234'} size={22} style={ styles.orderIconTime }/>
                                <Text>{ this.props.time }</Text>
                            </View>
                            <View style={ styles.orderRow }>
                                <Icon2 name={ 'crosshairs-gps' } color={ '#FFC234'} size={22} style={ styles.orderIcon }/>
                                <Text>{ this.props.address }</Text>
                            </View>
                        </View>
                            { orderV ? <Icon name='ios-arrow-up' size={42} color={'#E6E6E6'} /> : <Icon name='ios-arrow-down' size={42} color={'#E6E6E6'} /> }
                    </View> 
            </TouchableOpacity>
            { orderV && ( 
                <Fragment >
                    <ScrollView >
                        <View style={ styles.orderDescription }>
                            <Icon3 name={ 'message-circle' } color={ '#FFC234'} size={22} style={ styles.orderIcon }/>
                            <Text >{ this.props.description }</Text>
                        </View>
                    </ScrollView>
                </Fragment>) }
        </View>
        )}
}

export default Order;
