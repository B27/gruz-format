import React from "react";
import { WebView, BackHandler } from "react-native";
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
        const pass2 = 'z5pg0ih2E6y8qruYMPZo';
        const outSum = this.props.navigation.getParam('sum');
        const userId = this.props.navigation.getParam('userId');
        const invId = Number(new Date()).toString().slice(4);
        console.log(invId, userId);
        
        const hash = md5(`baikalweb:${outSum}:${invId}:${pass2}:Shp_UserID=${userId}`);
        console.log(hash);
        
		return (
            <WebView source={{ uri: `https://auth.robokassa.ru/Merchant/Index.aspx?MerchantLogin=baikalweb&InvId=${invId}&Culture=ru&Encoding=utf-8&OutSum=${outSum}&IsTest=1&Shp_UserID=${userId}&SignatureValue=${hash}` }}/>//
		);
  }
}

export default RobokassaScreen;

