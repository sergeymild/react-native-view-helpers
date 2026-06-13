# react-native-view-helpers

Native alerts, JSI view measurement, status bar / system UI control, and app lifecycle subscriptions for React Native — combined into a single package.

> Requires React Native >= 0.80.1 with the New Architecture enabled.

This package merges four previously separate libraries (`react-native-alerts`, `react-native-jsi-view-helpers`, `react-native-lifecycle`, `react-native-sbnb`) behind one flat import. See the [Migration](#migration) section if you are coming from any of those.

## Installation

```sh
yarn add react-native-view-helpers
```

For iOS, install the pods:

```sh
npx pod-install
```

`@react-navigation/native` is **not** a dependency. You only need it if you use `StatusBar`'s `changeOnFocus` prop, in which case you install react-navigation yourself and pass its `useFocusEffect` into the component (see [Status Bar](#status-bar)).

## Usage

### Alerts

`alert` is an object exposing `alert`, `prompt`, and `dismissTopPresented`. `sheetAlert` is a class with a static `show` method. Both `alert.alert` / `alert.prompt` / `sheetAlert.show` return a `Promise`.

```ts
import { alert, sheetAlert } from 'react-native-view-helpers';
import type { BottomSheetAlertButton } from 'react-native-view-helpers';

// Simple alert — resolves with the pressed button id (or undefined)
const id = await alert.alert({
  title: 'Hello',
  message: 'This is an alert',
  buttons: [
    { id: 'cancel', text: 'Cancel', style: 'cancel' },
    { id: 'ok', text: 'OK', style: 'default' },
  ],
});

// Prompt with text fields — resolves with { id, values }
const { id: pressedId, values } = await alert.prompt({
  title: 'Sign in',
  buttons: [{ id: 'ok', text: 'OK', style: 'default' }],
  fields: [
    { id: 'email', placeholder: 'Email', keyboardType: 'email-address' },
    { id: 'password', placeholder: 'Password', security: true },
  ],
});

// Dismiss the topmost presented alert
alert.dismissTopPresented();

// Bottom sheet alert — resolves with the selected button id (or undefined if cancelled)
const buttons: BottomSheetAlertButton[] = [
  { id: 'one', text: 'Option One', style: 'default' },
  { id: 'two', text: 'Option Two', style: 'destructive' },
  { id: 'cancel', text: 'Cancel', style: 'cancel' },
];
const selected = await sheetAlert.show({
  title: { text: 'Bottom Sheet' },
  message: { text: 'Pick an option' },
  buttons,
});
```

### View Helpers

`viewHelpers` is a class with synchronous static methods backed by JSI.

```ts
import { viewHelpers } from 'react-native-view-helpers';
import type {
  MeasureParams,
  MeasureTextResult,
  MeasureViewResult,
} from 'react-native-view-helpers';

// Measure text -> { height, width, lineCount, lastLineWidth }
const text: MeasureTextResult = viewHelpers.measureText({
  text: 'The quick brown fox jumps over the lazy dog',
  fontSize: 16,
  maxWidth: 200,
  // optional: allowFontScaling, usePreciseWidth, fontFamily, weight
});

// Measure a view via a ref -> { x, y, width, height }
const layout: MeasureViewResult = viewHelpers.measureView(viewRef);

// Measure a view by its nativeID -> { x, y, width, height }
const byId = viewHelpers.measureViewByNativeId('my-native-id');

// Scroll a ScrollView so a child becomes visible
viewHelpers.scrollToChild({
  scrollViewRef, // or: scrollNativeID: 'my-scroll'
  childNativeID: 'target-child',
  offset: 0,        // optional
  scrollToEnd: false, // optional
});
```

### Status Bar

`StatusBar` is a render-null component that pushes onto a global props stack (last mounted wins). `setStatusBarStyle` and `setSystemUIColor` are imperative helpers.

```tsx
import { StatusBar } from 'react-native-view-helpers';

<StatusBar barStyle="dark-content" backgroundColor="white" />;
```

`StatusBarProps`:

| Prop | Type | Notes |
| --- | --- | --- |
| `backgroundColor` | `string` | Status bar background (Android). |
| `navBarColor` | `string` | Navigation bar color (Android). |
| `translucent` | `boolean` | Android translucent status bar. |
| `barStyle` | `'default' \| 'light-content' \| 'dark-content'` | |
| `changeOnFocus` | `boolean` | Re-apply these props when the screen regains focus. Requires `useFocusEffect`. |
| `useFocusEffect` | `(effect) => void` | react-navigation's `useFocusEffect`, passed in by you. |

To use `changeOnFocus`, install react-navigation in your app and pass its `useFocusEffect`:

```tsx
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'react-native-view-helpers';

<StatusBar
  changeOnFocus
  useFocusEffect={useFocusEffect}
  barStyle="light-content"
  backgroundColor="black"
/>;
```

Imperative helpers (both are **Android-only** and no-op on iOS):

```ts
import { setStatusBarStyle, setSystemUIColor } from 'react-native-view-helpers';

setStatusBarStyle(true); // true = dark icons (dark-content)
setSystemUIColor('#000000', '#101010'); // (statusBarColor, navBarColor)
```

### Lifecycle

Subscribe to app lifecycle changes. On Android these come from native events (TurboModule); on iOS they are derived from `AppState`.

```ts
import { subscribeOnAppLifecycle } from 'react-native-view-helpers';
import type {
  AppLifecycleState,
  LifecycleSubscription,
} from 'react-native-view-helpers';

const subscription: LifecycleSubscription = subscribeOnAppLifecycle(
  ['active', 'background'], // AppLifecycleState[]: 'active' | 'inactive' | 'background'
  (state) => console.log('[lifecycle]', state)
);

// later
subscription.remove();
```

## Migration

This package is a drop-in replacement for the four legacy libraries. Update your imports:

| Old package | Old import | New import |
| --- | --- | --- |
| react-native-alerts | `import { alert, sheetAlert } from 'react-native-alerts'` | `import { alert, sheetAlert } from 'react-native-view-helpers'` |
| react-native-jsi-view-helpers | `import { viewHelpers } from 'react-native-jsi-view-helpers'` | `import { viewHelpers } from 'react-native-view-helpers'` |
| react-native-lifecycle | `import { subscribeOnAppLifecycle } from 'react-native-lifecycle'` | `import { subscribeOnAppLifecycle } from 'react-native-view-helpers'` |
| react-native-sbnb | `import { StatusBar, setSystemUIColor, setStatusBarStyle } from 'react-native-sbnb'` | same names from `react-native-view-helpers` |

> **NOTE:** The only behavioral/API change is `StatusBar`'s `changeOnFocus`. Previously the component auto-required `@react-navigation/native`. Now the library no longer depends on react-navigation — to use `changeOnFocus` you must pass react-navigation's `useFocusEffect` via the new `useFocusEffect` prop. All other APIs are unchanged.

## License

MIT
