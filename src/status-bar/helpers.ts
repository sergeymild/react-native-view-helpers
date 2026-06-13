import { type ColorValue, Platform, processColor } from 'react-native';

import Sbnb from './NativeSbnb';

export function setSystemUIColor(color: ColorValue, navColor: ColorValue) {
  if (Platform.OS === 'ios') return;
  return Sbnb.setSystemUIColor(
    processColor(color) as any,
    processColor(navColor) as any
  );
}

export function setStatusBarStyle(dark: boolean) {
  if (Platform.OS === 'ios') return;
  return Sbnb.setStatusBarStyle(dark);
}
