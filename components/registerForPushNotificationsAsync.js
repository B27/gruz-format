import { NativeModules, Alert } from 'react-native';
import axios from 'axios';

export default async function registerForPushNotificationsAsync() {
    // Get the token that uniquely identifies this device
    let pushToken;

    try {
        ({ pushToken } = await NativeModules.RNFirebasePushToken.getToken());
        Alert.alert('Получен токен', pushToken);
        console.log('token push', );
    } catch (error) {
        console.log('error when get token', error);
        Alert.alert('Ошибка получения токена', error);
        return;
    }

    try {
        console.log(pushToken);
        await axios.post('/push_token', { token: pushToken });
    } catch (error) {
        if (error.response) {
            console.log('Error in registerForPushNotificationsAsync:', error.response.status, error.response.data.message);
        } else {
            console.log('Error in registerForPushNotificationsAsync:', error);
        }
    }
}
