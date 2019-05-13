import React from "react";
import { WebView } from "react-native";

class BalanceScreen extends React.Component {
	state = {
		balance: 'hug'
	};

	static navigationOptions = {
		title: '220 р.',
		
	};
    // headerTitleStyle: {
    //     textAlign: "center",
    //     flexGrow: 1,
    //     alignSelf: "center"
    // }
	render() {
		return (
            <WebView source={{ uri: 'https://google.ru' }}/>
		);
  }
}

export default BalanceScreen;
