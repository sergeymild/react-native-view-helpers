package com.viewhelpers

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class ViewHelpersPackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
    when (name) {
      AlertsModule.NAME -> AlertsModule(reactContext)
      JsiViewHelpersModule.NAME -> JsiViewHelpersModule(reactContext)
      SbnbModule.NAME -> SbnbModule(reactContext)
      LifecycleModule.NAME -> LifecycleModule(reactContext)
      else -> null
    }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    fun info(name: String) = ReactModuleInfo(
      name, name,
      false, // canOverrideExistingModule
      false, // needsEagerInit
      false, // isCxxModule
      true   // isTurboModule
    )
    listOf(
      AlertsModule.NAME,
      JsiViewHelpersModule.NAME,
      SbnbModule.NAME,
      LifecycleModule.NAME,
    ).associateWith { info(it) }
  }
}
