package ru.baikalweb.gruz.foreground;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;

import java.util.concurrent.TimeUnit;

public class SheduleWorker extends Worker {

    static final String TAG = "workmng";
    private FusedLocationProviderClient fusedLocationClient;
    public SheduleWorker(@NonNull Context appContext, @NonNull WorkerParameters workerParams) {
        super(appContext, workerParams);
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(appContext);
    }
    @NonNull
    @Override
    public Worker.Result doWork() {
        Log.d(TAG, "doWork: start");

        try {

            try {
                //Context context = getActivity();
                //SharedPreferences sharedPreferences = getPreferences("db", Context.MODE_PRIVATE);
                Intent intent = new Intent(OneTimeSendLocation.FOREGROUND);
                intent.putExtra("token", getInputData().getString("token"));
                intent.setClass(getApplicationContext(), OneTimeSendLocation.class);
                //startService(intent);
                //Log.d(REACT_CLASS, token);
                //intent.putExtra("token", cb());
                getApplicationContext().startService(intent);
               // Log.d(REACT_CLASS, "startService, success");
                //promise.resolve(true);
                //Intent intent = new Intent(GeoLocationService.FOREGROUND);
                //intent.setClass(this.getReactApplicationContext(), GeoLocationService.class);
                //getReactApplicationContext().startService(intent);
            } catch (Exception e) {
//               // Log.d(REACT_CLASS, "startService failed!");
//                //promise.reject(e);
//                return;
            }
            TimeUnit.SECONDS.sleep(10);
            Intent intent = new Intent(OneTimeSendLocation.FOREGROUND);
            intent.setClass(getApplicationContext(), OneTimeSendLocation.class);
            this.getApplicationContext().stopService(intent);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        Log.d(TAG, "doWork: end");

        return Result.success();
    }
}