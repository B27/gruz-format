package ru.baikalweb.gruz;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.location.Location;
import android.os.Bundle;
import android.util.Log;

import com.google.android.gms.location.LocationAvailability;
import com.google.android.gms.location.LocationResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;
import java.util.Set;

import io.socket.client.Ack;
import io.socket.client.IO;
import io.socket.client.Socket;

public class LocationBroadcastReceiver extends BroadcastReceiver {
    private static final String TAG = "LocationBrdReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.i(TAG, "~~LocationBroadcastReceiver~~");
        Bundle bundle = intent.getExtras();
        Set<String> set = bundle.keySet();
        for (String s : set) {
            Log.i(TAG, "key:");
            Log.i(TAG, s);
        }

        if (LocationAvailability.hasLocationAvailability(intent)) {
            // TODO: Send to server info if location not available
            LocationAvailability locationAvailability = LocationAvailability.extractLocationAvailability(intent);
            Log.i(TAG, "location availability:");
            Log.i(TAG, locationAvailability.toString());
        }

        if (LocationResult.hasResult(intent)) {
            LocationResult result = LocationResult.extractResult(intent);
            Location location = result.getLastLocation();

            SharedPreferences sharedPref = context.getSharedPreferences("db", Context.MODE_PRIVATE);
            String token = sharedPref.getString("token", null);
            if (token != null) {
                sendLocation(token, location);
                Log.i(TAG, result.toString());
            } else {
                Log.e(TAG, "token is null");
            }
        } else {
            Log.e(TAG, "no result");
        }
    }

    private void sendLocation(String token, Location location) {
        Log.i(TAG, "token null");
        if (token == null) return;
        IO.Options opts = new IO.Options();
        opts.query = "token=" + token;
        Socket socket;
        try {
            socket = IO.socket("https://api.gruzformat.ru/socket", opts);
//            socket = IO.socket("http://10.0.2.2:3008/socket", opts);
        } catch (URISyntaxException e) {
            Log.d(TAG, e.toString());
            return;
        }
        socket.on(Socket.EVENT_CONNECT, args -> {
            JSONObject obj = new JSONObject();
            JSONArray coords = new JSONArray();

            try {
                coords.put(location.getLongitude());
                coords.put(location.getLatitude());
            } catch (JSONException e) {
                e.printStackTrace();
                return;
            }

            try {
                obj.put("type", "Point");
                obj.put("coordinates", coords);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            socket.emit("geo data", obj.toString(), (Ack) args1 -> socket.disconnect());

            Log.d(TAG, "Lng: " + location.getLongitude());
            Log.d(TAG, "Lat: " + location.getLatitude());
        });

        socket.connect();
    }
}

