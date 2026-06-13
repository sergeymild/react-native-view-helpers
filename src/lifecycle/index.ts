import { AppState, Platform } from 'react-native';
import Lifecycle from './NativeLifecycle';

export type AppLifecycleState = 'active' | 'inactive' | 'background';

export interface LifecycleSubscription {
  remove(): void;
}

function isTracked(
  states: AppLifecycleState[],
  next: string
): next is AppLifecycleState {
  return (states as string[]).includes(next);
}

export function subscribeOnAppLifecycle(
  states: AppLifecycleState[],
  callback: (state: AppLifecycleState) => void
): LifecycleSubscription {
  if (Platform.OS === 'ios') {
    return AppState.addEventListener('change', (next) => {
      if (isTracked(states, next)) callback(next);
    });
  }

  const sub = Lifecycle!.onChange((next: string) => {
    if (isTracked(states, next)) callback(next);
  });
  return { remove: () => sub.remove() };
}
