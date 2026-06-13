# react-native-view-helpers

Native **alerts & bottom sheets**, **synchronous view/text measurement & programmatic scrolling**, **status bar / system UI control**, and **app lifecycle subscriptions** for React Native — combined into a single, New-Architecture-only package.

> **Requirements:** React Native **≥ 0.80.1** with the **New Architecture** enabled (TurboModules). The old (Paper) architecture is not supported.

This package merges four previously separate libraries behind one flat import:

| Was | Now |
| --- | --- |
| `react-native-alerts` | `react-native-view-helpers` |
| `react-native-jsi-view-helpers` | `react-native-view-helpers` |
| `react-native-lifecycle` | `react-native-view-helpers` |
| `react-native-sbnb` | `react-native-view-helpers` |

See [Migration](#migration) if you are coming from any of those.

---

## Table of contents

- [Installation](#installation)
- [Feature overview](#feature-overview)
- [Platform support](#platform-support)
- [Alerts](#alerts)
  - [`alert.alert`](#alertalert)
  - [`alert.prompt`](#alertprompt)
  - [`alert.dismissTopPresented`](#alertdismisstoppresented)
  - [`sheetAlert.show`](#sheetalertshow)
- [View helpers](#view-helpers)
  - [`viewHelpers.measureText`](#viewhelpersmeasuretext)
  - [`viewHelpers.measureView`](#viewhelpersmeasureview)
  - [`viewHelpers.measureViewByNativeId`](#viewhelpersmeasureviewbynativeid)
  - [`viewHelpers.scrollToChild`](#viewhelpersscrolltochild)
- [Status bar & system UI](#status-bar--system-ui)
  - [`StatusBar` component](#statusbar-component)
  - [`setSystemUIColor`](#setsystemuicolor)
  - [`setStatusBarStyle`](#setstatusbarstyle)
  - [Android 15+ edge-to-edge](#android-15-edge-to-edge)
- [App lifecycle](#app-lifecycle)
  - [`subscribeOnAppLifecycle`](#subscribeonapplifecycle)
- [Migration](#migration)
- [License](#license)

---

## Installation

```sh
yarn add react-native-view-helpers
# or
npm install react-native-view-helpers
```

iOS — install pods:

```sh
cd ios && pod install
# or, from the project root:
npx pod-install
```

Android requires no manual steps — the module is autolinked.

There are **no required peer dependencies** beyond `react` / `react-native`. `@react-navigation/native` is only needed if you use the `StatusBar` component's `changeOnFocus`, and you wire it in yourself (see [`StatusBar`](#statusbar-component)).

---

## Feature overview

```ts
import {
  // Alerts
  alert,
  sheetAlert,
  // View helpers
  viewHelpers,
  // Status bar / system UI
  StatusBar,
  setSystemUIColor,
  setStatusBarStyle,
  // App lifecycle
  subscribeOnAppLifecycle,
} from 'react-native-view-helpers';
```

- **Alerts** — native OS alert dialogs, text-input prompts, and themeable bottom-sheet action lists.
- **View helpers** — measure rendered text and views synchronously (no async round-trip), and scroll a `ScrollView` to a specific child.
- **Status bar / system UI** — a declarative `StatusBar` component plus imperative helpers to tint the status/navigation bars and switch icon style.
- **App lifecycle** — subscribe to foreground/background/inactive transitions.

---

## Platform support

| Feature | iOS | Android |
| --- | :---: | :---: |
| `alert.alert` / `alert.prompt` / `alert.dismissTopPresented` | ✅ | ✅ |
| `sheetAlert.show` | ✅ | ✅ |
| `viewHelpers.measureText` / `measureView` / `measureViewByNativeId` | ✅ | ✅ |
| `viewHelpers.scrollToChild` | ✅ | ✅ |
| `StatusBar` — `barStyle` | ✅ | ✅ |
| `StatusBar` — `backgroundColor` / `navBarColor` / `translucent` | — | ✅ |
| `setSystemUIColor` | — | ✅ |
| `setStatusBarStyle` | — | ✅ |
| `subscribeOnAppLifecycle` | ✅ (via `AppState`) | ✅ (native) |

> iOS has no system navigation bar, and its status-bar background color is not directly settable; use `StatusBar`'s `barStyle` for icon appearance on iOS.

---

## Alerts

```ts
import { alert, sheetAlert } from 'react-native-view-helpers';
import type {
  BottomSheetAlertButton,
  BottomSheetAlertButtonStyle,
} from 'react-native-view-helpers';
```

### `alert.alert`

Presents a native alert dialog. Resolves with the `id` of the pressed button (or `undefined` if dismissed).

```ts
alert.alert(params: {
  title?: string;
  message?: string;
  buttons?: Array<{
    id: string;
    text: string;
    style: 'default' | 'destructive' | 'cancel';
  }>;
  theme?: 'dark' | 'light' | 'system';
}): Promise<string | undefined>
```

```ts
const pressed = await alert.alert({
  title: 'Delete file?',
  message: 'This cannot be undone.',
  buttons: [
    { id: 'cancel', text: 'Cancel', style: 'cancel' },
    { id: 'delete', text: 'Delete', style: 'destructive' },
  ],
});

if (pressed === 'delete') {
  // ...
}
```

If `buttons` is omitted or empty, a single default `Ok` button (id `ok`) is shown.

### `alert.prompt`

Presents an alert with one or more text input fields. Resolves with the pressed button `id` and a map of field `id` → entered value.

```ts
alert.prompt(params: {
  title?: string;
  message?: string;
  buttons: Array<{ id: string; text: string; style: 'default' | 'destructive' | 'cancel' }>;
  fields: Array<{
    id: string;
    placeholder: string;
    defaultValue?: string;
    keyboardType?: KeyboardType;     // react-native KeyboardType
    security?: boolean;              // secure text entry (passwords)
  }>;
  theme?: 'dark' | 'light' | 'system';
}): Promise<{ id: string; values: Record<string, string> | undefined }>
```

```ts
const { id, values } = await alert.prompt({
  title: 'Sign in',
  buttons: [
    { id: 'cancel', text: 'Cancel', style: 'cancel' },
    { id: 'ok', text: 'OK', style: 'default' },
  ],
  fields: [
    { id: 'email', placeholder: 'Email', keyboardType: 'email-address' },
    { id: 'password', placeholder: 'Password', security: true },
  ],
});

if (id === 'ok') {
  console.log(values?.email, values?.password);
}
```

### `alert.dismissTopPresented`

Programmatically dismisses the top-most presented alert.

```ts
alert.dismissTopPresented(): void
```

### `sheetAlert.show`

Presents a themeable bottom-sheet action list. Resolves with the selected button's `id` (or `undefined` if cancelled / dismissed).

```ts
sheetAlert.show(properties: {
  title?: { text: string; appearance?: Appearance };
  message?: { text: string; appearance?: Appearance };
  buttons: BottomSheetAlertButton[];
  theme?: 'light' | 'dark';
  iosTintColor?: string;                 // any RN color string
  buttonsBorderRadius?: number;
  cancelButtonBorderRadius?: number;
}): Promise<string | undefined>
```

Types:

```ts
type BottomSheetAlertButtonStyle = 'default' | 'destructive' | 'cancel';

type Appearance = {
  textAlign?: 'center' | 'left';
  fontSize?: number;
  color?: string;          // any RN color string
  fontFamily?: string;
};

type ButtonIcon =
  | { type: 'asset'; icon: string }                  // native asset name
  | { type: 'drawable'; icon: string }               // android drawable name
  | { type: 'require'; icon: ImageRequireSource };    // require('./icon.png')

interface BottomSheetAlertButton {
  text: string;
  style?: BottomSheetAlertButtonStyle;
  id?: any;                 // returned by show() when selected
  icon?: ButtonIcon;
  appearance?: Appearance;
}
```

```ts
const choice = await sheetAlert.show({
  title: { text: 'Share', appearance: { fontSize: 18 } },
  message: { text: 'Choose a destination' },
  theme: 'light',
  buttons: [
    { id: 'copy', text: 'Copy link', icon: { type: 'require', icon: require('./link.png') } },
    { id: 'more', text: 'More…' },
    { id: 'cancel', text: 'Cancel', style: 'cancel' },
  ],
});
```

---

## View helpers

Synchronous (JSI/TurboModule) measurement and scrolling — results are returned directly, with no Promise/bridge round-trip.

```ts
import { viewHelpers } from 'react-native-view-helpers';
import type {
  MeasureParams,
  MeasureTextResult,
  MeasureViewResult,
} from 'react-native-view-helpers';
```

### `viewHelpers.measureText`

Measures how text will lay out for the given constraints.

```ts
viewHelpers.measureText(params: {
  text: string;
  fontSize: number;
  maxWidth: number;
  allowFontScaling?: boolean;   // default true
  usePreciseWidth?: boolean;    // default false
  fontFamily?: string;
  weight?: 'bold' | '100' | '200' | '300' | '400'
         | '500' | '600' | '700' | '800' | '900';
}): {
  width: number;
  height: number;
  lineCount: number;
  lastLineWidth: number;
}
```

```ts
const { height, lineCount } = viewHelpers.measureText({
  text: 'The quick brown fox',
  fontSize: 16,
  maxWidth: 240,
});
```

### `viewHelpers.measureView`

Measures an on-screen view from a ref. Returns zeros if the ref is not yet attached.

```ts
viewHelpers.measureView(ref: React.RefObject<any>): {
  x: number; y: number; width: number; height: number;
}
```

```ts
const boxRef = useRef<View>(null);
// ...
const { width, height, x, y } = viewHelpers.measureView(boxRef);
```

### `viewHelpers.measureViewByNativeId`

Measures an on-screen view located by its `nativeID` prop.

```ts
viewHelpers.measureViewByNativeId(nativeID: string): {
  x: number; y: number; width: number; height: number;
}
```

```tsx
<View nativeID="header" />;
// ...
const rect = viewHelpers.measureViewByNativeId('header');
```

### `viewHelpers.scrollToChild`

Scrolls a `ScrollView` so that a given child becomes visible. The scroll view can be addressed either by its `nativeID` or by a ref, and the child by its `nativeID`.

```ts
viewHelpers.scrollToChild(params:
  | {
      scrollNativeID: string;     // ScrollView's nativeID
      childNativeID: string;      // child's nativeID
      offset?: number;            // extra offset, default 0
      scrollToEnd?: boolean;      // default false
    }
  | {
      scrollViewRef: React.RefObject<ScrollView | null>;
      childNativeID: string;
      offset?: number;
      scrollToEnd?: boolean;
    }
): void
```

```tsx
<ScrollView nativeID="list" horizontal>
  {items.map((it) => (
    <View key={it.id} nativeID={`item-${it.id}`} />
  ))}
</ScrollView>;

// later:
viewHelpers.scrollToChild({
  scrollNativeID: 'list',
  childNativeID: 'item-42',
  offset: 16,
});
```

---

## Status bar & system UI

Two complementary APIs:

- the **declarative** [`StatusBar`](#statusbar-component) component (recommended), and
- the **imperative** [`setSystemUIColor`](#setsystemuicolor) / [`setStatusBarStyle`](#setstatusbarstyle) helpers.

> **Do not mix the two for the same property.** The `StatusBar` component re-applies its declared colors on every render, which will override imperative calls. Pick one approach per app.

```ts
import {
  StatusBar,
  setSystemUIColor,
  setStatusBarStyle,
} from 'react-native-view-helpers';
import type { StatusBarProps } from 'react-native-view-helpers';
```

### `StatusBar` component

A declarative component that pushes/pops onto an internal stack, so the most recently mounted `StatusBar` wins (similar to React Native's own `StatusBar`). Renders nothing.

```ts
interface StatusBarProps {
  backgroundColor?: string;     // Android status-bar background
  navBarColor?: string;         // Android navigation-bar background
  translucent?: boolean;        // Android
  barStyle?: 'default' | 'light-content' | 'dark-content';
  changeOnFocus?: boolean;      // re-apply when the screen regains focus
  /**
   * Pass react-navigation's `useFocusEffect` to enable `changeOnFocus`.
   * The library itself does NOT depend on @react-navigation/native.
   */
  useFocusEffect?: (effect: () => void | (() => void)) => void;
}
```

```tsx
function Screen() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#111" navBarColor="#111" />
      {/* ...screen content... */}
    </>
  );
}
```

**`changeOnFocus` with react-navigation** — install `@react-navigation/native` yourself and inject its hook:

```tsx
import { useFocusEffect } from '@react-navigation/native';

<StatusBar
  changeOnFocus
  useFocusEffect={useFocusEffect}
  barStyle="dark-content"
  backgroundColor="#fff"
/>;
```

### `setSystemUIColor`

> **Android only** (no-op on iOS). **Deprecated** — see [Android 15+ edge-to-edge](#android-15-edge-to-edge).

Imperatively sets the status bar and navigation bar background colors.

```ts
setSystemUIColor(color: ColorValue, navColor: ColorValue): void
```

```ts
setSystemUIColor('#e11d48', '#1e3a8a'); // status bar red, nav bar blue
```

### `setStatusBarStyle`

> **Android only** (no-op on iOS). **Deprecated** — prefer the `StatusBar` component's `barStyle`.

Sets the status-bar icon style: `true` = dark icons (for light backgrounds), `false` = light icons.

```ts
setStatusBarStyle(dark: boolean): void
```

### Android 15+ edge-to-edge

Starting with **Android 15 (API 35)**, apps targeting SDK 35+ run in enforced **edge-to-edge** mode, where `Window.setStatusBarColor` / `setNavigationBarColor` (which `setSystemUIColor` wraps) are **deprecated and ignored**. As a result:

- On **targetSdk 35**, you can opt out by adding the following to your app theme, which restores the legacy color behavior:

  ```xml
  <!-- android/app/src/main/res/values/styles.xml -->
  <item name="android:windowOptOutEdgeToEdgeEnforcement">true</item>
  ```

- On **targetSdk 36+**, this opt-out is removed and the legacy color APIs no longer take effect at all. For colored system bars under edge-to-edge you must draw content/backgrounds behind the (transparent) bars yourself using window insets.

This is why `setSystemUIColor` / `setStatusBarStyle` are marked `@deprecated`. The declarative `StatusBar` `barStyle` (icon appearance) continues to work via `WindowInsetsController`.

---

## App lifecycle

```ts
import { subscribeOnAppLifecycle } from 'react-native-view-helpers';
import type {
  AppLifecycleState,
  LifecycleSubscription,
} from 'react-native-view-helpers';
```

### `subscribeOnAppLifecycle`

Subscribes to app foreground/background transitions, filtered to the states you care about. On Android the events come from a native `ProcessLifecycleOwner`-backed TurboModule; on iOS they come from React Native's `AppState`.

```ts
type AppLifecycleState = 'active' | 'inactive' | 'background';

interface LifecycleSubscription {
  remove(): void;
}

subscribeOnAppLifecycle(
  states: AppLifecycleState[],
  callback: (state: AppLifecycleState) => void
): LifecycleSubscription
```

```ts
useEffect(() => {
  const sub = subscribeOnAppLifecycle(['active', 'background'], (state) => {
    if (state === 'background') saveDraft();
    if (state === 'active') refresh();
  });
  return () => sub.remove();
}, []);
```

> `'inactive'` is delivered on Android (`onPause`). On iOS only the states emitted by `AppState` (`active` / `background` / `inactive`) are forwarded.

---

## Migration

All four source packages are re-exported under the same names, so most migrations are a one-line import change:

| Old package | Old import | New import |
| --- | --- | --- |
| `react-native-alerts` | `import { alert, sheetAlert } from 'react-native-alerts'` | `import { alert, sheetAlert } from 'react-native-view-helpers'` |
| `react-native-jsi-view-helpers` | `import { viewHelpers } from 'react-native-jsi-view-helpers'` | `import { viewHelpers } from 'react-native-view-helpers'` |
| `react-native-lifecycle` | `import { subscribeOnAppLifecycle } from 'react-native-lifecycle'` | `import { subscribeOnAppLifecycle } from 'react-native-view-helpers'` |
| `react-native-sbnb` | `import { StatusBar, setSystemUIColor, setStatusBarStyle } from 'react-native-sbnb'` | same names from `react-native-view-helpers` |

**Behavioral changes to note:**

- **`StatusBar` `changeOnFocus`** no longer auto-`require`s `@react-navigation/native`. Pass its `useFocusEffect` explicitly via the `useFocusEffect` prop (see [`StatusBar`](#statusbar-component)). This keeps the library usable without react-navigation installed.
- **`setSystemUIColor` / `setStatusBarStyle`** are now marked `@deprecated` and subject to the [Android 15+ edge-to-edge](#android-15-edge-to-edge) behavior change.
- **New Architecture only.** Ensure the New Architecture is enabled (default on RN 0.80.1+).

---

## License

MIT
