package com.rn068.bars;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowManager;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.PixelUtil;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = RNBarsModule.NAME)
public class RNBarsModule extends ReactContextBaseJavaModule {

  public static final String NAME = "RNBars";
  private static ReactApplicationContext mReactContext;
  private float navHeight = 0;

  public RNBarsModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mReactContext = reactContext;
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @Nullable
  @Override
  public Map<String, Object> getConstants() {
    HashMap<String, Object> constants = new HashMap<>();
    float navigationBarHeight = getNavigationBarHeight();
    navHeight = navigationBarHeight;

    constants.put("navigationBarHeight", navigationBarHeight);
    return constants;
  }

  @ReactMethod
  public void init(@NonNull final String styles) {
    Activity activity = getCurrentActivity();
    if (activity == null) {
      FLog.w(
        ReactConstants.TAG,
        NAME + ": Ignored initialization, current activity is null.");
      return;
    }

    final Window window = activity.getWindow();
    final View decorView = window.getDecorView();

    activity.runOnUiThread(() -> {
      WindowCompat.setDecorFitsSystemWindows(window, false);
      WindowInsetsControllerCompat insetsController =
              new WindowInsetsControllerCompat(window, decorView);

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
        window.clearFlags(
          WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS |
            WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
        );

        window.setStatusBarColor(Color.TRANSPARENT);
        window.setNavigationBarColor(Color.TRANSPARENT);

        insetsController.setAppearanceLightStatusBars("dark-content".equals(styles));
        insetsController.setAppearanceLightNavigationBars("dark-content".equals(styles));

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
          window.setStatusBarContrastEnforced(false);
          window.setNavigationBarContrastEnforced(false);
        }
      } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);

        window.setStatusBarColor(Color.TRANSPARENT);

        insetsController.setAppearanceLightStatusBars("dark-content".equals(styles));
      } else {
        window.addFlags(
          WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS |
            WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
        );
      }

      decorView.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
        @Override
        public WindowInsets onApplyWindowInsets(View v, WindowInsets insets) {
          WindowInsets defaultInsets = v.onApplyWindowInsets(insets);
          float naviHeightDIP = PixelUtil.toDIPFromPixel(defaultInsets.getSystemWindowInsetBottom());
          if (naviHeightDIP != navHeight) {
            navHeight = naviHeightDIP;
            sendEvent(naviHeightDIP);
          }
          return defaultInsets.replaceSystemWindowInsets(
                  defaultInsets.getSystemWindowInsetLeft(),
                  0,
                  defaultInsets.getSystemWindowInsetRight(),
                  0);
        }
      });
      ViewCompat.requestApplyInsets(decorView);
    });
  }

  private float getNavigationBarHeight() {
    final Context context = getReactApplicationContext();
    final boolean hasPermanentMenuKey = ViewConfiguration.get(context).hasPermanentMenuKey();

    final int navigationBarHeightResId =
            context.getResources().getIdentifier("navigation_bar_height", "dimen", "android");

    final float navigationBarHeight =
            navigationBarHeightResId > 0 && !hasPermanentMenuKey
                    ? PixelUtil.toDIPFromPixel(context.getResources().getDimensionPixelSize(navigationBarHeightResId))
                    : 0;
    return navigationBarHeight;
  }

  private static void sendEvent(float naviHeight) {
    if (mReactContext == null) return;
    WritableMap event = Arguments.createMap();
    event.putDouble("navigationBarHeight", naviHeight);
    mReactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("rnBarsNavHeight", event);
  }

  @ReactMethod
  public void setStatusBarStyle(@Nullable final String style) {
    final Activity activity = getCurrentActivity();

    if (activity == null) {
      FLog.w(
        ReactConstants.TAG,
        NAME + ": Ignored status bar change, current activity is null.");
      return;
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      final Window window = activity.getWindow();
      final View decorView = window.getDecorView();

      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          new WindowInsetsControllerCompat(window, decorView)
            .setAppearanceLightStatusBars("dark-content".equals(style));
        }
      });
    }
  }

  @ReactMethod
  public void setNavigationBarStyle(@Nullable final String style) {
    final Activity activity = getCurrentActivity();

    if (activity == null) {
      FLog.w(
        ReactConstants.TAG,
        NAME + ": Ignored navigation bar change, current activity is null.");
      return;
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
      final Window window = activity.getWindow();
      final View decorView = window.getDecorView();

      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          new WindowInsetsControllerCompat(window, decorView)
            .setAppearanceLightNavigationBars("dark-content".equals(style));
        }
      });
    }
  }
}
