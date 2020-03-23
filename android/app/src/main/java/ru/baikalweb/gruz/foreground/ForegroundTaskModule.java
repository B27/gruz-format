package ru.baikalweb.gruz.foreground;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

import android.content.Intent;

import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;

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
    public void startService(String token, String message, Promise promise) {
        Log.d(REACT_CLASS, "startService");

        try {
            //Context context = getActivity();
            //SharedPreferences sharedPreferences = getPreferences("db", Context.MODE_PRIVATE);
            Intent intent = new Intent(SendLocationService.FOREGROUND);
            intent.putExtra("token", token);
            intent.putExtra("message", message);
            intent.setClass(this.getReactApplicationContext(), SendLocationService.class);
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
            Intent intent = new Intent(SendLocationService.FOREGROUND);
            intent.setClass(this.getReactApplicationContext(), SendLocationService.class);
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
