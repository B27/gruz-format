package ru.baikalweb.gruz.foreground;

import android.annotation.TargetApi;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.BitmapFactory;
import android.location.Location;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;
import ru.baikalweb.gruz.MainActivity;
import ru.baikalweb.gruz.R;

public class SendLocationService extends Service implements LocationListener {
    public static final String APP_NAME = "Формат.Груз";
    public static final String TAG = "SendLocationService";
    public static final String FOREGROUND = "ru.baikalweb.gruz.foreground.SendLocationService";
    private static int NOTIFICATION_ID = 3313;
    private NotificationManager mNotificationManager;
    private GoogleApiClient mGoogleApiClient;
    private LocationRequest mLocationRequest;
    private double fusedLatitude = 0.0;
    private double fusedLongitude = 0.0;
    private Socket mSocket;

    @Override
    @TargetApi(Build.VERSION_CODES.M)
    public void onCreate() {
        Log.d(TAG, "onCreate");

        super.onCreate();
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "onDestroy");
        stopFusedLocation();
        mSocket.disconnect();
        super.onDestroy();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "onStartCommand, calling startForeground");
        startForeground(NOTIFICATION_ID, getCompatNotification());
        Context context = getApplicationContext();
        SharedPreferences sharedPref = context.getSharedPreferences("db", Context.MODE_PRIVATE);
        if (intent != null) {
            if (intent.getExtras() != null) {
                SharedPreferences.Editor ed = sharedPref.edit();
                ed.putString("token", intent.getStringExtra("token"));
                ed.apply();
            }
        } else {
            Log.d(TAG, "intent is null");
        }

        try {
            IO.Options opts = new IO.Options();
            opts.query = "token=" + sharedPref.getString("token", "");
            mSocket = IO.socket("https://gruz.bw2api.ru/socket", opts);
            mSocket.connect();
//            mSocket.emit("set work", true);
        } catch (URISyntaxException e) {
            Log.d(TAG, e.toString());
        }

        if (checkPlayServices()) {
            startFusedLocation();
            registerRequestUpdate(this);
        }
        return START_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private Notification getCompatNotification() {
        Log.d(TAG, "getCompatNotification");
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this);
        String str = "В работе";
        builder.setSmallIcon(R.mipmap.ic_launcher)
                .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher))
                .setContentTitle(APP_NAME).setContentText(str).setTicker(str).setWhen(System.currentTimeMillis())
                .setChannelId(getResources().getString(R.string.default_notification_channel_id));
        Intent startIntent = new Intent(getApplicationContext(), MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(this, 1000, startIntent, 0);
        builder.setContentIntent(contentIntent);
        return builder.build();
    }

    // check if google play services is installed on the device
    private boolean checkPlayServices() {
        int resultCode = GooglePlayServicesUtil.isGooglePlayServicesAvailable(this);
        if (resultCode != ConnectionResult.SUCCESS) {
            if (GooglePlayServicesUtil.isUserRecoverableError(resultCode)) {
                Log.d(TAG, "This device is supported. ---Please download google play services");
            } else {
                Log.d(TAG, "This device is not supported.");
                // finish();
            }
            return false;
        }
        return true;
    }

    public void startFusedLocation() {
        Log.d(TAG, "startFusedLocation");
        if (mGoogleApiClient == null) {
            mGoogleApiClient = new GoogleApiClient.Builder(this).addApi(LocationServices.API)
                    .addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks() {
                        @Override
                        public void onConnectionSuspended(int cause) {
                        }

                        @Override
                        public void onConnected(Bundle connectionHint) {
                            Log.d(TAG, "startFusedLocation / onConnected");
                        }
                    }).addOnConnectionFailedListener(new GoogleApiClient.OnConnectionFailedListener() {

                        @Override
                        public void onConnectionFailed(ConnectionResult result) {
                            Log.d(TAG, "startFusedLocation / onConnectedFailed " + result);
                        }
                    }).build();
            mGoogleApiClient.connect();
        } else {
            mGoogleApiClient.connect();
        }
    }

    public void stopFusedLocation() {
        if (mGoogleApiClient != null) {
            mGoogleApiClient.disconnect();
//            mSocket.emit("set work", false);
        }
    }

    public void registerRequestUpdate(final LocationListener listener) {
        mLocationRequest = LocationRequest.create();
        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        mLocationRequest.setInterval(10000); // every second
        Log.d(TAG, "registerRequestUpdate");
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                try {
                    LocationServices.FusedLocationApi.requestLocationUpdates(mGoogleApiClient, mLocationRequest,
                            listener);
                } catch (SecurityException e) {
                    e.printStackTrace();
                } catch (Exception e) {
                    e.printStackTrace();
                    if (!isGoogleApiClientConnected()) {
                        mGoogleApiClient.connect();
                    }
                    registerRequestUpdate(listener);
                }
            }
        }, 1000);
    }

    public boolean isGoogleApiClientConnected() {
        Log.d(TAG, "isGoogleApiClientConnected");
        return mGoogleApiClient != null && mGoogleApiClient.isConnected();
    }

    @Override
    public void onLocationChanged(Location location) {
        Log.d(TAG, "onLocationChanged");
        setFusedLatitude(location.getLatitude());
        setFusedLongitude(location.getLongitude());

        // Toast.makeText(getApplicationContext(), "NEW LOCATION RECEIVED",
        // Toast.LENGTH_LONG).show();
        Log.d(TAG, "startFusedLocation");
        JSONObject obj = new JSONObject();
        JSONArray coords = new JSONArray();
        try {
            coords.put(getFusedLongitude());
            coords.put(getFusedLatitude());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        try {
            obj.put("type", "Point");
            obj.put("coordinates", coords);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        Log.d(TAG, "data to send: " + obj);

        mSocket.emit("geo data", obj.toString());
        Log.d(TAG, "Lat: " + getFusedLatitude());
        Log.d(TAG, "Lng: " + getFusedLongitude());
    }

    public double getFusedLatitude() {
        return fusedLatitude;
    }

    public void setFusedLatitude(double lat) {
        fusedLatitude = lat;
    }

    public double getFusedLongitude() {
        return fusedLongitude;
    }

    public void setFusedLongitude(double lon) {
        fusedLongitude = lon;
    }
}