import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { Provider } from 'mobx-react/native';
import React from 'react';
import { View } from 'react-native';
import Store from './mobx/Store';
import AppContainer from './navigation/Navigation';
import NotificationListener from './utils/NotificationListener';
import PushTokenListener from './utils/PushTokenListener';
import UniversalEventEmitter from './utils/UniversalEventEmitter';
// import { TaskManager, Notifications } from "expo";

const LOCATION_TASK_NAME = 'background-location-task';
let token;
(async () => {
    token = await AsyncStorage.getItem('token');
    if (token) {
        axios.defaults.headers = {
            Authorization: 'Bearer ' + token
        };
    }
    axios.defaults.baseURL = 'https://gruz.bw2api.ru'; /* 'http://192.168.1.4:3008'; */
})(); //Этот говнокод для того чтобы не вернулся промис

export default class App extends React.Component {
    componentDidMount() {
        this.onMessageReceivedListener = UniversalEventEmitter.addListener('onMessageReceived', NotificationListener);
        this.onNewTokenListener = UniversalEventEmitter.addListener('onNewToken', PushTokenListener);
    }

    componentWillUnmount() {
        // (async () => {
        //     const socket = await getSocket();
        //     socket.emit('setWork', false);
        // })();

        if (this.onMessageReceivedListener) {
            this.onMessageReceivedListener.remove();
        }

        if (this.onNewTokenListener) {
            this.onNewTokenListener.remove();
        }
    }

    render() {
        return (
            <Provider store={Store}>
                <View style={{ flex: 1 }}>
                    <AppContainer />
                </View>
            </Provider>
        );
    }
}

// TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
// 	if (error) {
// 		console.log("++++++++++: ", error);

// 		return;
// 	}
// 	if (data) {
// 		const socket = await getSocket();

// 		//	console.log(socket.connected);

// 		const { locations } = data;
// 		//console.log('------------- ', locations)// do something with the locations captured in the background

// 		if (socket && socket.connected) {
// 			socket.emit(
// 				"geo data",
// 				JSON.stringify({
// 					type: "Point",
// 					coordinates: [
// 						locations[0].coords.longitude,
// 						locations[0].coords.latitude
// 					]
// 				})
// 			);
// 		}
// 		//Notifications.scheduleLocalNotificationAsync({title: 'locations', body: `${locations[0].coords.latitude} ${locations[0].coords.longitude}`},{ time: (new Date()).getTime() + 1000 })
// 	}
// });
// console.log(
// 	"hgfuyfuyfyfuyfuyuyf" + TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)
// );
