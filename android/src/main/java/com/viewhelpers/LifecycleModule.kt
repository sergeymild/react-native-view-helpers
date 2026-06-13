package com.viewhelpers

import android.os.Handler
import android.os.Looper
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ProcessLifecycleOwner
import com.facebook.react.bridge.ReactApplicationContext

class LifecycleModule(reactContext: ReactApplicationContext) :
  NativeLifecycleSpec(reactContext), DefaultLifecycleObserver {

  override fun getName(): String = NAME

  override fun initialize() {
    super.initialize()
    Handler(Looper.getMainLooper()).post {
      ProcessLifecycleOwner.get().lifecycle.addObserver(this)
    }
  }

  override fun invalidate() {
    super.invalidate()
    Handler(Looper.getMainLooper()).post {
      ProcessLifecycleOwner.get().lifecycle.removeObserver(this)
    }
  }

  override fun onStart(owner: LifecycleOwner) {
    emitOnChange("active")
  }

  override fun onPause(owner: LifecycleOwner) {
    emitOnChange("inactive")
  }

  override fun onStop(owner: LifecycleOwner) {
    emitOnChange("background")
  }

  companion object {
    const val NAME = "Lifecycle"
  }
}
