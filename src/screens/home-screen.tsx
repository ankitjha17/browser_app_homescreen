import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import { runOnJS } from 'react-native-worklets';

import { AppBackground } from '@/components/app-background';
import { BookmarksSheet } from '@/components/bookmarks-sheet';
import { FavoriteTile } from '@/components/favorite-tile';
import { GlassCard } from '@/components/glass-card';
import { MoreMenu, MORE_MENU_CLOSE_DURATION } from '@/components/more-menu';
import { Tab, TabSwitcher, TAB_SWITCHER_CLOSE_DURATION } from '@/components/tab-switcher';
import {
  BLUE,
  BLACK as TEXT_DARK,
  GLASS_SURFACE_LIGHT as CARD_BG,
  GLASS_SURFACE,
  GLASS_SURFACE_STRONG,
  BORDER_LIGHT,
  PLACEHOLDER_GRAY,
  DISABLED_GRAY,
  DIVIDER,
} from '@/constants/colors';
import { PRIVACY_TEXT, SEARCH_PLACEHOLDER } from '@/constants/copy';
import { FAVORITES, type FavoriteItem } from '@/constants/favorites-data';

// Figma frame is 390pt wide, exported at 4x (1560px). All spacing below is
// measured off the export and divided by 4 to get real point values.
const GUTTER = 18;
const ROW_GAP = 14;
const HEADER_TO_CONTENT = 14;
const CONTENT_TO_HEADER = 24;

function formatDisplayUrl(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
}

let nextTabId = 2;

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const tileSize = (width - GUTTER * 5) / 4;

  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  const [tabSwitcherVisible, setTabSwitcherVisible] = useState(false);
  const [bookmarksVisible, setBookmarksVisible] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, title: 'Start Page', isPrivate: false }]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [measuredToolbarHeight, setMeasuredToolbarHeight] = useState(0);

  const webViewRef = useRef<WebView>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [progressVisible, setProgressVisible] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const progressHideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (progressHideTimeout.current) clearTimeout(progressHideTimeout.current);
    };
  }, []);

  useEffect(() => {
    setCanGoBack(false);
  }, [activeTabId]);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const showingWebView = Boolean(activeTab.url);

  const addTab = (isPrivate: boolean, title?: string, site?: FavoriteItem) => {
    const id = nextTabId++;
    setTabs((prev) => [
      ...prev,
      {
        id,
        title: title ?? (isPrivate ? 'Private Tab' : 'New Tab'),
        isPrivate,
        siteIcon: site?.renderIcon,
        siteBg: site?.cardBg,
        url: site?.url,
      },
    ]);
    setActiveTabId(id);
  };

  const openFavorite = (item: FavoriteItem) => {
    addTab(false, item.name, item);
  };

  const closeTab = (id: number) => {
    if (tabs.length <= 1) return;
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      setActiveTabId(remaining[remaining.length - 1].id);
    }
  };

  const cancelSearch = () => {
    setQuery('');
    inputRef.current?.blur();
    setSearchFocused(false);
  };

  const handleLoadStart = () => {
    if (progressHideTimeout.current) clearTimeout(progressHideTimeout.current);
    setProgressVisible(true);
    setLoadProgress(0.08);
  };

  const handleLoadEnd = () => {
    setLoadProgress(1);
    progressHideTimeout.current = setTimeout(() => setProgressVisible(false), 300);
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
  };

  const goToStartPage = () => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, url: undefined, siteIcon: undefined, siteBg: undefined, title: 'Start Page' }
          : t
      )
    );
    setQuery('');
  };

  const handleBackPress = () => {
    if (canGoBack) {
      webViewRef.current?.goBack();
    } else if (showingWebView) {
      goToStartPage();
    }
  };

  const anyModalOpen = moreMenuVisible || tabSwitcherVisible || bookmarksVisible;

  const swipeUpToTabsGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!anyModalOpen)
        .minDistance(1)
        .onEnd((e) => {
          if (e.translationY < -15 || e.velocityY < -200) {
            runOnJS(setTabSwitcherVisible)(true);
          }
        }),
    [anyModalOpen]
  );

  const toolbarHeight =
    44 + 10 + Math.max(insets.bottom, 12) + 12 + (Platform.OS === 'android' ? 10 : 0);

  const focusProgress = useSharedValue(0);
  useEffect(() => {
    focusProgress.value = withTiming(searchFocused ? 1 : 0, { duration: 220 });
  }, [searchFocused, focusProgress]);

  const backButtonStyle = useAnimatedStyle(() => ({
    width: 44 * (1 - focusProgress.value),
    marginRight: 10 * (1 - focusProgress.value),
    opacity: 1 - focusProgress.value,
    transform: [{ scale: 0.7 + 0.3 * (1 - focusProgress.value) }],
  }));
  const moreIconStyle = useAnimatedStyle(() => ({ opacity: 1 - focusProgress.value }));
  const closeIconStyle = useAnimatedStyle(() => ({ opacity: focusProgress.value }));

  const searchBarContent = (
    <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
      <Ionicons name="search" size={22} color={TEXT_DARK} />
      <TextInput
        ref={inputRef}
        value={searchFocused ? query : showingWebView ? formatDisplayUrl(activeTab.url!) : query}
        onChangeText={setQuery}
        onFocus={() => {
          setSearchFocused(true);
          if (activeTab.url) setQuery(activeTab.url);
        }}
        onBlur={() => setSearchFocused(false)}
        placeholder={SEARCH_PLACEHOLDER}
        placeholderTextColor={PLACEHOLDER_GRAY}
        selectionColor={BLUE}
        style={styles.searchInput}
        returnKeyType="go"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Pressable onPress={() => webViewRef.current?.reload()} hitSlop={8}>
        <Ionicons name="refresh" size={23} color={TEXT_DARK} />
      </Pressable>
      {progressVisible ? (
        <View style={styles.progressTrack} pointerEvents="none">
          <View style={[styles.progressFill, { width: `${Math.round(loadProgress * 100)}%` }]} />
        </View>
      ) : null}
    </View>
  );

  return (
    <AppBackground>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {showingWebView ? (
            <WebView
              key={activeTab.id}
              ref={webViewRef}
              source={{ uri: activeTab.url! }}
              style={styles.flex}
              onLoadStart={handleLoadStart}
              onLoadProgress={({ nativeEvent }) => setLoadProgress(nativeEvent.progress)}
              onLoadEnd={handleLoadEnd}
              onNavigationStateChange={handleNavigationStateChange}
            />
          ) : (
            <ScrollView
              style={styles.flex}
              contentContainerStyle={[
                styles.scrollContent,
                {
                  paddingHorizontal: GUTTER,
                  paddingBottom:
                    Platform.OS === 'android' ? (measuredToolbarHeight || toolbarHeight) + 12 : 0,
                },
              ]}
              showsVerticalScrollIndicator={false}>
              <Text style={[styles.sectionTitle, styles.firstSectionTitle]}>Favorites</Text>
              <View style={styles.grid}>
                {FAVORITES.map((item, index) => (
                  <View
                    key={item.name}
                    style={{ width: tileSize, marginBottom: index < 4 ? ROW_GAP : 0 }}>
                    <FavoriteTile item={item} size={tileSize} onPress={() => openFavorite(item)} />
                  </View>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Privacy Reports</Text>
              <GlassCard style={styles.card}>
                <View style={styles.shieldWrap}>
                  <Ionicons name="shield-half" size={21} color={TEXT_DARK} />
                  <Text style={styles.shieldNumber}>4</Text>
                </View>
                <Text style={styles.cardText}>{PRIVACY_TEXT}</Text>
              </GlassCard>

              <View style={styles.rowHeader}>
                <Text style={[styles.sectionTitle, styles.inlineSectionTitle]}>Reading List</Text>
                <Pressable hitSlop={8}>
                  <Text style={styles.linkText}>Clear All</Text>
                </Pressable>
              </View>
              <GlassCard style={styles.card}>
                <Text style={[styles.cardText, styles.cardTextFull]}>{PRIVACY_TEXT}</Text>
              </GlassCard>

              <View style={styles.rowHeader}>
                <Text style={[styles.sectionTitle, styles.inlineSectionTitle]}>URL to download</Text>
                <Pressable hitSlop={8}>
                  <Text style={styles.linkText}>View</Text>
                </Pressable>
              </View>
              <Pressable>
                <GlassCard style={styles.downloadCard}>
                  <Text style={styles.downloadText}>Go to universal downlaod</Text>
                  <Ionicons name="chevron-forward" size={24} color={TEXT_DARK} />
                </GlassCard>
              </Pressable>

              <View style={styles.editWrap}>
                <Pressable style={styles.editButton}>
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>
              </View>
            </ScrollView>
          )}

          <View
            style={[
              styles.toolbar,
              Platform.OS === 'android' && styles.toolbarAndroidFixed,
              {
                paddingBottom:
                  Math.max(insets.bottom, 12) + (Platform.OS === 'android' ? 10 : 0),
              },
            ]}
            onLayout={
              Platform.OS === 'android'
                ? (e) => setMeasuredToolbarHeight(e.nativeEvent.layout.height)
                : undefined
            }>
            <Animated.View style={[styles.toolbarSideBtnWrap, backButtonStyle]}>
              <Pressable
                style={styles.toolbarSideBtn}
                disabled={searchFocused || !showingWebView}
                onPress={handleBackPress}
                hitSlop={8}>
                <Ionicons
                  name="chevron-back"
                  size={22}
                  color={showingWebView ? TEXT_DARK : DISABLED_GRAY}
                />
              </Pressable>
            </Animated.View>

            {anyModalOpen ? (
              searchBarContent
            ) : (
              <GestureDetector gesture={swipeUpToTabsGesture}>{searchBarContent}</GestureDetector>
            )}

            <Pressable
              style={[
                styles.toolbarSideBtn,
                styles.toolbarRightBtn,
                searchFocused && styles.toolbarSideBtnFocused,
              ]}
              onPress={() => (searchFocused ? cancelSearch() : setMoreMenuVisible(true))}
              hitSlop={8}>
              <Animated.View style={[styles.iconLayer, moreIconStyle]}>
                <Ionicons name="ellipsis-horizontal" size={20} color={TEXT_DARK} />
              </Animated.View>
              <Animated.View style={[styles.iconLayer, closeIconStyle]}>
                <Ionicons name="close" size={20} color={TEXT_DARK} />
              </Animated.View>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <MoreMenu
        visible={moreMenuVisible}
        onClose={() => setMoreMenuVisible(false)}
        tabCount={tabs.length}
        bottomOffset={toolbarHeight}
        onNewTab={() => {
          addTab(false);
          setMoreMenuVisible(false);
        }}
        onNewPrivateTab={() => {
          addTab(true);
          setMoreMenuVisible(false);
        }}
        onBookmarks={() => {
          setMoreMenuVisible(false);
          setTimeout(() => setBookmarksVisible(true), MORE_MENU_CLOSE_DURATION);
        }}
        onAllTabs={() => {
          setMoreMenuVisible(false);
          setTimeout(() => setTabSwitcherVisible(true), MORE_MENU_CLOSE_DURATION);
        }}
      />

      <TabSwitcher
        visible={tabSwitcherVisible}
        tabs={tabs}
        onClose={() => setTabSwitcherVisible(false)}
        onNewTab={(isPrivate) => {
          setTabSwitcherVisible(false);
          setTimeout(() => addTab(isPrivate), TAB_SWITCHER_CLOSE_DURATION);
        }}
        onCloseTab={closeTab}
        onSelectTab={(id) => {
          setActiveTabId(id);
          setTabSwitcherVisible(false);
        }}
      />

      <BookmarksSheet visible={bookmarksVisible} onClose={() => setBookmarksVisible(false)} />
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 21,
    lineHeight: 24.15,
    letterSpacing: 0.5,
    color: TEXT_DARK,
    marginTop: CONTENT_TO_HEADER,
    marginBottom: HEADER_TO_CONTENT,
  },
  firstSectionTitle: {
    marginTop: 0,
  },
  inlineSectionTitle: {
    marginTop: 0,
    marginBottom: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: CONTENT_TO_HEADER,
    marginBottom: HEADER_TO_CONTENT,
  },
  linkText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    lineHeight: 24.15,
    letterSpacing: 0,
    color: BLUE,
  },
  card: {
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  shieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shieldNumber: {
    fontFamily: 'Inter_500Medium',
    fontSize: 19,
    lineHeight: 24.18,
    letterSpacing: 0,
    color: TEXT_DARK,
  },
  cardText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20.65,
    letterSpacing: 0,
    color: TEXT_DARK,
  },
  cardTextFull: {
    flex: undefined,
  },
  downloadCard: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  downloadText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20.65,
    letterSpacing: 0,
    color: TEXT_DARK,
  },
  editWrap: {
    alignItems: 'center',
    marginTop: 32,
  },
  editButton: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  editText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 24.15,
    letterSpacing: 0,
    color: TEXT_DARK,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 18,
    zIndex: 10,
    elevation: 10,
  },
  toolbarAndroidFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  toolbarSideBtnWrap: {
    height: 44,
    overflow: 'hidden',
    zIndex: 1,
  },
  toolbarSideBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GLASS_SURFACE,
  },
  toolbarRightBtn: {
    marginLeft: 10,
    zIndex: 5,
    elevation: 5,
  },
  toolbarSideBtnFocused: {
    backgroundColor: GLASS_SURFACE_STRONG,
  },
  iconLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: GLASS_SURFACE,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    paddingHorizontal: 14,
    height: 44,
    zIndex: 5,
    elevation: 5,
  },
  searchBarFocused: {
    backgroundColor: GLASS_SURFACE_STRONG,
  },
  searchInput: {
    flex: 1,
    fontWeight: '400',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: TEXT_DARK,
    textAlignVertical: 'center',
    padding: 0,
  },
  progressTrack: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 3,
    height: 2.5,
    borderRadius: 1.25,
    overflow: 'hidden',
    backgroundColor: DIVIDER,
  },
  progressFill: {
    height: '100%',
    backgroundColor: BLUE,
    borderRadius: 1.25,
  },
});
