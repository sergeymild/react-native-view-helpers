import { type TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  setSystemUIColor(color: number, navColor: number): void;
  setStatusBarStyle(dark: boolean): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Sbnb');
