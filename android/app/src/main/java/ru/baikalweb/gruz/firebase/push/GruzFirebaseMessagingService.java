package ru.baikalweb.gruz.firebase.push;

import android.app.NotificationManager;
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
        Map<String, String> messageData = remoteMessage.getData();

        // Check if message contains a data payload and notification payload.
        if ((messageData.size() > 0) || (remoteMessage.getNotification() != null)) {
            RemoteMessage.Notification notification = remoteMessage.getNotification();

            String notificationType = messageData.get("type");

            if (notificationType != null && notificationType.equals("removeNotificationByTag")) {
                onRemoveMessageReceived(messageData);
                return;
            }

            params.pushString(notificationType);
            params.pushString(messageData.get("order_id"));
            params.pushString(notification.getTitle());
            params.pushString(notification.getBody());

            EventHelper.sendEvent("onMessageReceived", this, params);
        }
    }

    private void onRemoveMessageReceived(Map<String, String> data) {
        String tag = data.get("tag");
        if (tag != null) {
            NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            manager.cancel(tag, 0);
        }
    }
}