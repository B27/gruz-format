package ru.baikalweb.gruz.push;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.firebase.iid.FirebaseInstanceId;

import java.io.IOException;

public class RNFirebasePushTokenModule extends ReactContextBaseJavaModule {

    //   private final ReactApplicationContext reactContext;

    public RNFirebasePushTokenModule(ReactApplicationContext reactContext) {
        super(reactContext);
        //     this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNFirebasePushToken";
    }

   
    @ReactMethod
    public void deleteInstanceId(Promise promise) {
        new Thread(() -> {
            try {
                FirebaseInstanceId.getInstance().deleteInstanceId();
                promise.resolve(null);
            } catch (IOException e) {
                promise.reject(e);
            }
        }).start();
    }

    @ReactMethod
    public void getToken(Promise promise) {
        FirebaseInstanceId.getInstance().getInstanceId()
                .addOnCompleteListener(task -> {
                    if (!task.isSuccessful()) {
                        promise.reject("getInstanceId failed", task.getException());
                        return;
                    }

                    // Get new Instance ID token
                    String token = task.getResult().getToken();

                    WritableMap map = Arguments.createMap();
                    map.putString("pushToken", token);

                    promise.resolve(map);
                });
    }
}