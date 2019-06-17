import { Alert } from 'react-native';

export default function NotificationListener(params) {
    Alert.alert('Внимание', 'Пришло уведомление');
    console.log('NotificationListener, event: ', params);  
}