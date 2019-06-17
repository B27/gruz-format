package ru.baikalweb.gruz.firebase.push;

import android.util.Log;

import com.facebook.react.bridge.WritableNativeArray;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import ru.baikalweb.gruz.birdge.EventHelper;

public class GruzFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG = "FirebaseMsgService";

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        // TODO(developer): Handle FCM messages here.
        // Not getting messages here? See why this may be: https://goo.gl/39bRNJ
        Log.d(TAG, "From: " + remoteMessage.getFrom());

        WritableNativeArray params = new WritableNativeArray();

        // Check if message contains a data payload.
        if (remoteMessage.getData().size() > 0) {
            Log.d(TAG, "Message data payload: " + remoteMessage.getData());
        }

        // Check if message contains a notification payload.
        if (remoteMessage.getNotification() != null) {
            Log.d(TAG, "Message Notification Body: " + remoteMessage.getNotification().getBody());
            params.pushString(remoteMessage.getNotification().getBody());
        }    

        EventHelper.sendEvent("onMessageReceived", this, params);
    }

    @Override
    public void onNewToken(String token) {
        Log.d(TAG, "Refreshed token: " + token);

        sendRegistrationToServer(token);
    }


    private void sendRegistrationToServer(String token) {
        // TODO: Implement this method to send token to your app server.
        WritableNativeArray params = new WritableNativeArray();
        params.pushString(token);
        EventHelper.sendEvent("onNewToken", this, params);
    }
}