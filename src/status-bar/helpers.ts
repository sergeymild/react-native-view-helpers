import { type ColorValue, Platform, processColor } from 'react-native';

import Sbnb from './NativeSbnb';

/**
 * Set the status bar and navigation bar background colors. Android-only
 * (no-op on iOS).
 *
 * @deprecated Relies on `Window.setStatusBarColor` / `setNavigationBarColor`,
 * which Android 15+ (API 35) deprecated and ignores under the enforced
 * edge-to-edge mode (apps targeting SDK 35+). It only takes effect if the app
 * opts out of edge-to-edge enforcement
 * (`android:windowOptOutEdgeToEdgeEnforcement="true"`, removed for targetSdk
 * 36). Prefer driving colors through edge-to-edge layout / the `StatusBar`
 * component.
 */
export function setSystemUIColor(color: ColorValue, navColor: ColorValue) {
  if (Platform.OS === 'ios') return;
  return Sbnb.setSystemUIColor(
    processColor(color) as any,
    processColor(navColor) as any
  );
}

/**
 * Set the status bar icon style (dark/light). Android-only (no-op on iOS).
 *
 * @deprecated Prefer the `StatusBar` component's `barStyle` prop, which works
 * cross-platform. This native helper remains for backwards compatibility.
 */
export function setStatusBarStyle(dark: boolean) {
  if (Platform.OS === 'ios') return;
  return Sbnb.setStatusBarStyle(dark);
}

/**
 * Returns the navigation bar height in dp. Android-only (returns 0 on iOS).
 *
 * Returns 0 while the decor "fits system windows" (i.e. content is laid out
 * inside the system bars); when edge-to-edge is enabled via
 * {@link toggleFitsSystemWindows}, it returns the real navigation bar inset so
 * you can pad your content accordingly.
 */
export function navigationBarHeight(): number {
  if (Platform.OS === 'ios') return 0;
  return Sbnb.navigationBarHeight();
}

/**
 * Toggle whether the window content fits inside the system bars. Android-only
 * (no-op on iOS).
 *
 * @param isEnabled `true` draws content edge-to-edge (behind the system bars);
 * `false` keeps content inside the system bars.
 */
export function toggleFitsSystemWindows(isEnabled: boolean) {
  if (Platform.OS === 'ios') return;
  return Sbnb.toggleFitsSystemWindows(!isEnabled);
}
