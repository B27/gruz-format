package ru.baikalweb.gruz;

import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.view.ViewCompat;
import android.view.View;
import android.view.WindowInsets;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;


public class MainActivity extends ReactActivity {

    private static final String TAG = "MainActivity";

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule rendering of the component.
     */
     @Override
     protected void onCreate(Bundle savedInstanceState) {
         super.onCreate(savedInstanceState);
         
         // компонент StatusBar из React Native делает то же самое
         // но почему-то, если свернуть приложение и снова запустить из меню приложений
         // слушатель сбрасывается, поэтому пришлось настроить статусбар здесь  
         getWindow().setStatusBarColor(Color.argb(102, 0, 0, 0));
         View decorView = getWindow().getDecorView();

         decorView.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
             @Override
             public WindowInsets onApplyWindowInsets(View v, WindowInsets insets) {
                 WindowInsets defaultInsets = v.onApplyWindowInsets(insets);
                 return defaultInsets.replaceSystemWindowInsets(
                         defaultInsets.getSystemWindowInsetLeft(),
                         0,
                         defaultInsets.getSystemWindowInsetRight(),
                         defaultInsets.getSystemWindowInsetBottom());
             }
         });

         ViewCompat.requestApplyInsets(decorView);
     }

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
