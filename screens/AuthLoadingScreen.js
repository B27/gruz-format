import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';


class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        console.log("AuthLoadingScreen bootstrapAsync");
        const userToken = await AsyncStorage.getItem('token');
        const filledProfile = await AsyncStorage.getItem('filledProphile'); //заполнен ли профиль
        this.props.navigation.navigate("Main");
        // Раскомментировать
     //   this.props.navigation.navigate(userToken ? (filledProfile ? 'App' : 'RegisterPerson') : 'Auth');
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