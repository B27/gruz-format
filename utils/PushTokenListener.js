import { Alert } from 'react-native';

export default function PushTokenListener(params) {
    const [token] = params;
    Alert.alert('Внимание', 'Обновился токен ' + token);
   
    console.log('NotificationListener, event: ', params);  
}