import { Alert } from 'react-native';

export default function showAlert(title, msg, { okFn, cancel }) {
    let buttons = [{ text: 'OK', onPress: okFn }];

    if (cancel) {
        buttons.push({
            text: 'Отмена',
            style: 'cancel'
        });
        buttons.reverse(); // кнопка отмены должна быть слева
    }

    Alert.alert(title, msg, buttons, { cancelable: false });
}
