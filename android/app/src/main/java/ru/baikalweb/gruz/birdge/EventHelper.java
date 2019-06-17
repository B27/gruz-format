package ru.baikalweb.gruz.birdge;

import android.app.Activity;
import android.app.Service;
import android.content.Context;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import ru.baikalweb.gruz.MainApplication;

public final class EventHelper {
    public static void sendEvent(String eventName, Context context, WritableNativeArray params) {
        // Вот откуда это взял https://github.com/facebook/react-native/issues/5846#issuecomment-385230183
        MainApplication application = null;

        if (context instanceof Activity) {
            application = (MainApplication) ((Activity) context).getApplication();
        } else if (context instanceof Service) {
            application = (MainApplication) ((Service) context).getApplication();
        }

        sendEventToJS(eventName, application, params);
    }

    private static void sendEventToJS(String eventName, MainApplication application, WritableNativeArray params) {
        if (application == null) return;
        ReactNativeHost reactNativeHost = application.getReactNativeHost();
        ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();

        if (reactContext != null) {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }
    }

}
