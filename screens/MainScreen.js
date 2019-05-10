import React from 'react';
import { View, ScrollView, Text, TouchableHighlight, Image } from 'react-native';
import styles from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';

class LogoTitle extends React.Component {
    render() {
        return <Image source={require('../images/background.png')} style={{ width: 150, height: 30 }} />;
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

    static navigationOptions = {};

    render() {
        return (
            <ScrollView>
                <View style={styles.mainTopBackground}>
                    <Text style={styles.mainFontUserName}>{this.state.userName}</Text>
                    <Text style={styles.mainFontUserType}>{this.state.userType}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 4 }}>
                    <MenuItem item='Заявки' icon='inbox' onPress={this.nextScreen} />
                    <MenuItem item='Мои заказы' icon='truck' onPress={this.nextScreen} />
                    <MenuItem item='Баланс' icon='money' onPress={this.nextScreen} />
                    <MenuItem item='Моё авто' icon='wrench' onPress={this.nextScreen} />
                    <MenuItem item='Настройки' icon='gear' onPress={this.nextScreen} />
                    <MenuItem item='Инструкции' icon='info-circle' onPress={this.nextScreen} />
                </View>
            </ScrollView>
        );
    }

    nextScreen = el => {
        console.log(el);
        console.log('MainScreen log');
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
