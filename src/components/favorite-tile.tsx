import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BLACK } from '@/constants/colors';
import type { FavoriteItem } from '@/constants/favorites-data';

export function FavoriteTile({
  item,
  size,
  onPress,
}: {
  item: FavoriteItem;
  size: number;
  onPress?: () => void;
}) {
  const iconSize = size * item.iconScale;

  return (
    <Pressable style={{ width: size, alignItems: 'center' }} onPress={onPress} hitSlop={6}>
      <View
        style={[
          !item.fullBleed && styles.card,
          {
            width: size,
            height: size,
            backgroundColor: item.cardBg,
          },
        ]}>
        {item.renderIcon(iconSize)}
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {item.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E6',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  label: {
    marginTop: 8,
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 24.15,
    letterSpacing: 0,
    color: BLACK,
  },
});
