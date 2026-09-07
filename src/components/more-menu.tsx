import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { BLUE, DIVIDER, TEXT_PRIMARY, WHITE } from '@/constants/colors';

export const MORE_MENU_CLOSE_DURATION = 160;

type MoreMenuProps = {
  visible: boolean;
  onClose: () => void;
  onNewTab: () => void;
  onNewPrivateTab: () => void;
  onBookmarks: () => void;
  onAllTabs: () => void;
  tabCount: number;
  bottomOffset: number;
};

export function MoreMenu({
  visible,
  onClose,
  onNewTab,
  onNewPrivateTab,
  onBookmarks,
  onAllTabs,
  tabCount,
  bottomOffset,
}: MoreMenuProps) {
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
    } else {
      const timeout = setTimeout(() => setMounted(false), MORE_MENU_CLOSE_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (!mounted) {
    return null;
  }

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
      <View style={[StyleSheet.absoluteFill, styles.backdrop]} pointerEvents={visible ? 'auto' : 'none'}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </View>
      <View
        style={[styles.anchor, { paddingBottom: bottomOffset }]}
        pointerEvents={visible ? 'box-none' : 'none'}>
        <View style={styles.card}>
          <MenuRow icon="add" label="New Tab" onPress={onNewTab} />
          <MenuRow icon="hand-left-outline" label="New Private Tab" onPress={onNewPrivateTab} />
          <View style={styles.divider} />
          <View style={styles.footerRow}>
            <FooterButton icon="book-outline" label="Bookmarks" onPress={onBookmarks} />
            <View style={styles.footerDivider} />
            <FooterButton icon="albums-outline" label="All Tabs" badge={tabCount} onPress={onAllTabs} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && styles.rowPressed]} onPress={onPress}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons name={icon} size={20} color={TEXT_PRIMARY} />
    </Pressable>
  );
}

function FooterButton({
  icon,
  label,
  badge,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: number;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.footerButton, pressed && styles.rowPressed]} onPress={onPress}>
      <View>
        <Ionicons name={icon} size={22} color={TEXT_PRIMARY} />
        {!!badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={styles.footerLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  anchor: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  card: {
    width: 240,
    backgroundColor: 'rgba(247,247,250,0.98)',
    borderRadius: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowPressed: {
    backgroundColor: DIVIDER,
  },
  rowLabel: {
    fontSize: 17,
    color: TEXT_PRIMARY,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginVertical: 2,
  },
  footerRow: {
    flexDirection: 'row',
  },
  footerDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginVertical: 8,
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
  },
  footerLabel: {
    fontSize: 12,
    color: TEXT_PRIMARY,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: WHITE,
  },
});
