import { Alert } from 'react-native';
import NetworkRequests from '../mobx/NetworkRequests';
import showAlert from './showAlert';
import {PlaySound} from "react-native-play-sound";

let _navigation = null;

const TAG = '~NotificationListener~';

export default async function NotificationListener(params) {
    const [type, orderId, title, body] = params;

    console.log(TAG, 'Notification recieved, params: ', params);

    // Когда приложение на переднем плане, GruzFirebaseMessagingService отсылает event с type, order, title, body.
    // Когда приложение в фоне или закрыто, firebase отправляет уведомление в трей
    // по нажатии на уведомление в MainActivity в методе onResume отсылается event
    // с type и order, title и body не приходят

    const recievedInForeground = title && body;
    const acceptNotification = type == 'accept';

    if (acceptNotification && !_navigation) {
        console.log(TAG, '_navigation is null');
        return;
    }

    if (recievedInForeground) {
        if (acceptNotification) {
            console.log(TAG, `type == ${type}, order id`, orderId);
            //PlaySound('new_order')
            let newBody = 'Нажмите ОК для перехода к деталям заказа';
            showAlert(title, newBody, { okFn: gotoOrderPreview(orderId), cancel: true });
        } else {
            console.log(TAG, `type == ${type}`);
            _refreshCallback();
        }
    } else {
        if (acceptNotification) {
            console.log(TAG, 'call gotoOrderPreview(order)()');
            //PlaySound('new_order')
            await gotoOrderPreview(orderId);
        }
    }
}

async function gotoOrderPreview(order_id) {
    try {
        const { data } = await NetworkRequests.getOrder(order_id);
        _navigation.navigate('OrderPreview', { order: data });
    } catch (error) {
        console.log('gotoOrderPreview error', error);
    }
};

export function prepareNotificationListener(navigation) {
    _navigation = navigation;
}

export function setRefreshCallback(callback) {
    _refreshCallback = callback;
}
