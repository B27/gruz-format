import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import axios from 'axios';


class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('token');
        console.log(userToken);
        
        axios.defaults.headers = {
            Authorization: "Bearer " + userToken
        }
        const filledProfile = await AsyncStorage.getItem('filledProphile'); //заполнен ли профиль
        this.props.navigation.navigate(userToken ? (filledProfile ? 'App' : 'EditCar') : 'Auth');
    };

    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

export default AuthLoadingScreen;