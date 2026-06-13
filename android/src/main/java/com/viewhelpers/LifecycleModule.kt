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
    safeEmit("active")
  }

  override fun onPause(owner: LifecycleOwner) {
    safeEmit("inactive")
  }

  override fun onStop(owner: LifecycleOwner) {
    safeEmit("background")
  }

  /**
   * ProcessLifecycleOwner can deliver callbacks before the JS event emitter is
   * wired (mEventEmitterCallback is still null) or after the React instance is
   * torn down. Emitting then throws an NPE inside the generated emitOnChange, so
   * guard on the emitter being ready and swallow teardown races (the original
   * RCTDeviceEventEmitter implementation no-op'd in the same situations).
   */
  private fun safeEmit(state: String) {
    if (mEventEmitterCallback == null) return
    try {
      emitOnChange(state)
    } catch (_: Exception) {
      // React instance went away between the null check and the emit.
    }
  }

  companion object {
    const val NAME = "Lifecycle"
  }
}
