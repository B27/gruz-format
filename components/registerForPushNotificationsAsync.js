import axios from 'axios';
import { NativeModules } from 'react-native';

const TAG = '~registerForPushNotificationsAsync~';

export default async function registerForPushNotificationsAsync() {
    // Get the token that uniquely identifies this device
    let notifToken;

    try {
        ({ pushToken: notifToken } = await NativeModules.RNFirebasePushToken.getToken());
        console.log(TAG, 'token for push notifications received:', notifToken);
    } catch (error) {
        console.log(TAG, 'error getting token', error);
        throw 'Error getting token';
    }

    try {
        await axios.post('/push_token', { token: notifToken });
        console.log(TAG, 'send token to server succesful');
    } catch (error) {
        if (error.isAxiosError) {
            if (error.response) {
                console.log(TAG, 'Error post /push_token', error.response.status, error.response.data.message);
                throw `Ошибка ${error.response.status},  ${error.response.data.message}`;
            }
            if (error.message.includes('Network Error')) {
                throw 'Ошибка, проверьте подключение к сети';
            }
        } else {
            throw `Внутренняя ошибка, ${error}`;
        }
    }
}
