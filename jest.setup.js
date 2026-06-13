// Provide stubs for the native TurboModules so that importing modules which call
// `TurboModuleRegistry.getEnforcing(...)` at module-eval time does not throw in
// the test environment (no native runtime is available under Jest).
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => {
  const stub = new Proxy(
    {},
    {
      get: () => jest.fn(),
    }
  );
  return {
    get: () => stub,
    getEnforcing: () => stub,
  };
});
