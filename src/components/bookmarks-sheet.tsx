import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/app-background';
import { BLUE, DISABLED_GRAY, TEXT_PRIMARY } from '@/constants/colors';
import { NO_BOOKMARKS_TEXT } from '@/constants/copy';

type BookmarksSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function BookmarksSheet({ visible, onClose }: BookmarksSheetProps) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <AppBackground>
        <SafeAreaView style={styles.flex}>
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <Text style={styles.headerTitle}>Bookmarks</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          </View>

          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={40} color={DISABLED_GRAY} />
            <Text style={styles.emptyText}>{NO_BOOKMARKS_TEXT}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSpacer: {
    width: 50,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: TEXT_PRIMARY,
  },
  doneText: {
    fontSize: 17,
    fontWeight: '600',
    color: BLUE,
    width: 50,
    textAlign: 'right',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.4)',
  },
});
