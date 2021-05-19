package ru.baikalweb.gruz.foreground;

import android.Manifest;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;

import javax.annotation.Nonnull;

import ru.baikalweb.gruz.LocationBroadcastReceiver;

public class LocationModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "ReactNativeJS";

    private static final long FASTEST_INTERVAL = 5 * 60 * 1000;
    private static final long INTERVAL = 15 * 60 * 1000;
    private static final int PRIORITY = LocationRequest.PRIORITY_BALANCED_POWER_ACCURACY;

    private FusedLocationProviderClient mFusedLocationProviderClient;
    private PendingIntent locationPendingIntent;

    public LocationModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private void startLocation(String token, int count, Promise promise) {
        Log.d(REACT_CLASS, "startLocation");

        Context context = this.getReactApplicationContext();
        SharedPreferences sharedPref = context.getSharedPreferences("db", Context.MODE_PRIVATE);
        if (token != null) {
            SharedPreferences.Editor ed = sharedPref.edit();
            ed.putString("token", token);
            ed.apply();
        }

        LocationRequest locationRequest = LocationRequest.create()
                .setFastestInterval(FASTEST_INTERVAL)
                .setInterval(INTERVAL)
                .setPriority(PRIORITY);

        if (count != 0) {
            locationRequest.setNumUpdates(count);
        }

        if (mFusedLocationProviderClient == null) {
            mFusedLocationProviderClient = LocationServices
                    .getFusedLocationProviderClient(context);
        }

        if (
                ActivityCompat.checkSelfPermission(
                        context,
                        Manifest.permission.ACCESS_FINE_LOCATION
                ) == PackageManager.PERMISSION_GRANTED
        ) {
            mFusedLocationProviderClient.requestLocationUpdates(
                    locationRequest,
                    getLocationPendingIntent(token)
            );
            promise.resolve(true);
        } else {
            promise.reject("1", "Permissions not granted");
        }
    }

    private PendingIntent getLocationPendingIntent(String token) {
        // Reuse the PendingIntent if we already have it.
        if (locationPendingIntent != null) {
            return locationPendingIntent;
        }
        Intent intent = new Intent(this.getReactApplicationContext(), LocationBroadcastReceiver.class);
//        if (token != null) intent.putExtra("token", token);
        locationPendingIntent = PendingIntent.getBroadcast(
                this.getReactApplicationContext(),
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT
        );
        return locationPendingIntent;
    }

    private PendingIntent getLocationPendingIntent() {
        return getLocationPendingIntent(null);
    }
    //Custom function that we are going to export to JS

    @Override
    public String getName() {
        return "LocationModule";
    }

    @ReactMethod
    public void sendOneLocation(String token, Promise promise) {
        startLocation(token, 1, promise);
    }

    @ReactMethod
    public void startSendLocations(String token, Promise promise) {
        startLocation(token, 0, promise);
    }

    @ReactMethod
    public void stopSendLocations(Promise promise) {
        Log.d(REACT_CLASS, "stopReceiveLocation");

        if (mFusedLocationProviderClient == null) {
            mFusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(
                    this.getReactApplicationContext()
            );
        }

        mFusedLocationProviderClient.removeLocationUpdates(getLocationPendingIntent());
        promise.resolve(true);
    }
}
