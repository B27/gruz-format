import React, { Fragment } from "react";
import {
	View,
	ScrollView,
	Text,
	TouchableOpacity,
} from "react-native";
import styles from "../styles";
import Icon from 'react-native-vector-icons/Ionicons';
import IconCam from 'react-native-vector-icons/MaterialIcons';


class Executor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderV: false,
            dispatcher: { name:'Ваня', phone:'111111' },
            driver: { name:'Вова', phone:'222222' },
            mover: { name:'Петя', phone:'333333' },
        }
    }
    pressOrder = () => {
        this.setState({ 
            orderV: !this.state.orderV,
        })
    }

	render() {
        const { orderV, dispatcher, driver, mover } = this.state;
		return (
            <View style={ styles.executorBase } key={this.props.id}>
                <TouchableOpacity onPress={ this.pressOrder } >
                    <View style={ styles.orderRowView }>
                        <View>
                            <Text style={ styles.mainMenuItemText }>Исполнители</Text>
                        </View>
                            { orderV ? <Icon name='ios-arrow-up' size={42} color={'#E6E6E6'} /> : <Icon name='ios-arrow-down' size={42} color={'#E6E6E6'} /> }
                    </View> 
                </TouchableOpacity>
            { orderV && ( 
                <Fragment >
                        <View style={ styles.executorDescription }>
                            <View>
                                <Text style={ styles.executorTextDisp }>Диспетчер:</Text>
                                <View style={ styles.orderRow }>
                                    <TouchableOpacity>
                                        <IconCam name={ 'camera' } color={ '#FFC234'} size={50} style={ styles.orderIcon }/>
                                    </TouchableOpacity>
                                    <View>
                                        <Text >{ dispatcher.name }</Text>
                                        <Text>{ dispatcher.phone }</Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <Text style={ styles.executorText }>Водитель:</Text>
                                <View style={ styles.orderRow }>
                                    <TouchableOpacity>
                                        <IconCam name={ 'camera' } color={ '#FFC234'} size={50} style={ styles.orderIcon }/>
                                    </TouchableOpacity>
                                    <View>
                                        <Text>{ driver.name }</Text>
                                        <Text>{ driver.phone}</Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <Text style={ styles.executorText }>Грузчик:</Text>
                                <View style={ styles.orderRow }>
                                    <TouchableOpacity>
                                        <IconCam name={ 'camera' } color={ '#FFC234'} size={50} style={ styles.orderIcon }/>
                                    </TouchableOpacity>
                                    <View>
                                        <Text>{ mover.name }</Text>
                                        <Text>{ mover.phone }</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                </Fragment>) }
        </View>
        )}
}

export default Executor;
