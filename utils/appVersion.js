import { Platform } from 'react-native';

export default function appVersion() {
    return Platform.select({
        android: { android: 22, ios: 0 },
        ios: { android: 0, ios: 14 },
    });
}
