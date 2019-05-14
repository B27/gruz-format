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



class Chat extends React.Component {
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
		return(
            <View style={ styles.executorBase } key={this.props.id}>
            <TouchableOpacity onPress={ this.pressOrder } >
                    <View style={ styles.orderRowView }>
                        <View>
                            <Text style={ styles.mainMenuItemText }>Чат</Text>
                        </View>
                            { orderV ? <Icon name='ios-arrow-up' size={42} color={'#E6E6E6'} /> : <Icon name='ios-arrow-down' size={42} color={'#E6E6E6'} /> }
                    </View> 
            </TouchableOpacity>
            { orderV && ( 
                <Fragment >
                    <ScrollView >
                        <View style={ styles.orderDescription }>
                            <Text>сообщения</Text>
                            <Text>сообщения</Text>
                            <Text>сообщения</Text>
                            <Text>сообщения</Text>
                        </View>
                    </ScrollView>
                </Fragment>) }
        </View>
        )}
}

export default Chat;
