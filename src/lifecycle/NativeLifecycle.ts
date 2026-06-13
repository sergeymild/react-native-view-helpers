import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  readonly onChange: EventEmitter<string>; // 'active' | 'inactive' | 'background'
}

// `get` (not `getEnforcing`): the native module exists only on Android.
export default TurboModuleRegistry.get<Spec>('Lifecycle');
