package ru.baikalweb.gruz;

import android.app.Dialog;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.graphics.Color;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.RequiresApi;
import android.support.v4.view.ViewCompat;
import android.util.Log;
import android.view.View;
import android.view.WindowInsets;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.WritableNativeArray;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import ru.baikalweb.gruz.bridge.EventHelper;


public class MainActivity extends ReactActivity {

    private static final String TAG = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            createNotificationChannels();
        }


        // компонент StatusBar из React Native делает то же самое
        // но почему-то, если свернуть приложение и снова запустить из меню приложений
        // слушатель сбрасывается, поэтому пришлось настроить статусбар здесь
        getWindow().setStatusBarColor(Color.argb(102, 0, 0, 0));
        View decorView = getWindow().getDecorView();

        decorView.setOnApplyWindowInsetsListener((v, insets) -> {
            WindowInsets defaultInsets = v.onApplyWindowInsets(insets);
            return defaultInsets.replaceSystemWindowInsets(
                    defaultInsets.getSystemWindowInsetLeft(),
                    0,
                    defaultInsets.getSystemWindowInsetRight(),
                    defaultInsets.getSystemWindowInsetBottom());
        });

        ViewCompat.requestApplyInsets(decorView);

        int code = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(
                getApplicationContext());
        if (code != ConnectionResult.SUCCESS) {
            Dialog dlg =
                    GoogleApiAvailability.getInstance().getErrorDialog(this, code, 1);
            dlg.show();
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void createNotificationChannels() {
        // Create channel to show notifications.
        String defaultChannelId = getString(R.string.default_notification_channel_id);
        String defaultChannelName = getString(R.string.default_notification_channel_name);

        String newOrderChannelId = getString(R.string.new_order_notification_channel_id);
        String newOrderChannelName = getString(R.string.new_order_notification_channel_name);

        NotificationManager notificationManager =
                getSystemService(NotificationManager.class);

        NotificationChannel defaultChannel = new NotificationChannel(defaultChannelId,
                defaultChannelName, NotificationManager.IMPORTANCE_DEFAULT);

        NotificationChannel newOrderChannel = new NotificationChannel(newOrderChannelId,
                newOrderChannelName, NotificationManager.IMPORTANCE_HIGH);
        Uri soundUri = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.new_order);
        AudioAttributes attr = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                .build();
        newOrderChannel.setSound(soundUri, attr);

        notificationManager.createNotificationChannel(defaultChannel);
        notificationManager.createNotificationChannel(newOrderChannel);
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Log.d(TAG, "onNewIntent fired");

        Bundle data = intent.getExtras();

        if (data != null) {
            for (String key : data.keySet()) {
                Object value = data.get(key);
                Log.d(TAG, "Key: " + key + " Value: " + value);
            }

            WritableNativeArray params = new WritableNativeArray();

            params.pushString(data.getString("type"));
            params.pushString(data.getString("order_id"));

            EventHelper.sendEvent("onMessageReceived", this, params);
        }
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "FormatGruz";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
