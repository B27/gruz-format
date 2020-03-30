package ru.baikalweb.gruz.firebase.push;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.facebook.react.bridge.WritableNativeArray;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;

import ru.baikalweb.gruz.bridge.EventHelper;

public class GruzFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG = "FirebaseMsgService";

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        // Not getting messages here? See why this may be: https://goo.gl/39bRNJ
        Log.d(TAG, "From: " + remoteMessage.getFrom());

        WritableNativeArray params = new WritableNativeArray();

        // Check if message contains a data payload and notification payload.
        if (/*(remoteMessage.getData().size() > 0) &&*/ (remoteMessage.getNotification() != null)) {
            Log.d(TAG, "Message data payload: " + remoteMessage.getData());
            Log.d(TAG, "Message Notification Body: " + remoteMessage.getNotification().getBody());

            RemoteMessage.Notification notification = remoteMessage.getNotification();
            Map<String, String> data = remoteMessage.getData();

            params.pushString(data.get("type"));
            params.pushString(data.get("order_id"));
            params.pushString(notification.getTitle());
            params.pushString(notification.getBody());

            EventHelper.sendEvent("onMessageReceived", this, params);
        }
    }

    @Override
    public void onNewToken(String token) {
        Log.d(TAG, "onNewToken recieved: " + token);

        // стандартное название файла в библиотеке react-native-default-preference: "react-native"
        SharedPreferences sp = getApplicationContext().getSharedPreferences("react-native", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();

        editor.putString("pushToken", token);

        editor.apply();
    }
}