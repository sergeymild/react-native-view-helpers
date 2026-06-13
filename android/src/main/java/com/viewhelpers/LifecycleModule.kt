package com.viewhelpers

import android.os.Handler
import android.os.Looper
import androidx.annotation.NonNull
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ProcessLifecycleOwner
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.WritableArray
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter


class LifecycleModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), DefaultLifecycleObserver {

  override fun getName(): String {
    return NAME
  }

  override fun initialize() {
    super.initialize()
    Handler(Looper.getMainLooper()).post {
      ProcessLifecycleOwner.get().lifecycle.addObserver(this)
    }
  }

  override fun onCatalystInstanceDestroy() {
    super.onCatalystInstanceDestroy()
    Handler(Looper.getMainLooper()).post {
      ProcessLifecycleOwner.get().lifecycle.removeObserver(this)
    }
  }

  override fun invalidate() {
    super.invalidate()
    Handler(Looper.getMainLooper()).post {
      ProcessLifecycleOwner.get().lifecycle.removeObserver(this)
    }
  }

  override fun onStart(owner: LifecycleOwner) {
    sendEvent("active")
  }

  override fun onPause(owner: LifecycleOwner) {
    sendEvent("inactive")
  }

  override fun onStop(owner: LifecycleOwner) {
    sendEvent("background")
  }

  private fun sendEvent(type: String) {
    if (reactApplicationContext == null) return
    val array: WritableArray = Arguments.createArray()
    array.pushString(type)
    reactApplicationContext.getJSModule(RCTDeviceEventEmitter::class.java)
      .emit("change", array)
  }

  companion object {
    const val NAME = "Lifecycle"
  }
}
