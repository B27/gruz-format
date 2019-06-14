package ru.baikalweb.gruz.foreground;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

public class ForegroundTaskModule extends ReactContextBaseJavaModule {

    public ForegroundTaskModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    //Mandatory function getName that specifies the module name
    @Override
    public String getName() {
        return "ForegroundTaskModule";
    }
    //Custom function that we are going to export to JS
    @ReactMethod
    public void getDeviceName(Callback cb) {
        try{
            cb.invoke(null, android.os.Build.MODEL);
        }catch (Exception e){
            cb.invoke(e.toString(), null);
        }
    }
}
