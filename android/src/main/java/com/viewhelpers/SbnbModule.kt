package com.viewhelpers

import android.os.Build
import android.view.View
import android.view.WindowInsetsController
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.ColorPropConverter
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.PixelUtil

class SbnbModule(reactContext: ReactApplicationContext) :
  NativeSbnbSpec(reactContext) {

  private var fitsSystemWindows = true

  override fun getName(): String {
    return NAME
  }

  override fun navigationBarHeight(): Double {
    if (fitsSystemWindows) return 0.0
    val activity = currentActivity ?: return 0.0
    val insets = ViewCompat.getRootWindowInsets(activity.window.decorView)
    val bottom =
      insets?.getInsets(WindowInsetsCompat.Type.navigationBars())?.bottom ?: 0
    return PixelUtil.toDIPFromPixel(bottom.toFloat()).toDouble()
  }

  override fun toggleFitsSystemWindows(fits: Boolean) {
    currentActivity?.runOnUiThread {
      val activity = currentActivity ?: return@runOnUiThread
      fitsSystemWindows = fits
      WindowCompat.setDecorFitsSystemWindows(activity.window, fits)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        activity.window.isNavigationBarContrastEnforced = false
      }
    }
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
        if (newColor != null) it.window.statusBarColor = newColor
        if (newNavBarColor != null) it.window.navigationBarColor = newNavBarColor
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
