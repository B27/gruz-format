import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { NativeModules } from 'react-native';

const TAG = '|registerForPushNotificationsAsync|';

export default async function registerForPushNotificationsAsync() {
    // Get the token that uniquely identifies this device
    let savedNotifToken;
    let notifToken;

    try {
        savedNotifToken = await AsyncStorage.getItem('pushToken');
        console.log(TAG, 'AsyncStorage token', savedNotifToken);
    } catch (error) {
        console.log(TAG, 'Error getting token from AsyncStorage', error);
    }

    try {
        ({ pushToken: notifToken } = await NativeModules.RNFirebasePushToken.getToken());
        console.log(TAG, 'Token for push notifications received:', notifToken);
    } catch (error) {
        console.log(TAG, 'Error getting token', error);
        return;
    }

    if (savedNotifToken === notifToken) return;

    try {
        await axios.post('/push_token', { token: notifToken });
        await AsyncStorage.setItem('pushToken', notifToken);
        console.log(TAG, 'Send token to server and save in AsyncStorage succesful');
    } catch (error) {
        if (error.response) {
            console.log(TAG, 'Error post /push_token', error.response.status, error.response.data.message);
        } else {
            console.log(TAG, 'Error:', error);
        }
    }
}
