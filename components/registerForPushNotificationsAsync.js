import axios from 'axios';
import { Platform, NativeModules } from 'react-native';
import DefaultPreference from 'react-native-default-preference';

const TAG = '~registerForPushNotificationsAsync~';

export default async function registerForPushNotificationsAsync(userHasPushToken) {
    let pushToken = await DefaultPreference.get('pushToken');
    if (!pushToken && !userHasPushToken) {
        try {
            ({ pushToken } = await NativeModules.RNFirebasePushToken.getToken());
        } catch (error) {
            console.log(TAG, error);
        }
    }

    if (!pushToken) {
        console.log(TAG, 'push token empty, return');
        return;
    }

    let body = { token: pushToken };
    switch (Platform.OS) {
        case 'android':
            body.appVersion = { android: 16, ios: 0 };
            break;

        case 'ios':
            body.appVersion = { android: 0, ios: 1 };
            break;
    }

    try {
        await axios.post('/push_token', body);
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
