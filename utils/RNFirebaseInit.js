import RNFirebase from '@react-native-firebase/app';
import DefaultPreference from 'react-native-default-preference';

async function init() {
    RNFirebase.messaging().onTokenRefresh(async (token) => {
        console.log('token recieved', token);
        await DefaultPreference.set('pushToken', token);
    });
}

export default { init };
