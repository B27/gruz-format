package ru.baikalweb.gruz;

import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import javax.annotation.Nullable;

public class MainActivity extends ReactActivity {

    private static final String TAG = "MainActivity";

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
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
