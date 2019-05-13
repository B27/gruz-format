import React from 'react';
import { View, ScrollView, Text, TouchableHighlight, Image, TouchableOpacity } from 'react-native';
import styles from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Ionicons';

class LogoTitle extends React.Component {
    _menuPress = () => {
        this.props.navigationProps.toggleDrawer();
    };

    render() {
        return (
            <TouchableOpacity style={{ padding: 8 }} onPress={this._menuPress}>
                <Icon2 name='md-menu' size={24} />
            </TouchableOpacity>
        );
    }
}

const USER_TYPE = { loader: 'Грузчик', driver: 'Водитель' };

class EditCarScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        userName: 'Иванов В.В.',
        userType: USER_TYPE.driver,
        balance: 345,
        workingStatus: false,
        applications: [
            { time: '13:30', location: 'г.Хабаровск, ул. Краснофлотская, д.34, кв.56' },
            { time: '13:30', location: 'г.Хабаровск, ул. Краснофлотская, д.34, кв.56' },
            { time: '13:30', location: 'г.Хабаровск, ул. Краснофлотская, д.34, кв.56' },
            { time: '13:30', location: 'г.Хабаровск, ул. Краснофлотская, д.34, кв.56' },
            { time: '13:30', location: 'г.Хабаровск, ул. Краснофлотская, д.34, кв.56' }
        ] // заявки
    };

    static navigationOptions = ({ navigation }) => ({
        headerLeft: <LogoTitle navigationProps={navigation} />,
        headerLeftContainerStyle: { paddingLeft: 8 }
    });

    render() {
        return (
            <ScrollView>
                <View style={styles.mainTopBackground}>
                    <Text style={styles.mainFontUserName}>{this.state.userName}</Text>
                    <Text style={styles.mainFontUserType}>{this.state.userType}</Text>
                    <Text style={styles.mainFontBalance}>{`${this.state.balance} руб.`}</Text>
                    <Text style={styles.mainFontTopUpBalance} onPress={this._topUpBalance}>
                        Пополнить баланс
                    </Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 4 }}>
                    <MenuItem item='Заявки' icon='inbox' onPress={this._nextScreen} />
                    <MenuItem item='Мои заказы' icon='truck' onPress={this._nextScreen} />
                    <MenuItem item='Баланс' icon='money' onPress={this._nextScreen} />
                    <MenuItem item='Моё авто' icon='wrench' onPress={this._nextScreen} />
                    <MenuItem item='Настройки' icon='gear' onPress={this._nextScreen} />
                    <MenuItem item='Инструкции' icon='info-circle' onPress={this._nextScreen} />
                </View>
            </ScrollView>
        );
    }

    _nextScreen = event => {
        console.log(event);
        console.log('MainScreen log');
    };

    _topUpBalance = event => {
        console.log(event);
        console.log('topUpBalance log');
    };
}

function MenuItem({ item, icon, ...other }) {
    return (
        <TouchableHighlight
            {...other}
            style={{
                height: 48,
                justifyContent: 'center'
            }}
            underlayColor='#FFC234'
        >
            <View style={{ flexDirection: 'row' }}>
                <Icon
                    name={icon}
                    size={24}
                    //		color="#FFC234"
                    style={{ marginHorizontal: 12 }}
                />
                <Text style={styles.mainMenuItemText}>{item.toUpperCase()}</Text>
            </View>
        </TouchableHighlight>
    );
}

export default EditCarScreen;
