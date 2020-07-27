import { Platform } from 'react-native';
// export const URL = 'https://api.gruzformat.ru';

export const URL = Platform.select({
    android: () => 'http://10.0.2.2:3008',
    ios: () => 'http://localhost:3008',
})();
export const privacyPolicyURL = `${URL}/policy.pdf`;
console.log('[Index].() URL', URL);
