package com.viewhelpers

import com.facebook.react.bridge.ReactApplicationContext

class ViewHelpersModule(reactContext: ReactApplicationContext) :
  NativeViewHelpersSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeViewHelpersSpec.NAME
  }
}
