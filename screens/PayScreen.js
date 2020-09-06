import md5 from 'md5';
import { inject } from 'mobx-react/native';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { errorPayUrl, succesfulPayUrl } from '../constants';
import showAlert from '../utils/showAlert';

@inject('store')
class PayScreen extends React.Component {
    state = {
        sum: null,
        userId: null,
    };

    static navigationOptions = {
        title: 'Баланс',
        headerTintColor: 'black',
    };

    render() {
        const pass2 = 'pyIq4zr7KYPN2HqXl9l5';
        const outSum = this.props.navigation.getParam('sum');
        const userId = this.props.navigation.getParam('userId');
        const url = this.props.navigation.getParam('url');
        const invId = Number(new Date()).toString().slice(4);
        console.log(invId, userId);

        const hash = md5(`Format.Gruz:${outSum}:${invId}:${pass2}:Shp_UserID=${userId}`);
        //console.log(hash);

        return (
            <>
                <WebView
                    onNavigationStateChange={(navState) => {
                        console.log(navState);
                        if (navState.url.includes(succesfulPayUrl)) {
                            showAlert('Успешно', 'Пополнение баланса прошло успешно');
                            setTimeout(() => this.props.store.updateUserInfo(), 5000);
                            this.props.navigation.navigate('Main');
                        }
                        if (navState.url.includes(errorPayUrl)) {
                            showAlert('Ошибка', 'Не удалось пополнить баланс');
                            this.props.navigation.navigate('Balance');
                        }
                    }}
                    source={{
                        uri: url,
                    }}
                />
                <SafeAreaView />
            </>
        );
    }
}

export default PayScreen;
