import { useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  alert,
  setStatusBarStyle,
  sheetAlert,
  StatusBar,
  subscribeOnAppLifecycle,
  viewHelpers,
} from 'react-native-view-helpers';
import type { BottomSheetAlertButton } from 'react-native-view-helpers';

export default function App() {
  const measuredViewRef = useRef<View>(null);

  useEffect(() => {
    const subscription = subscribeOnAppLifecycle(
      ['active', 'background'],
      (state) => console.log('[lifecycle]', state)
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
    console.log('[alert] pressed', id);
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
    console.log('[sheetAlert] pressed', id);
  };

  const onMeasureText = () => {
    const result = viewHelpers.measureText({
      text: 'The quick brown fox jumps over the lazy dog',
      fontSize: 16,
      maxWidth: 200,
    });
    console.log('[measureText]', result);
  };

  const onMeasureView = () => {
    const result = viewHelpers.measureView(measuredViewRef);
    console.log('[measureView]', result);
  };

  const onSetStatusBarStyle = () => {
    setStatusBarStyle(true);
    console.log('[setStatusBarStyle] dark');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>react-native-view-helpers smoke test</Text>

        <View ref={measuredViewRef} style={styles.measuredView}>
          <Text>Measured View target</Text>
        </View>

        <Button title="alert.alert(...)" onPress={onAlert} />
        <Button title="sheetAlert.show(...)" onPress={onSheetAlert} />
        <Button title="viewHelpers.measureText(...)" onPress={onMeasureText} />
        <Button title="viewHelpers.measureView(ref)" onPress={onMeasureView} />
        <Button title="setStatusBarStyle(true)" onPress={onSetStatusBarStyle} />
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
    gap: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  measuredView: {
    padding: 16,
    backgroundColor: '#eef',
    borderRadius: 8,
  },
  button: {
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
