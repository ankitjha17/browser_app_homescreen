import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import {
  BORDER_LIGHT,
  DIVIDER,
  GLASS_SURFACE,
  ICON_MUTED_STRONG,
  TEXT_PRIMARY,
  WHITE,
} from '@/constants/colors';
import { FAVORITES } from '@/constants/favorites-data';

type StartPagePreviewProps = {
  width: number;
  height: number;
};

export function StartPagePreview({ width, height }: StartPagePreviewProps) {
  const gutter = width * 0.045;
  const tileSize = (width - gutter * 2 - gutter * 3) / 4;

  return (
    <View style={[styles.card, { width, height }]}>
      <View style={styles.body}>
        <View>
          <View style={styles.headerRow}>
            <Ionicons name="star" size={11} color={ICON_MUTED_STRONG} />
            <Text style={styles.headerText}>Favorites</Text>
          </View>

          <View style={[styles.grid, { paddingHorizontal: gutter }]}>
            {FAVORITES.slice(0, 8).map((item) => (
              <View
                key={item.name}
                style={[
                  styles.tile,
                  {
                    width: tileSize,
                    height: tileSize,
                    backgroundColor: item.cardBg === 'transparent' ? WHITE : item.cardBg,
                  },
                ]}>
                {item.renderIcon(tileSize * item.iconScale)}
              </View>
            ))}
          </View>
        </View>

        <View>
          <Text style={styles.sectionText}>Privacy Report</Text>
          <View style={[styles.privacyRow, { marginHorizontal: gutter }]}>
            <Ionicons name="shield-half" size={12} color={TEXT_PRIMARY} />
            <Text style={styles.privacyText} numberOfLines={2}>
              In the last seven days, Safari has prevented 0 trackers from profiling you.
            </Text>
          </View>
        </View>

        <View style={styles.editButton}>
          <Text style={styles.editText}>Edit</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F4F6FA',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '600',
    color: ICON_MUTED_STRONG,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
    marginBottom: 12,
  },
  tile: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionText: {
    fontSize: 10,
    fontWeight: '600',
    color: ICON_MUTED_STRONG,
    marginBottom: 6,
    marginLeft: 12,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: GLASS_SURFACE,
    borderRadius: 10,
    padding: 8,
  },
  privacyText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 12,
    color: TEXT_PRIMARY,
  },
  editButton: {
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: DIVIDER,
  },
  editText: {
    fontSize: 10,
    fontWeight: '600',
    color: TEXT_PRIMARY,
  },
});
