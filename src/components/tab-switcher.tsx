import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState, type ReactNode } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/app-background';
import { MockPagePreview } from '@/components/mock-page-preview';
import { StartPagePreview } from '@/components/start-page-preview';
import {
  BLUE,
  GLASS_SURFACE_LIGHT,
  ICON_FAINT,
  PLACEHOLDER_GRAY,
  TEXT_PRIMARY,
  WHITE,
} from '@/constants/colors';
import { PRIVATE_BROWSING_DESCRIPTION, PRIVATE_BROWSING_TITLE } from '@/constants/copy';

export type Tab = {
  id: number;
  title: string;
  isPrivate: boolean;
  siteIcon?: (size: number) => ReactNode;
  siteBg?: string;
  url?: string;
};

type TabSwitcherProps = {
  visible: boolean;
  tabs: Tab[];
  onClose: () => void;
  onNewTab: (isPrivate: boolean) => void;
  onCloseTab: (id: number) => void;
  onSelectTab: (id: number) => void;
};

const OPEN_DURATION = 420;
export const TAB_SWITCHER_CLOSE_DURATION = 220;
const CLOSE_DURATION = TAB_SWITCHER_CLOSE_DURATION;
const GRID_PADDING = 20;
const GRID_GAP = 16;

const CARD_ASPECT = 1.3;

function PrivateBrowsingPlaceholder() {
  return (
    <View style={styles.privatePlaceholder}>
      <Ionicons name="hand-left-outline" size={56} color={PLACEHOLDER_GRAY} />
      <Text style={styles.privatePlaceholderTitle}>{PRIVATE_BROWSING_TITLE}</Text>
      <Text style={styles.privatePlaceholderText}>{PRIVATE_BROWSING_DESCRIPTION}</Text>
    </View>
  );
}

function TabPreview({ tab, width }: { tab: Tab; width: number }) {
  const height = width * CARD_ASPECT;
  if (tab.isPrivate) {
    return (
      <View style={[styles.privateCard, { width, height }]}>
        <Ionicons name="hand-left-outline" size={width * 0.3} color={WHITE} />
      </View>
    );
  }
  if (tab.siteIcon) {
    return <MockPagePreview tab={tab} width={width} height={height} />;
  }
  return <StartPagePreview width={width} height={height} />;
}

export function TabSwitcher({ visible, tabs, onClose, onNewTab, onCloseTab, onSelectTab }: TabSwitcherProps) {
  const [mounted, setMounted] = useState(visible);
  const [viewingPrivate, setViewingPrivate] = useState(false);
  const { width } = useWindowDimensions();

  const normalTabs = tabs.filter((t) => !t.isPrivate);
  const privateTabs = tabs.filter((t) => t.isPrivate);
  const visibleTabs = viewingPrivate ? privateTabs : normalTabs;
  const isSingleTabView = visibleTabs.length === 1;
  const cardWidth = isSingleTabView ? width - 80 : (width - GRID_PADDING * 2 - GRID_GAP) / 2;

  useEffect(() => {
    if (visible) {
      setMounted(true);
    } else {
      const timeout = setTimeout(() => setMounted(false), CLOSE_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (!mounted) {
    return null;
  }

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
      <AppBackground>
        <View style={StyleSheet.absoluteFill}>
          <View style={[StyleSheet.absoluteFill, styles.dim]} />
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.8 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        </View>

        <SafeAreaView style={styles.flex} pointerEvents={visible ? 'auto' : 'none'}>
          <View style={styles.header}>
            <Pressable style={styles.circleBtn} onPress={onClose} hitSlop={8}>
              <Ionicons name="ellipsis-horizontal" size={20} color={TEXT_PRIMARY} />
            </Pressable>
            <View style={styles.circleBtn}>
              <Ionicons name="search" size={20} color={TEXT_PRIMARY} />
            </View>
          </View>

          {viewingPrivate && privateTabs.length === 0 ? (
            <PrivateBrowsingPlaceholder />
          ) : (
            <FlatList
              key={isSingleTabView ? 'single' : 'grid'}
              data={visibleTabs}
              keyExtractor={(t) => String(t.id)}
              numColumns={isSingleTabView ? 1 : 2}
              contentContainerStyle={[styles.grid, isSingleTabView && styles.gridSingle]}
              columnWrapperStyle={!isSingleTabView ? styles.column : undefined}
              renderItem={({ item }) => (
                <View style={styles.cardWrap}>
                  <Pressable onPress={() => onSelectTab(item.id)}>
                    <TabPreview tab={item} width={cardWidth} />
                  </Pressable>
                  <Pressable style={styles.closeBadge} onPress={() => onCloseTab(item.id)} hitSlop={6}>
                    <Ionicons name="close" size={13} color="rgba(0,0,0,0.6)" />
                  </Pressable>
                  <View style={styles.cardLabelRow}>
                    {item.siteIcon ? (
                      item.siteIcon(14)
                    ) : (
                      <Ionicons
                        name={item.isPrivate ? 'hand-left-outline' : 'star'}
                        size={13}
                        color={ICON_FAINT}
                      />
                    )}
                    <Text style={styles.cardLabelText} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>
                </View>
              )}
            />
          )}

          <View style={styles.footer}>
            <Pressable style={styles.newTabButton} onPress={() => onNewTab(viewingPrivate)} hitSlop={8}>
              <Ionicons name="add" size={28} color={TEXT_PRIMARY} />
            </Pressable>
            <View style={styles.segmentedTrack}>
              <Pressable
                style={viewingPrivate ? styles.segmentActive : styles.segmentInactive}
                onPress={() => setViewingPrivate(true)}
                hitSlop={4}>
                <Text style={viewingPrivate ? styles.segmentActiveText : styles.segmentInactiveText}>
                  Private
                </Text>
              </Pressable>
              <Pressable
                style={viewingPrivate ? styles.segmentInactive : styles.segmentActive}
                onPress={() => setViewingPrivate(false)}
                hitSlop={4}>
                <Text style={viewingPrivate ? styles.segmentInactiveText : styles.segmentActiveText}>
                  {normalTabs.length} {normalTabs.length === 1 ? 'Tab' : 'Tabs'}
                </Text>
              </Pressable>
            </View>
            <Pressable style={styles.doneCircleButton} onPress={onClose} hitSlop={8}>
              <Ionicons name="checkmark" size={20} color={WHITE} />
            </Pressable>
          </View>
        </SafeAreaView>
      </AppBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  dim: {
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  grid: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: 16,
    paddingBottom: 16,
    gap: GRID_GAP,
  },
  gridSingle: {
    alignItems: 'center',
  },
  column: {
    gap: GRID_GAP,
  },
  cardWrap: {
    position: 'relative',
  },
  closeBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  cardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  cardLabelText: {
    fontSize: 13,
    color: TEXT_PRIMARY,
    maxWidth: '85%',
  },
  privateCard: {
    borderRadius: 20,
    backgroundColor: TEXT_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privatePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 14,
  },
  privatePlaceholderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(60,60,67,0.75)',
  },
  privatePlaceholderText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: 'rgba(60,60,67,0.55)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  newTabButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GLASS_SURFACE_LIGHT,
  },
  segmentedTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(120,120,128,0.16)',
    borderRadius: 18,
    padding: 3,
  },
  segmentInactive: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  segmentInactiveText: {
    fontSize: 14,
    fontWeight: '500',
    color: PLACEHOLDER_GRAY,
  },
  segmentActive: {
    backgroundColor: WHITE,
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  segmentActiveText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY,
  },
  doneCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BLUE,
  },
});
