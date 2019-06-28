import { Alert } from 'react-native';
import NetworkRequests from '../mobx/NetworkRequests';
import Store from '../mobx/Store';

let _navigation = null;

const TAG = '~NotificationListener~';

export default async function NotificationListener(params) {
    const [type, orderId, title, body] = params;

    console.log(TAG, 'Notification recieved, params: ', params);

    // Когда приложение на переднем плане, GruzFirebaseMessagingService отсылает event с type, order, title, body.
    // Когда приложение в фоне или закрыто, firebase отправляет уведомление в трей
    // по нажатии на уведомление в MainActivity в методе onResume отсылается event
    // с type и order, title и body не приходят
    if (title && body) {
        if (_navigation) {
            if (type == 'accept') {
                console.log(TAG, `type == ${type}, order id`, orderId);

                let newBody = 'Нажмите ОК для перехода к деталям заказа';
                showAlert(title, newBody, { okFn: gotoOrderPreview(orderId), cancel: true });
            } else {
                console.log(TAG, `type == ${type}`);
                gotoAuthLoading();
                showAlert(title, body, { okFn: undefined });
            }
        } else {
            console.log(TAG, '_navigation is null');
        }
    } else {
        if (_navigation) {
            if (type == 'accept') {
                console.log(TAG, 'call gotoOrderPreview(order)()');
                gotoOrderPreview(orderId)();
            } else {
                console.log(TAG, 'call gotoAuthLoading()');
                gotoAuthLoading();
            }
        } else {
            console.log(TAG, '_navigation is null');
        }
    }
}

function showAlert(title, msg, { okFn, cancel }) {
    let buttons = [{ text: 'OK', onPress: okFn }];

    if (cancel) {
        buttons.push({
            text: 'Отмена',
            style: 'cancel'
        });
        buttons.reverse(); // кнопка отмены должна быть слева
    }

    Alert.alert(title, msg, buttons);
}

gotoOrderPreview = order_id => async () => {
    try {
        const { data } = await NetworkRequests.getOrder(order_id);
        _navigation.navigate('OrderPreview', { order: data });
    } catch (error) {
        console.log('gotoOrderPreview error', error);
    }
};

function gotoAuthLoading() {
    _navigation.navigate('AuthLoading');
}

export function prepareNotificationListener(navigation) {
    _navigation = navigation;
}
