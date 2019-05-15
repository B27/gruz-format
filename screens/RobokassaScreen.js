import React from "react";
import { WebView } from "react-native";
import md5 from 'md5';

class RobokassaScreen extends React.Component {
	state = {
        sum: null,
        userId: null
	};

	static navigationOptions = {
		title: 'Баланс',
	};
    // headerTitleStyle: {
    //     textAlign: "center",
    //     flexGrow: 1,
    //     alignSelf: "center"
    // }
	render() {
        const pass2 = 'baMUf6569vYyLuHg5jsh';
        const outSum = this.props.navigation.getParam('sum');
        const userId = this.props.navigation.getParam('userId');
        const invId = '1557823';
        console.log(invId);
        
        const hash = md5(`${outSum}:${invId}:${pass2}:UserID=${userId}`);
        console.log(hash);
        
		return (
            <WebView source={{ uri: `https://auth.robokassa.ru/Merchant/Index.aspx?MerchantLogin=baikalweb&InvId=${invId}&Culture=ru&Encoding=utf-8&OutSum=${outSum}&SignatureValue=${hash}` }}/>
		);
  }
}

export default RobokassaScreen;
