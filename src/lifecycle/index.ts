import { AppState, type AppStateStatus, Platform } from 'react-native';
import Lifecycle from './NativeLifecycle';

export type AppLifecycleState = 'active' | 'inactive' | 'background';

export interface LifecycleSubscription {
  remove(): void;
}

export function subscribeOnAppLifecycle(
  states: AppStateStatus[],
  callback: (state: AppStateStatus) => void
): LifecycleSubscription {
  if (Platform.OS === 'ios') {
    return AppState.addEventListener('change', (next) => {
      if (states.includes(next)) callback(next);
    });
  }

  const sub = Lifecycle!.onChange((next: string) => {
    if (states.includes(next as AppStateStatus)) {
      callback(next as AppStateStatus);
    }
  });
  return { remove: () => sub.remove() };
}
