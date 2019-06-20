import axios from 'axios';
import { Provider } from 'mobx-react/native';
import React from 'react';
import { View } from 'react-native';
import Store from './mobx/Store';
import AppContainer from './navigation/Navigation';
import NotificationListener from './utils/NotificationListener';
import UniversalEventEmitter from './utils/UniversalEventEmitter';

axios.defaults.baseURL = 'https://gruz.bw2api.ru'; /* 'http://192.168.1.4:3008'; */

export default class App extends React.Component {
    componentDidMount() {
        this.onMessageReceivedListener = UniversalEventEmitter.addListener('onMessageReceived', NotificationListener);
    }

    componentWillUnmount() {
        // (async () => {
        //     const socket = await getSocket();
        //     socket.emit('setWork', false);
        // })();

        if (this.onMessageReceivedListener) {
            this.onMessageReceivedListener.remove();
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
