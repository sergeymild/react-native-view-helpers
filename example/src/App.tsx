import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  alert,
  navigationBarHeight,
  setStatusBarStyle,
  setSystemUIColor,
  sheetAlert,
  subscribeOnAppLifecycle,
  toggleFitsSystemWindows,
  viewHelpers,
} from 'react-native-view-helpers';
import type {
  BottomSheetAlertButton,
  MeasureTextResult,
  MeasureViewResult,
} from 'react-native-view-helpers';

const SCROLL_NATIVE_ID = 'demo-hscroll';
const BOXES = Array.from({ length: 12 }, (_, i) => i);

export default function App() {
  const measuredViewRef = useRef<View>(null);

  const [lastEvent, setLastEvent] = useState('—');
  const [textResult, setTextResult] = useState<MeasureTextResult | null>(null);
  const [viewResult, setViewResult] = useState<MeasureViewResult | null>(null);
  const [barStyle, setBarStyle] = useState<'dark-content' | 'light-content'>(
    'dark-content'
  );
  const [edgeToEdge, setEdgeToEdge] = useState(false);
  const [navHeight, setNavHeight] = useState<number | null>(null);

  useEffect(() => {
    const subscription = subscribeOnAppLifecycle(
      ['active', 'inactive', 'background'],
      (state) => setLastEvent(`lifecycle: ${state}`)
    );
    return () => subscription.remove();
  }, []);

  const onAlert = async () => {
    const id = await alert.alert({
      title: 'Hello',
      message: 'This is an alert',
      buttons: [
        { id: 'cancel', text: 'Cancel', style: 'cancel' },
        { id: 'ok', text: 'OK', style: 'default' },
      ],
    });
    setLastEvent(`alert pressed: ${id ?? 'dismissed'}`);
  };

  const onSheetAlert = async () => {
    const buttons: BottomSheetAlertButton[] = [
      { id: 'one', text: 'Option One', style: 'default' },
      { id: 'two', text: 'Option Two', style: 'destructive' },
      { id: 'cancel', text: 'Cancel', style: 'cancel' },
    ];
    const id = await sheetAlert.show({
      title: { text: 'Bottom Sheet' },
      message: { text: 'Pick an option' },
      buttons,
    });
    setLastEvent(`sheet pressed: ${id ?? 'dismissed'}`);
  };

  const onMeasureText = () => {
    const result = viewHelpers.measureText({
      text: 'The quick brown fox jumps over the lazy dog',
      fontSize: 16,
      maxWidth: 200,
    });
    setTextResult(result);
    setLastEvent('measured text');
  };

  const onMeasureView = () => {
    const result = viewHelpers.measureView(measuredViewRef);
    setViewResult(result);
    setLastEvent('measured view');
  };

  const onScrollToBox = (index: number) => {
    viewHelpers.scrollToChild({
      scrollNativeID: SCROLL_NATIVE_ID,
      childNativeID: `box-${index}`,
      offset: 16,
    });
    setLastEvent(`scrollToChild: box-${index}`);
  };

  const onScrollToEnd = () => {
    viewHelpers.scrollToChild({
      scrollNativeID: SCROLL_NATIVE_ID,
      childNativeID: `box-${BOXES.length - 1}`,
      scrollToEnd: true,
    });
    setLastEvent('scrollToChild: end');
  };

  const onToggleStatusBar = () => {
    const next = barStyle === 'dark-content' ? 'light-content' : 'dark-content';
    setBarStyle(next);
    setStatusBarStyle(next === 'dark-content');
    setLastEvent(`status bar style: ${next}`);
  };

  const onSetSystemColor = (status: string, nav: string, label: string) => {
    setSystemUIColor(status, nav);
    setLastEvent(`setSystemUIColor: ${label}`);
  };

  const onToggleEdgeToEdge = () => {
    const next = !edgeToEdge;
    setEdgeToEdge(next);
    toggleFitsSystemWindows(next);
    setLastEvent(`edge-to-edge: ${next ? 'on' : 'off'}`);
  };

  const onMeasureNavBar = () => {
    const h = navigationBarHeight();
    setNavHeight(h);
    setLastEvent(`navigationBarHeight: ${h}`);
  };

  const isLight = barStyle === 'light-content';
  const textColor = isLight && styles.lightText;

  return (
    <View
      style={[styles.container, { backgroundColor: isLight ? '#111' : '#fff' }]}
    >
      {/* NOTE: the declarative <StatusBar> component and the imperative
          setSystemUIColor/setStatusBarStyle helpers both drive the system bars,
          so mixing them fights (each re-render re-applies <StatusBar>'s color).
          This screen tests the imperative helpers, so it does not render
          <StatusBar>. Use one approach or the other in a real app. */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.heading, textColor]}>
          react-native-view-helpers smoke test
        </Text>
        <Text style={[styles.status, textColor]}>last: {lastEvent}</Text>

        {/* ---- Alerts ---- */}
        <Text style={[styles.section, textColor]}>Alerts</Text>
        <Button title="alert.alert(...)" onPress={onAlert} />
        <Button title="sheetAlert.show(...)" onPress={onSheetAlert} />

        {/* ---- View helpers: measure ---- */}
        <Text style={[styles.section, textColor]}>View helpers — measure</Text>
        <View ref={measuredViewRef} style={styles.measuredView}>
          <Text>Measured View target</Text>
        </View>
        <Button title="viewHelpers.measureText(...)" onPress={onMeasureText} />
        {textResult && (
          <Text style={[styles.result, textColor]}>
            text → w:{textResult.width.toFixed(1)} h:
            {textResult.height.toFixed(1)} lines:{textResult.lineCount}{' '}
            lastLine:
            {textResult.lastLineWidth.toFixed(1)}
          </Text>
        )}
        <Button title="viewHelpers.measureView(ref)" onPress={onMeasureView} />
        {viewResult && (
          <Text style={[styles.result, textColor]}>
            view → x:{viewResult.x.toFixed(1)} y:{viewResult.y.toFixed(1)} w:
            {viewResult.width.toFixed(1)} h:{viewResult.height.toFixed(1)}
          </Text>
        )}

        {/* ---- View helpers: scrollToChild ---- */}
        <Text style={[styles.section, textColor]}>
          View helpers — scrollToChild
        </Text>
        <ScrollView
          horizontal
          nativeID={SCROLL_NATIVE_ID}
          style={styles.hscroll}
          contentContainerStyle={styles.hscrollContent}
          showsHorizontalScrollIndicator={false}
        >
          {BOXES.map((i) => (
            <View key={i} nativeID={`box-${i}`} style={styles.box}>
              <Text style={styles.boxText}>{i}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.row}>
          <Button title="→ box 4" onPress={() => onScrollToBox(4)} />
          <Button title="→ box 8" onPress={() => onScrollToBox(8)} />
          <Button title="→ end" onPress={onScrollToEnd} />
        </View>

        {/* ---- Status bar / system UI ---- */}
        <Text style={[styles.section, textColor]}>Status bar / system UI</Text>
        <Button
          title={`toggle barStyle (${barStyle})`}
          onPress={onToggleStatusBar}
        />
        <View style={styles.row}>
          <Button
            title="bars: red"
            onPress={() => onSetSystemColor('#e11d48', '#e11d48', 'red')}
          />
          <Button
            title="bars: blue"
            onPress={() => onSetSystemColor('#2563eb', '#1e3a8a', 'blue')}
          />
          <Button
            title="bars: white"
            onPress={() => onSetSystemColor('#ffffff', '#ffffff', 'white')}
          />
        </View>
        <View style={styles.row}>
          <Button
            title={`edge-to-edge: ${edgeToEdge ? 'on' : 'off'}`}
            onPress={onToggleEdgeToEdge}
          />
          <Button title="nav bar height" onPress={onMeasureNavBar} />
        </View>
        {navHeight !== null && (
          <Text style={[styles.result, textColor]}>
            navigationBarHeight() → {navHeight} dp
          </Text>
        )}
        <Text style={[styles.note, textColor]}>
          {Platform.OS === 'ios'
            ? 'setSystemUIColor / setStatusBarStyle / navigationBarHeight / toggleFitsSystemWindows are Android-only (no-op / 0 on iOS); barStyle changes via the <StatusBar> component.'
            : 'setSystemUIColor tints the status & navigation bars; navigationBarHeight returns >0 only when edge-to-edge is on.'}
        </Text>
      </ScrollView>
    </View>
  );
}

function Button({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
  },
  status: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  result: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  note: {
    fontSize: 12,
    opacity: 0.7,
  },
  lightText: {
    color: 'white',
  },
  measuredView: {
    padding: 16,
    backgroundColor: '#eef',
    borderRadius: 8,
  },
  hscroll: {
    maxHeight: 80,
  },
  hscrollContent: {
    gap: 10,
    paddingVertical: 8,
  },
  box: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 14,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
});
