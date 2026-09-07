import type { ReactNode } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

export function AppBackground({ children }: { children: ReactNode }) {
  return (
    <ImageBackground
      source={require('@/assets/images/home-background.png')}
      style={styles.flex}
      resizeMode="cover">
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
