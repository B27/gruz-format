import React from 'react';
import { View, Text, AsyncStorage, FlatList } from 'react-native';
import styles from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import OrderCard from '../components/OrderCard';
import SwitchToggle from '../components/SwitchToggle';
import axios from 'axios';

class MainScreen extends React.Component {
    componentDidMount = async () => {
        this.fetchData();
    };
    fetchData = async () => {
        const userId = await AsyncStorage.getItem('userId');
        const result = await axios.get(`/worker/${userId}`).catch(err => {
            console.log('get /worker/:userId error ', err);
        });
        if (result) {
            console.log('get /worker/:userId result.data: ', result.data);
            this.setState({
                userName: result.data.name,
                balance: result.data.balance,
                userType: result.data.isDriver,
                workingStatus: result.data.onWork
            });
        }
    };

    state = {
        userName: '',
        isDriver: '',
        balance: '',
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
                location: `г.Хабаровск, большая длина текста должна правильно переноситься, иначе это приведёт к сложным последствиям ул. Краснофлотская, д.34, кв.56`,
                comment:
                    'Коммент г.Хабаровск,  а длина может быть и больше ул. Краснофлотская, д.34, кв.5г.Хабаровск,  а длина может быть и больше ул. Краснофлотская, д.34, кв.5г.Хабаровск,  а длина может быть и больше ул. Краснофлотская, д.34, кв.5арий'
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

    // static navigationOptions = ({ navigation }) => ({
    //     headerLeft: <MenuIcon navigationProps={navigation} />,
    //     headerLeftContainerStyle: { paddingLeft: 8 }
    // });

    render() {
        return (
            <FlatList
                ListHeaderComponent={
                    <View>
                        <View style={styles.mainTopBackground}>
                            <Text style={styles.mainFontUserName}>{this.state.userName}</Text>
                            <Text style={styles.mainFontUserType}>{this.state.isDriver ? 'Водитель' : 'Грузчик'}</Text>
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
                data={this.state.applications}
                renderItem={this._renderItem}
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
                ListEmptyComponent={<Text style={styles.mainFontUserType}>Нет доступных заявок</Text>}
            />
        );
    }

    _nextScreen = event => {
        console.log(event);
        console.log('MainScreen log');
    };

    _topUpBalance = () => {
        this.props.navigation.navigate('Balance');
    };

    _keyExtractor = (item, index) => ' ' + item._id; // для идентификации каждой струки нужен key типа String

    _onChangeSwitchValue = () => {
        this.setState({ workingStatus: !this.state.workingStatus });
    };

    _onPressOrderItemButton = id => {
        this.props.navigation.navigate('OrderDetail');
    };

    _onRefresh = async () => {
        //  this.fetchData();
        this.setState({ refreshing: true });
        setTimeout(() => {
            this.setState({ refreshing: false });
        }, 1000);
        this.setState({
            applications: [
                {
                    _id: 3,
                    time: '13:30',
                    location: 'г.Хабаровск, ул. Краснофлотская, д.34, кв.56',
                    comment: 'Коммент арий'
                }
            ]
        });
    };

    _renderItem = ({ item }) => (
        <OrderCard
            id={item._id}
            time={item.time}
            address={item.location}
            description={item.comment}
            cardStyle={styles.cardMargins}
            onPressButton={this._onPressOrderItemButton}
            buttonName='ПРИНЯТЬ'
        />
    );
}

export default MainScreen;
