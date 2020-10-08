import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetworkRequests from '../mobx/NetworkRequests';
import showAlert from './showAlert';

let _navigation = null;
let _pendingParams = null;

const TAG = '~NotificationListener~';

// на ios приходит RemoteNotification из rnfirebase, а на android самописный массив из нативного кода
export default async function NotificationListener(params) {
    let type, orderId, title, body;
    Platform.select({
        android: () => ([type, orderId, title, body] = params),
        ios: () => {
            ({ type, orderId } = params.data);
            ({ title, body } = params.notification);
        },
    })();

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

            // Иногда уведомления могут приходить когда пользователь разлогинился (удаляется FirebaseIinstanceId)
            // Наибольшая вероятность получить уведомление когда он разлогинится оффлайн
            const userAuthorized = await AsyncStorage.getItem('token');
            if (userAuthorized) {
                let newBody = 'Нажмите ОК для перехода к деталям заказа';
                showAlert(title, newBody, { okFn: gotoOrderPreview(orderId), cancel: true });
            }
        } else {
            console.log(TAG, `type == ${type}`);
            _refreshCallback && _refreshCallback();
        }
    } else {
        if (acceptNotification) {
            console.log(TAG, 'call gotoOrderPreview(order)()');
            gotoOrderPreview(orderId)();
        }
    }
}

const gotoOrderPreview = (order_id) => async () => {
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

export async function execPendingNotificationListener() {
    if (_pendingParams) {
        await NotificationListener(_pendingParams);
        _pendingParams = null;
    }
}

export function setPendingNotificationParams(params) {
    _pendingParams = params;
}

export function setRefreshCallback(callback) {
    _refreshCallback = callback;
}
