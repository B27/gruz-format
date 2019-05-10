import React, { Fragment } from "react";
import {
	View,
	ScrollView,
	Text,
	TouchableOpacity,
} from "react-native";
import styles from "../styles";
import Icon from 'react-native-vector-icons/Ionicons';
import LocalImage from "../components/LocalImage";
import { Permissions, ImagePicker } from "expo";
import ChoiceCameraRoll from "./modals/ChoiceCameraRoll";

import { maxFromBits } from "uuid-js";
import { Button } from "react-native-elements";

class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            moverView: false,
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
    pressMover = () => {
        this.setState({ 
            moverView: !this.state.moverView,
        })
    }
    pressDriver = () => {
        this.setState({ 
            driverView: !this.state.driverView,
        })
    }

	render() {
        const { moverView } = this.state;
		return (
			<ScrollView>
                <View style={ styles.instructionBase }>
                    <View style={ styles.instructionView }>
                        <View style={ styles.instructionViewTitle }>
                            <Text
                                style={ styles.instructionTitle }
                                onPress={ this.pressMover }>Грузчик
                            </Text>
                            { moverView ? <Icon name='ios-arrow-up' size={42} color={'#E6E6E6'} onPress={ this.pressMover }/> : <Icon name='ios-arrow-down' size={42} color={'#E6E6E6'} onPress={ this.pressMover }/> }
                        </View>
                    { moverView && ( 
                    <Fragment >
                            <ScrollView>
                                <Text style={ styles.instructionText }>
                                    По старой традиции торжественный парад, посвящённый в этом году 74-годовщине Победы в Великой Отечественной войне, начался в десять часов утра. 
                                    Посмотреть на пешие колонны и военную технику на площадь Советов пришли тысячи жителей Улан-Удэ и гостей столицы. На главной трибуне города почётные места заняли ветераны и труженики тыла.
                                    Перед военнослужащими и зрителями с поздравительной речью выступил командующий общевойсковым объединением генерал-майор Михаил Носулев.
                                    В своём выступлении генерал-майор напомнил всем о стойкости, героизме, воинской доблести и готовности к самопожертвованию воинов Великой Отечественной войны и тружеников тыла.
                                </Text>
                            </ScrollView>
                    </Fragment>) }
                    </View>
                </View >                
            </ScrollView>
		);
	}
}

export default Order;
