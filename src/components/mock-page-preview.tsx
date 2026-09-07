import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import type { Tab } from '@/components/tab-switcher';
import { BLUE, BORDER_LIGHT, DISABLED_GRAY, DIVIDER, ICON_FAINT, ICON_MUTED, WHITE } from '@/constants/colors';

type MockPagePreviewProps = {
  tab: Tab;
  width: number;
  height: number;
};

const SKELETON_WIDTHS = ['62%', '46%', '54%'] as const;

export function MockPagePreview({ tab, width, height }: MockPagePreviewProps) {
  const heroSize = Math.round(width * 0.26);
  const brandColor = tab.siteBg && tab.siteBg !== 'transparent' ? tab.siteBg : BLUE;

  return (
    <View style={[styles.card, { width, height }]}>
      <View style={styles.chromeRow}>
        <Ionicons name="menu-outline" size={16} color={ICON_FAINT} />
        <View style={styles.chromeRight}>
          <Ionicons name="notifications-outline" size={15} color={ICON_MUTED} />
          <Ionicons name="apps-outline" size={15} color={ICON_MUTED} />
          <View style={[styles.chromeBadge, { backgroundColor: brandColor }]} />
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.hero}>
          {tab.siteIcon ? (
            tab.siteIcon(heroSize)
          ) : (
            <Ionicons name="compass-outline" size={heroSize} color="rgba(0,0,0,0.2)" />
          )}
        </View>

        <View style={styles.searchPill}>
          <Ionicons name="search" size={15} color={ICON_MUTED} />
          <View style={styles.searchPillIcons}>
            <Ionicons name="mic-outline" size={15} color={ICON_MUTED} />
            <Ionicons name="camera-outline" size={15} color={ICON_MUTED} />
          </View>
        </View>

        <View style={styles.skeletonList}>
          {SKELETON_WIDTHS.map((w, i) => (
            <View key={i} style={styles.skeletonRow}>
              <Ionicons name="trending-up-outline" size={13} color={DISABLED_GRAY} />
              <View style={[styles.skeletonBar, { width: w }]} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
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
    justifyContent: 'space-evenly',
    paddingBottom: 16,
  },
  chromeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
  },
  chromeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chromeBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 22,
    paddingBottom: 18,
  },
  searchPill: {
    marginHorizontal: 18,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  searchPillIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  skeletonList: {
    marginTop: 16,
    paddingHorizontal: 18,
    gap: 12,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skeletonBar: {
    height: 9,
    borderRadius: 4.5,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
});
