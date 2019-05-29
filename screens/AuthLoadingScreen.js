import axios from 'axios';
import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native';
import { inject } from 'mobx-react/native';

@inject('store')
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
        const filledProfile = await AsyncStorage.getItem('filledProphile');
        //заполнен ли профиль

        try {
            const fulfillingOrderId = await AsyncStorage.getItem('fulfillingOrder');
            console.log('fulfilingOrder id in AsyncStorage:', fulfillingOrderId);
            if (fulfillingOrderId) {
                await this.props.store.pullOrderById(fulfillingOrderId);
                await this.props.store.pullFulfilingOrderInformation();
                this.props.navigation.navigate('OrderDetail');
                return;
            }
        } catch (error) {
            console.log('Error in AuthLoadingScreen:', error);
        }

        this.props.navigation.navigate(userToken ? (filledProfile ? 'App' : 'Main') : 'Auth');
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
