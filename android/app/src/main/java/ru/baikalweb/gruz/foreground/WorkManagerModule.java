package ru.baikalweb.gruz.foreground;

import android.content.Intent;
import android.util.Log;

import androidx.work.Data;
import androidx.work.OneTimeWorkRequest;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.concurrent.TimeUnit;

public class WorkManagerModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "WorkManagerModule";
    // constructor
    public WorkManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    // Mandatory function getName that specifies the module name
    @Override
    public String getName() {
        return "WorkManager";
    }

    // Custom function that we are going to export to JS
    @ReactMethod
    public void getDeviceName(Callback cb) {
        try {
            cb.invoke(null, android.os.Build.MODEL);
        } catch (Exception e) {
            cb.invoke(e.toString(), null);
        }
    }

    @ReactMethod
    public void startWorkManager(String token) {
        Data myData = new Data.Builder()
                .putString("token", token)
                .build();
        PeriodicWorkRequest workRequest = new PeriodicWorkRequest.Builder(SheduleWorker.class, 1, TimeUnit.MINUTES).setInputData(myData).addTag("geo").build();
        WorkManager.getInstance().enqueue(workRequest);
        Log.d(REACT_CLASS, "startWorkManager");
//        try {
//            // Context context = getActivity();
//            // SharedPreferences sharedPreferences = getPreferences("db",
//            // Context.MODE_PRIVATE);
//            Intent intent = new Intent(SendLocationService.FOREGROUND);
//            intent.putExtra("token", token);
//            intent.setClass(this.getReactApplicationContext(), SendLocationService.class);
//            // startService(intent);
//            Log.d(REACT_CLASS, token);
//            // intent.putExtra("token", cb());
//            getReactApplicationContext().startService(intent);
//            Log.d(REACT_CLASS, "startService, success");
//            promise.resolve(true);
//            // Intent intent = new Intent(GeoLocationService.FOREGROUND);
//            // intent.setClass(this.getReactApplicationContext(), GeoLocationService.class);
//            // getReactApplicationContext().startService(intent);
//        } catch (Exception e) {
//            Log.d(REACT_CLASS, "startService failed!");
//            promise.reject(e);
//            return;
//        }
    }
    @ReactMethod
    public void stopWorkManager() {
        WorkManager.getInstance().cancelAllWorkByTag("geo");
        Log.d(REACT_CLASS, "stopWorkManager");
    }

}