import React from 'react';
import { FlatList, Text, View } from 'react-native';
import OrderCard from '../components/OrderCard';
import SwitchToggle from '../components/SwitchToggle';
import styles from '../styles';
import { inject, observer } from 'mobx-react/native';
import axios from 'axios';

@inject('store')
@observer
class MainScreen extends React.Component {
    componentDidMount = async () => {
        this.props.store.updateUserInfo();
    };

    _getApplications = async () => {
        try {
            const result = await axios.get(`order/open/60/1`);
            if (result) {
                console.log('get order/open/60/1 result.data: ', result.data);
                this.setState({
                    applications: result.data
                });
            }
        } catch (err) {
            console.log('get order/open/60/1 error ', err);
        }
    };

    state = {
        workingStatus: false,
        refreshing: false,
        applications: [
            {
                _id: 1,
                start_time: '13:30',
                locations: ['г.Хабаровск,  а длина может быть и больше ул. Краснофлотская, д.34, кв.56'],
                comment: 'Коммент арий'
            },
            {
                _id: 2,
                start_time: '13:30',
                locations: [
                    {
                        address: `г.Хабаровск,  ул. Краснофлотская, д.34, кв.56`
                    },
                    {
                        address: `г.Хабаровск, большая длина текста должна правильно переноситься, иначе это приведёт к сложным последствиям ул. Краснофлотская, д.34, кв.56`
                    }
                ],
                comment:
                    'Коммент г.Хабаровск,  а длина может быть и больше ул. Краснофлотская, д.34, кв.5г.Хабаровск,  а длина может быть и больше ул. Краснофлотская, д.34, кв.5г.Хабаровск,  а длина может быть и больше ул. Краснофлотская, д.34, кв.5арий'
            },
            {
                _id: 3,
                start_time: '13:30',
                locations: ['г.Хабаровск, ул. Краснофлотская, д.34, кв.56'],
                comment: 'Коммент арий'
            },
            {
                _id: 4,
                start_time: '13:30',
                locations: ['г.Хабаровск, ул. Краснофлотская, д.34, кв.56'],
                comment: 'Коммент арий'
            },
            {
                _id: 5,
                start_time: '13:30',
                locations: ['г.Хабаровск, ул. Краснофлотская, д.34, кв.56'],
                comment: 'Коммент арий'
            }
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
                            <Text style={styles.mainFontUserName}>{this.props.store.name}</Text>
                            <Text style={styles.mainFontUserType}>
                                {this.props.store.isDriver ? 'Водитель' : 'Грузчик'}
                            </Text>
                            {/* <Context.Consumer>
								{value => <Text style={styles.mainFontBalance}>{`${value.balance} руб.`}</Text>}
							</Context.Consumer> */}

                            <Text style={styles.mainFontBalance}>{`${this.props.store.balance} руб.`}</Text>

                            <Text style={styles.mainFontTopUpBalance} onPress={this._topUpBalance}>
                                Пополнить баланс
                            </Text>
                        </View>
                        <View style={styles.mainWorkingItem}>
                            <Text style={styles.drawerFontTopItem}>Работаю</Text>
                            <View>
                                <SwitchToggle switchOn={this.props.store.onWork} onPress={this._onChangeSwitchValue} />
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
        this.props.store.setOnWork(!this.props.store.onWork);
    };

    _onPressOrderItemButton = id => {
        this.props.navigation.navigate('OrderDetail');
    };

    _onRefresh = async () => {
        //  this.fetchData();
        this.setState({ refreshing: true });
        await this.props.store.updateUserInfo();
        await this._getApplications();

        this.setState({ refreshing: false });

        // this.setState({
        //     applications: [
        //         {
        //             _id: 3,
        //             time: '13:30',
        //             location: 'г.Хабаровск, ул. Краснофлотская, д.34, кв.56',
        //             comment: 'Коммент арий'
        //         }
        //     ]
        // });
    };

    _renderItem = ({ item }) => (
        <OrderCard
            id={item._id}
            time={item.start_time}
            addresses={item.locations}
            description={item.comment}
            cardStyle={styles.cardMargins}
            onPressButton={this._onPressOrderItemButton}
            buttonName='ПРИНЯТЬ'
        />
    );
}

export default MainScreen;
