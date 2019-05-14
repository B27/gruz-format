import React from 'react';
import { View, ScrollView, Text, TouchableHighlight, Image, TouchableOpacity, FlatList } from 'react-native';
import styles from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Order from './Order';
import SwitchToggle from '../components/SwitchToggle';

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
        refreshing: false,
        applications: [
            {
                _id: 1,
                time: '13:30',
                location: 'г.Хабаровск,  а длина может быть и больше ул. Краснофлотская, д.34, кв.56',
                comment: 'Коммент арий'
            },
            {
                _id: 2,
                time: '13:30',
                location:
                    `г.Хабаровск, большая длина текста должна правильно переноситься, иначе это приведёт к сложным последствиям ул. Краснофлотская, д.34, кв.56`,
                comment: 'Коммент г.Хабаровск,  а длина может быть и больше ул. Краснофлотская, д.34, кв.5г.Хабаровск,  а длина может быть и больше ул. Краснофлотская, д.34, кв.5г.Хабаровск,  а длина может быть и больше ул. Краснофлотская, д.34, кв.5арий'
            },
            {
                _id: 3,
                time: '13:30',
                location: 'г.Хабаровск, ул. Краснофлотская, д.34, кв.56',
                comment: 'Коммент арий'
            },
            {
                _id: 4,
                time: '13:30',
                location: 'г.Хабаровск, ул. Краснофлотская, д.34, кв.56',
                comment: 'Коммент арий'
            },
            { _id: 5, time: '13:30', location: 'г.Хабаровск, ул. Краснофлотская, д.34, кв.56', comment: 'Коммент арий' }
        ] // заявки
    };

    static navigationOptions = ({ navigation }) => ({
        headerLeft: <LogoTitle navigationProps={navigation} />,
        headerLeftContainerStyle: { paddingLeft: 8 }
    });

    render() {
        return (
            <FlatList
                ListHeaderComponent={
                    <View>
                        <View style={styles.mainTopBackground}>
                            <Text style={styles.mainFontUserName}>{this.state.userName}</Text>
                            <Text style={styles.mainFontUserType}>{this.state.userType}</Text>
                            <Text style={styles.mainFontBalance}>{`${this.state.balance} руб.`}</Text>
                            <Text style={styles.mainFontTopUpBalance} onPress={this._topUpBalance}>
                                Пополнить баланс
                            </Text>
                        </View>
                        <View style={styles.mainWorkingItem}>
                            <Text style={styles.drawerFontTopItem}>Работаю</Text>
                            <View>
                                <SwitchToggle switchOn={this.state.workingStatus} onPress={this._onChangeSwitchValue} />
                            </View>
                        </View>
                    </View>
                }
                keyExtractor={this._keyExtractor}
                contentInset={{ top: 0, left: 8, bottom: 0, right: 8 }}
                data={this.state.applications}
                renderItem={({ item }) => (
                    <Order
                        time={item.time}
                        address={item.location}
                        description={item.comment}
                        style={{ marginHorizontal: 12, marginVertical: 6 }}
                        buttonName='ПРИНЯТЬ'
                    />
                )}
                refreshing={this.state.refreshing}
                onRefresh={() => {
                    this.setState({ refreshing: true });
                    setTimeout(() => {
                        this.setState({ refreshing: false });
                    }, 1000);
                }}
            />
            /* <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 4 }}>
                    <MenuItem item='Заявки' icon='inbox' onPress={this._nextScreen} />
                    <MenuItem item='Мои заказы' icon='truck' onPress={this._nextScreen} />
                    <MenuItem item='Баланс' icon='money' onPress={this._nextScreen} />
                    <MenuItem item='Моё авто' icon='wrench' onPress={this._nextScreen} />
                    <MenuItem item='Настройки' icon='gear' onPress={this._nextScreen} />
                    <MenuItem item='Инструкции' icon='info-circle' onPress={this._nextScreen} />
                </View> */
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

    _keyExtractor = (item, index) => ' ' + item._id; // для идентификации каждой струки нужен key типа String

    _onChangeSwitchValue = () => {
        this.setState({ workingStatus: !this.state.workingStatus });
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
