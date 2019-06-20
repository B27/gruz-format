package ru.baikalweb.gruz;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.view.ViewCompat;
import android.util.Log;
import android.view.View;
import android.view.WindowInsets;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.WritableNativeArray;
import com.google.firebase.messaging.RemoteMessage;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import java.util.Map;

import ru.baikalweb.gruz.birdge.EventHelper;


public class MainActivity extends ReactActivity {

    private static final String TAG = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Create channel to show notifications.
            String channelId = getString(R.string.default_notification_channel_id);
            String channelName = getString(R.string.default_notification_channel_name);
            NotificationManager notificationManager =
                    getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(new NotificationChannel(channelId,
                    channelName, NotificationManager.IMPORTANCE_HIGH));
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
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (getIntent().getExtras() != null) {

            Bundle data = getIntent().getExtras();

            for (String key : getIntent().getExtras().keySet()) {
                Object value = getIntent().getExtras().get(key);
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
