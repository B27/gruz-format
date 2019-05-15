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

	render() {

        const pass2 = 'OLCMMK03768KIyYKoKQD';
        const outSum = this.props.navigation.getParam('sum');
        const userId = 0;//this.props.navigation.getParam('userId')
        const invId = Number(new Date()).toString().slice(4);
        console.log(invId, userId);
        
        const hash = md5(`baikalweb:${outSum}:${invId}:${pass2}:Shp_UserID=${userId}`);
        console.log(hash);
        
		return (
            <WebView source={{ uri: `https://auth.robokassa.ru/Merchant/Index.aspx?MerchantLogin=baikalweb&InvId=${invId}&Culture=ru&Encoding=utf-8&OutSum=${outSum}&Shp_UserID=${userId}&SignatureValue=${hash}` }}/>//IsTest=1&
		);
  }
}

export default RobokassaScreen;

