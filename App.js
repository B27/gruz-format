import axios from 'axios';
import { Provider } from 'mobx-react/native';
import React from 'react';
import { View, NativeModules, Platform } from 'react-native';
import Store from './mobx/Store';
import AppContainer from './navigation/Navigation';
import NotificationListener, { setPendingNotificationParams } from './utils/NotificationListener';
import UniversalEventEmitter from './utils/UniversalEventEmitter';
import messaging from '@react-native-firebase/messaging';
import { URL } from './constants';

axios.defaults.baseURL = URL; /* 'http://192.168.1.4:3008'; */
const TAG = '~App.js~';

export default class App extends React.Component {
    componentDidMount() {
        if (!this.onMessageReceivedListener) {
            Platform.select({
                android: () => {
                    this.onMessageReceivedListener = UniversalEventEmitter.addListener(
                        'onMessageReceived',
                        NotificationListener,
                    );
                },
                ios: () => {
                    this.onMessageReceivedListener = messaging().onMessage(NotificationListener);
                },
            })();
        }

        const initType = this.props.type;
        const initOrderId = this.props.order_id;

        console.log(TAG, 'start params', initType, initOrderId);

        if (initType && initOrderId) {
            setPendingNotificationParams([initType, initOrderId]);
        }
    }

    componentWillUnmount() {
        // (async () => {
        //     const socket = await getSocket();
        //     socket.emit('setWork', false);
        // })();
        console.log(TAG, 'component unmount');

        if (this.onMessageReceivedListener) {
            console.log(TAG, 'remove NotificationListener');
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
