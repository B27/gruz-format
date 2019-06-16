import { Alert } from 'react-native';

export default function NotificationListener(event) {
    Alert.alert('Внимание', 'Пришло уведомление');
    console.log('NotificationListener, event: ', event);  
}