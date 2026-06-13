package com.viewhelpers

import android.os.Build
import android.view.View
import android.view.WindowInsetsController
import com.facebook.react.bridge.ColorPropConverter
import com.facebook.react.bridge.ReactApplicationContext

class SbnbModule(reactContext: ReactApplicationContext) :
  NativeSbnbSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  override fun setStatusBarStyle(dark: Boolean) {
    currentActivity?.runOnUiThread {
      val activity = currentActivity ?: return@runOnUiThread
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return@runOnUiThread
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        activity.window.decorView.windowInsetsController?.setSystemBarsAppearance(
          if (dark) WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS else 0,
          WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
        );
      } else {
        if (!dark) {
          // Draw light icons on a dark background color
          activity.window.decorView.systemUiVisibility =
            activity.window.decorView.systemUiVisibility and View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR.inv()
        } else {
          // Draw dark icons on a light background color
          activity.window.decorView.systemUiVisibility =
            activity.window.decorView.systemUiVisibility or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
        }
      }
    }
  }

  override fun setSystemUIColor(color: Double, navColor: Double) {
    currentActivity?.runOnUiThread {
      currentActivity?.let {
        val newColor = ColorPropConverter.getColor(color, it)
        val newNavBarColor = ColorPropConverter.getColor(navColor, it)
        it.window.statusBarColor = newColor
        it.window.navigationBarColor = newNavBarColor
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
          it.window?.isNavigationBarContrastEnforced = false
        }
      }
    }
  }

  companion object {
    const val NAME = "Sbnb"
  }
}
