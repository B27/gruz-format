import axios from 'axios';
import DefaultPreference from 'react-native-default-preference';

const TAG = '~registerForPushNotificationsAsync~';

export default async function registerForPushNotificationsAsync() {
    const pushToken = await DefaultPreference.get('pushToken');

    if (!pushToken) {
        console.log(TAG, 'push token empty, return');
        return;
    }

    try {
        await axios.post('/push_token', { token: pushToken });
        console.log(TAG, 'send token to server succesful');
        await DefaultPreference.clear('pushToken');
    } catch (error) {
        if (error.isAxiosError) {
            if (error.response) {
                console.log(TAG, 'Error post /push_token', error.response.status, error.response.data.message);
            }
        }
    }
}
