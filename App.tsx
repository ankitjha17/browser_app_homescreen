import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { ErrorBoundary } from '@/components/error-boundary';
import HomeScreen from '@/screens/home-screen';

SplashScreen.preventAutoHideAsync();

const globalAny = globalThis as unknown as {
  ErrorUtils?: {
    setGlobalHandler: (handler: (error: unknown, isFatal?: boolean) => void) => void;
    getGlobalHandler: () => (error: unknown, isFatal?: boolean) => void;
  };
};
if (globalAny.ErrorUtils) {
  const previousHandler = globalAny.ErrorUtils.getGlobalHandler();
  globalAny.ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('Unhandled error', { isFatal }, error);
    previousHandler?.(error, isFatal);
  });
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <AnimatedSplashOverlay />
          <HomeScreen />
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
