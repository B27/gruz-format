import md5 from 'md5';
import React from 'react';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native';

class RobokassaScreen extends React.Component {
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
                    source={{
                        uri: url, //`https://auth.robokassa.ru/Merchant/Index.aspx?MerchantLogin=Format.Gruz&InvId=${invId}&Culture=ru&Encoding=utf-8&OutSum=${outSum}&Shp_UserID=${userId}&SignatureValue=${hash}`,
                    }}
                />
                <SafeAreaView />
            </>
        );
    }
}

export default RobokassaScreen;
