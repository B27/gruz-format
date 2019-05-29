import axios from 'axios';
import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native';

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        console.log('AuthLoadingScreen bootstrapAsync');
        const userToken = await AsyncStorage.getItem('token');
        console.log(userToken);

        axios.defaults.headers = {
            Authorization: 'Bearer ' + userToken
        };
        const filledProfile = await AsyncStorage.getItem('filledProphile'); //заполнен ли профиль
        const fulfillingOrder = false;// await AsyncStorage.getItem('fulfillingOrder');
        console.log('fulfOrder', fulfillingOrder);
        this.props.navigation.navigate(
            userToken ? (filledProfile ? 'App' : fulfillingOrder ? 'OrderDetail' : 'Main') : 'Auth'
        );
    };

    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle='default' />
            </View>
        );
    }
}

export default AuthLoadingScreen;
