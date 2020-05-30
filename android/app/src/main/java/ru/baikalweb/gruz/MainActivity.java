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

import java.util.ArrayList;

import javax.annotation.Nullable;

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
        ArrayList<NotificationChannel> channelsList = new ArrayList<>();

        Uri ordersSound = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.orders);
        Uri othersSound = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.others);

        AudioAttributes attr = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                .build();


        NotificationChannel defaultCh = new NotificationChannel(
                getString(R.string.default_ncid),
                getString(R.string.default_ncn),
                NotificationManager.IMPORTANCE_LOW
        );
        defaultCh.setDescription(getString(R.string.default_ncd));
        channelsList.add(defaultCh);

        NotificationChannel newOrderCh = new NotificationChannel(
                getString(R.string.new_order_ncid),
                getString(R.string.new_order_ncn),
                NotificationManager.IMPORTANCE_HIGH);
        newOrderCh.setSound(ordersSound, attr);
        channelsList.add(newOrderCh);

        NotificationChannel kickFromOrderCh = new NotificationChannel(
                getString(R.string.kick_from_order_ncid),
                getString(R.string.kick_from_order_ncn),
                NotificationManager.IMPORTANCE_HIGH);
        kickFromOrderCh.setSound(ordersSound, attr);
        channelsList.add(kickFromOrderCh);

        NotificationChannel rejectOrderCh = new NotificationChannel(
                getString(R.string.reject_order_ncid),
                getString(R.string.reject_order_ncn),
                NotificationManager.IMPORTANCE_HIGH
        );
        rejectOrderCh.setSound(ordersSound, attr);
        channelsList.add(rejectOrderCh);

        NotificationChannel inactiveUserCh = new NotificationChannel(
                getString(R.string.inactive_user_ncid),
                getString(R.string.inactive_user_ncn),
                NotificationManager.IMPORTANCE_DEFAULT
        );
        inactiveUserCh.setSound(othersSound, attr);
        channelsList.add(inactiveUserCh);

        NotificationChannel newMessageCh = new NotificationChannel(
                getString(R.string.new_message_ncid),
                getString(R.string.new_message_ncn),
                NotificationManager.IMPORTANCE_DEFAULT
        );
        newMessageCh.setSound(othersSound, attr);
        channelsList.add(newMessageCh);


        NotificationManager notificationManager =
                getSystemService(NotificationManager.class);

        notificationManager.createNotificationChannels(channelsList);
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

            @Nullable
            @Override
            protected Bundle getLaunchOptions() {
                Bundle data = getPlainActivity().getIntent().getExtras();
                Bundle initialProps = null;

                if (data != null) {
                    for (String key : data.keySet()) {
                        Object value = data.get(key);
                        Log.d(TAG, "Key: " + key + " Value: " + value);
                    }

                    initialProps = new Bundle();

                    initialProps.putString("type", data.getString("type"));
                    initialProps.putString("order_id", data.getString("order_id"));
                }

                return initialProps;
            }
        };
    }
}
