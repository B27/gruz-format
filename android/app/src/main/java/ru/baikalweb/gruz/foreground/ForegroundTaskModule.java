package ru.baikalweb.gruz.foreground;

import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;
import android.util.Log;
import com.facebook.react.bridge.Promise;
import android.content.Intent;
import android.app.PendingIntent;
import android.graphics.BitmapFactory;

import ru.baikalweb.gruz.foreground.SendLocation;

public class ForegroundTaskModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "ReactNativeJS";

    public ForegroundTaskModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    //Mandatory function getName that specifies the module name
    @Override
    public String getName() {
        return "ForegroundTaskModule";
    }
    //Custom function that we are going to export to JS
    @ReactMethod
    public void getDeviceName(Callback cb) {
        try{
            cb.invoke(null, android.os.Build.MODEL);
        }catch (Exception e){
            cb.invoke(e.toString(), null);
        }
    }

    @ReactMethod 
    public void startService(String token, Promise promise) {
        Log.d(REACT_CLASS, "startService");
        try {
            Intent intent = new Intent(SendLocation.FOREGROUND);
            intent.putExtra("token", token);
            intent.setClass(this.getReactApplicationContext(), SendLocation.class);
            //startService(intent);
            Log.d(REACT_CLASS, token);
            //intent.putExtra("token", cb());
            getReactApplicationContext().startService(intent);
            Log.d(REACT_CLASS, "startService, success");
            promise.resolve(true);
            //Intent intent = new Intent(GeoLocationService.FOREGROUND);
            //intent.setClass(this.getReactApplicationContext(), GeoLocationService.class);
            //getReactApplicationContext().startService(intent);
        } catch (Exception e) {
            Log.d(REACT_CLASS, "startService failed!");
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void stopService(Promise promise) {
        Log.d(REACT_CLASS, "stopService");
        try {
            Intent intent = new Intent(SendLocation.FOREGROUND);
            intent.setClass(this.getReactApplicationContext(), SendLocation.class);
            this.getReactApplicationContext().stopService(intent);
            //Intent intent = new Intent(GeoLocationService.FOREGROUND);
            //intent.setClass(this.getReactApplicationContext(), GeoLocationService.class);
            //this.getReactApplicationContext().stopService(intent);
        } catch (Exception e) {
            Log.d(REACT_CLASS, "stopService failed!");
            promise.reject(e);
            return;
        }
        promise.resolve(true);
    }
}
