import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import OrderCard from '../components/OrderCard';
import SwitchToggle from '../components/SwitchToggle';
import styles from '../styles';

@inject('store')
@observer
class MainScreen extends React.Component {
    componentDidMount = async () => {
        this.props.store.updateUserInfo();
    };

    state = {
        workingStatus: false,
        refreshing: false
    };

    // static navigationOptions = ({ navigation }) => ({
    //     headerLeft: <MenuIcon navigationProps={navigation} />,
    //     headerLeftContainerStyle: { paddingLeft: 8 }
    // });

    render() {
        const { store } = this.props;
        return (
                <FlatList
                    ListHeaderComponent={
                        <View>
                            <View style={styles.mainTopBackground}>
                                <Text style={styles.mainFontUserName}>{store.name}</Text>
                                <Text style={styles.mainFontUserType}>{store.isDriver ? 'Водитель' : 'Грузчик'}</Text>
                                {/* <Context.Consumer>
								{value => <Text style={styles.mainFontBalance}>{`${value.balance} руб.`}</Text>}
							</Context.Consumer> */}

                                <Text style={styles.mainFontBalance}>{`${store.balance} руб.`}</Text>

                                <Text style={styles.mainFontTopUpBalance} onPress={this._topUpBalance}>
                                    Пополнить баланс
                                </Text>
                            </View>
                            <View style={styles.mainWorkingItem}>
                                <Text style={styles.drawerFontTopItem}>Работаю</Text>
                                <View>
                                    <SwitchToggle
                                        switchOn={store.onWork}
                                        onPress={this._onChangeSwitchValue}
                                    />
                                </View>
                            </View>
                        </View>
                    }
                    keyExtractor={this._keyExtractor}
                    data={store.applications.slice()}
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
        const order = this.props.store.applications.find(order => order._id == id);
        this.props.navigation.navigate('OrderPreview', { order });
    };

    _onRefresh = async () => {
      //  const {updateUserInfo, getApplications} = this.props.store; так делать нельзя! mobx не сможет отследить вызов функции
        const { store } = this.props;
        //  this.fetchData();
        this.setState({ refreshing: true });

        await store.updateUserInfo();
        await store.getApplications();

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
    //    <Observer>
            <OrderCard
                id={item._id}
                time={item.start_time}
                addresses={item.locations}
                description={item.comment}
                cardStyle={styles.cardMargins}
                onPressButton={this._onPressOrderItemButton}
                buttonName='ПРИНЯТЬ'
            />
     //   </Observer>
    );
}

export default MainScreen;
