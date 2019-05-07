import React from "react";
import { View, Text, StyleSheet, AsyncStorage } from "react-native";
import { createStore, applyMiddleware } from "redux";
import { Provider, connect } from "react-redux";
import axios from "axios";
import axiosMiddleware from "redux-axios-middleware";
import AppContainer from "./navigation/Navigation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import reducer from "./screens/reducer";

let token;
(async () => (token = await AsyncStorage.getItem("token")))(); //Этот говнокод для того чтобы не вернулся промис
if (token) {
	axios.defaults.headers = {
		Authorization: "Bearer " + token
	};
}
axios.defaults.baseURL = "https://gruz.bw2api.ru";
const store = createStore(reducer, applyMiddleware()); //axiosMiddleware(client)

export default class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<View style={styles.container}>
					<KeyboardAwareScrollView
						style={{ flex: 1 }}
						contentContainerStyle={{ flex: 1 }}
						resetScrollToCoords={{ x: 0, y: 0 }}
						enableResetScrollToCoords={true}
						enableOnAndroid={true}
						enableAutomaticScroll={true}
					>
						<AppContainer />
					</KeyboardAwareScrollView>
				</View>
			</Provider>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff"
	}
});
