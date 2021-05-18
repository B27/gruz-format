import iid from '@react-native-firebase/iid';
import axios from 'axios';
import { logError } from '../utils/FirebaseAnalyticsLogger';

const TAG = '~registerForPushNotificationsAsync~';

export default async function registerForPushNotificationsAsync(pushToken) {
    let curPushToken = null;
    try {
        curPushToken = await iid().getToken();
    } catch (error) {
        logError({ TAG, info: 'firebase instance id get token', error });
        return;
    }

    if (curPushToken === pushToken) {
        console.log(TAG, 'push tokens equals, return');
        return;
    }

    const body = { token: pushToken };

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
