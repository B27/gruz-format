import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import md5 from 'md5';
const TAG = '~FirebaseAnalyticsLogger~';

/**
 *
 * @param {Object} params
 * @param {String} params.TAG
 * @param {String} params.info name of button
 * @param {String=} params.data additional information
 */
export async function logButtonPress(params) {
    try {
        const { TAG: _TAG, info } = params;
        if (__DEV__) {
            console.log(_TAG, 'press button', info);
        }
        await analytics().logEvent('button_press', { info });
    } catch (error) {
        console.error(TAG, error);
    }
}

/**
 *
 * @param {Object} params
 * @param {String} params.TAG
 * @param {String} params.info which event
 */
export async function logInfo(params) {
    try {
        const { TAG: _TAG, info } = params;
        if (__DEV__) {
            console.log(_TAG, 'log info', info);
        }
        await analytics().logEvent('info', { info });
    } catch (error) {
        console.error(TAG, error);
    }
}

/**
 *
 * @param {String} name name of screen
 */
export async function logScreenView(name) {
    try {
        await analytics().logScreenView({ screen_name: name });
    } catch (error) {
        console.error(TAG, error);
    }
}

/**
 *
 * @param {Object} params
 * @param {String} params.TAG
 * @param {String} params.info which event
 */
export async function logView(params) {
    try {
        if (__DEV__) {
            const { TAG: _TAG, info } = params;
            console.log(_TAG, 'log view', info);
        }

        await analytics().logEvent('view', params);
    } catch (error) {
        console.error(TAG, error);
    }
}

/**
 *
 * @param {Object} params
 * @param {String} params.TAG
 * @param {String} params.orderId
 */
export async function logAcceptOrder(params) {
    try {
        const { TAG: _TAG, orderId } = params;
        if (__DEV__) {
            console.log(_TAG, 'accept order', orderId);
        }
        await analytics().logEvent('accept_order', { order_id: orderId });
    } catch (error) {
        console.error(TAG, error);
    }
}

/**
 *
 * @param {Object} params
 * @param {String} params.TAG
 * @param {String} params.orderId
 */
export async function logCancelOrder(params) {
    try {
        const { TAG: _TAG, orderId } = params;
        if (__DEV__) {
            console.log(_TAG, 'cancel order', orderId);
        }
        await analytics().logEvent('cancel_order', { order_id: orderId });
    } catch (error) {
        console.error(TAG, error);
    }
}

/**
 *
 * @param {Object} params
 * @param {String} params.TAG
 */
export async function logMakeCall(params) {
    try {
        const { TAG: _TAG } = params;
        if (__DEV__) {
            console.log(_TAG, 'make call');
        }
        await analytics().logEvent('make_call');
    } catch (error) {
        console.error(TAG, error);
    }
}

/**
 *
 * @param {Object} params
 * @param {String} params.TAG
 * @param {String[]} params.ids orders ids
 */
export async function logOrdersViews(params) {
    try {
        const { TAG: _TAG, ids: ids } = params;
        if (__DEV__) {
            console.log(_TAG, 'log view_orders', ids);
        }

        await analytics().logViewItemList({
            item_list_id: 'orders',
            item_list_name: 'orders',
            items: ids,
        });
    } catch (error) {
        console.error(TAG, error);
    }
}

/**
 *
 * @param {Object} params
 * @param {String} params.TAG
 * @param {String} params.info error description
 * @param {String=} params.error error string
 */
export async function logError(params) {
    try {
        const { TAG: _TAG, error, info } = params;
        if (__DEV__) {
            console.error(_TAG, info, error);
        }
        await analytics().logEvent('error_catch', { info, error: error ? error.toString() : undefined });
        crashlytics().recordError(error);
    } catch (error) {
        console.error(TAG, error);
    }
}

/**
 *
 * @param {Object} params
 * @param {String} params.TAG
 * @param {String[]} params.info orders ids
 */
export async function logUserOnWork(params) {
    try {
        const { TAG: _TAG, info } = params;
        if (__DEV__) {
            console.log(_TAG, 'log user on work', info);
        }

        await analytics().logEvent('user_on_work', { info });
    } catch (error) {
        console.error(TAG, error);
    }
}

export async function logSignIn() {
    try {
        await analytics().logEvent('login');
    } catch (error) {
        console.error(TAG, error);
    }
}

export async function logSignOut() {
    try {
        await analytics().logEvent('sign_out');
    } catch (error) {
        console.error(TAG, error);
    }
}

/**
 * @param {Object} params
 * @param {String} params.id
 */
export async function setUserIdForFirebase({ id }) {
    console.log(TAG, 'user id', id);
    try {
        await analytics().setUserId(md5(id));
        await crashlytics().setUserId(md5(id));
    } catch (error) {
        console.error(TAG, error);
    }
}
