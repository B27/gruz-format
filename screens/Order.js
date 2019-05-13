import React, { Fragment } from "react";
import {
	View,
	ScrollView,
	Text,
	TouchableOpacity,
} from "react-native";
import styles from "../styles";
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import LocalImage from "../components/LocalImage";
import { Permissions, ImagePicker } from "expo";
import ChoiceCameraRoll from "./modals/ChoiceCameraRoll";

import { maxFromBits } from "uuid-js";
import { Button } from "react-native-elements";

class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderV: false,
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
    pressOrder = () => {
        this.setState({ 
            orderV: !this.state.orderV,
        })
    }

	render() {
        const { orderV } = this.state;
		return (
        <View style={ styles.instructionBase }>
            <TouchableOpacity onPress={ this.pressOrder } >
           
                    <View style={ styles.orderRowView }>
                        <View>
                            <View style={ styles.orderRow }>
                                <Icon name={ 'md-time' } color={ '#FFC234'} size={22} style={ styles.orderIcon }/>
                                <Text>Время</Text>
                            </View>
                            <View style={ styles.orderRow }>
                                <Icon2 name={ 'gps-fixed' } color={ '#FFC234'} size={22} style={ styles.orderIcon }/>
                                <Text>Адрес</Text>
                            </View>
                        </View>
                        { orderV ? <Icon name='ios-arrow-up' size={42} color={'#E6E6E6'} /> : <Icon name='ios-arrow-down' size={42} color={'#E6E6E6'} /> }
                    </View> 
           
            </TouchableOpacity>
            { orderV && ( 
                    <Fragment >
                            <ScrollView >
                                <Text style={ styles.orederText }>
                                    По старой традиции торжественный парад, посвящённый в этом году 74-годовщине Победы в Великой Отечественной войне, начался в десять часов утра. 
                                    Посмотреть на пешие колонны и военную технику на площадь Советов пришли тысячи жителей Улан-Удэ и гостей столицы. На главной трибуне города почётные места заняли ветераны и труженики тыла.
                                    Перед военнослужащими и зрителями с поздравительной речью выступил командующий общевойсковым объединением генерал-майор Михаил Носулев.
                                    В своём выступлении генерал-майор напомнил всем о стойкости, героизме, воинской доблести и готовности к самопожертвованию воинов Великой Отечественной войны и тружеников тыла.
                                </Text>
                            </ScrollView>
                    </Fragment>) }
        </View>
        )}
}

export default Order;
