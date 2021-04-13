import iid from '@react-native-firebase/iid';
import axios from 'axios';
import { Platform } from 'react-native';

const TAG = '~registerForPushNotificationsAsync~';

export default async function registerForPushNotificationsAsync(pushToken) {
    let curPushToken = await iid().getToken();

    if (curPushToken === pushToken) {
        console.log(TAG, 'push tokens equals, return');
        return;
    }

    let body = { token: pushToken };
    switch (Platform.OS) {
        case 'android':
            body.appVersion = { android: 21, ios: 0 };
            break;

        case 'ios':
            body.appVersion = { android: 0, ios: 14 };
            break;
    }

    try {
        await axios.post('/push_token', body);
        console.log(TAG, 'send token to server succesful');
    } catch (error) {
        if (error.isAxiosError) {
            if (error.response) {
                console.log(TAG, 'Error post /push_token', error.response.status, error.response.data.message);
            }
        }
    }
}
