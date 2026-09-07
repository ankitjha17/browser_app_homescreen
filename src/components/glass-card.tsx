import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { BORDER_LIGHT } from '@/constants/colors';

type GlassCardProps = {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export function GlassCard({ style, children }: GlassCardProps) {
  return (
    <View style={[styles.wrap, style]}>
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.tint} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    overflow: 'hidden',
  },
  tint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF4D',
  },
});
