import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { FlatList, Text, View, AsyncStorage, YellowBox } from 'react-native';
import OrderCard from '../components/OrderCard';
import SwitchToggle from '../components/SwitchToggle';
import styles from '../styles';
import { URL } from '../constants';
import { getSocket } from '../components/Socket'
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);
@inject('store')
@observer
class MainScreen extends React.Component {
    componentDidMount = async () => {
        await this.props.store.updateUserInfo()
           
        
        const socket = await getSocket();
        // if (!socket || !socket.connected) {
        //     setTimeout(()=>this.setState({message: 'Нет соединения с сервером'}), 2000)
        // } else this.setState({message: ''})
    };

    state = {

        workingStatus: false,
        refreshing: false,
        message: '',
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
                            <Text style = {{color: 'red', alignSelf: 'center', fontSize: 16}}>{this.state.message}</Text>
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
                    data={store.orders.slice()}
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

    _onChangeSwitchValue = async () => {
        console.log('1');
        
        
        console.log(URL);
        
        

        const socket = await getSocket();

        console.log(socket.connected);
        
        if (socket && socket.connected) {
            socket.emit('set work', !this.props.store.onWork);
            this.props.store.setOnWork(!this.props.store.onWork);
        } else {
            this.setState({ message: 'Нет соединения с сервером' })
        }
        
        
    };

    _onPressOrderItemButton = id => {
        const order = this.props.store.orders.find(order => order._id == id);
        this.props.navigation.navigate('OrderPreview', { order });
    };

    _onRefresh = async () => {
      //  const {updateUserInfo, getOrders} = this.props.store; так делать нельзя! mobx не сможет отследить вызов функции
        const { store } = this.props;
        //  this.fetchData();
        this.setState({ refreshing: true });

        await store.updateUserInfo();
        await store.getOrders();

        this.setState({ refreshing: false });
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
