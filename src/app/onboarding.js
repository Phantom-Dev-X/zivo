/**
 * ============================================================
 *  ZIVO — ONBOARDING  (the 5 intro screens)
 * ============================================================
 *  What a new player sees after tapping "Get Started".
 *  Full-screen artwork, big words, four little tiles, then Next.
 *
 *  Read it in 4 parts:
 *     1. the imports
 *     2. the DATA  (PANELS — the 5 screens, in order)
 *     3. the screen
 *     4. the styles
 *
 *  HOW IT WORKS (same trick as before):
 *  a horizontal ScrollView with one panel per screen. The phone
 *  tells us how wide the screen is (onLayout), and every panel is
 *  exactly that wide, so paging lands on a clean edge.
 *
 *  The artwork sits BEHIND everything (full bleed) and a dark
 *  gradient melts it into the words at the bottom. That is why
 *  the pictures look big like the reference mock.
 * ============================================================
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============================================================
//  1. THE DATA — the 5 intro screens
// ============================================================
//  lines   = the big words. One line each.
//  hot     = which line is painted orange (0 = first line)
//  tiles   = the 4 little boxes at the bottom
// ============================================================
const PANELS = [
  {
    id: 'welcome',
    image: require('../../assets/zivo/ob2-1.jpg'),
    eyebrow: 'WELCOME TO ZIVO',
    lines: ['Turn Your', 'Skills Into', 'Rewards'],
    hot: 2,
    body:
      'Join Free Fire tournaments, compete with players, earn coins, climb the leaderboards and win amazing prizes.',
    tiles: [
      { icon: 'trophy', label: 'Free\nTournaments' },
      { icon: 'logo-bitcoin', label: 'Earn\nCoins' },
      { icon: 'stats-chart', label: 'XP &\nLeaderboards' },
      { icon: 'people', label: 'Referral\nRewards' },
    ],
  },
  {
    id: 'how',
    image: require('../../assets/zivo/ob2-2.jpg'),
    eyebrow: 'HOW ZIVO WORKS',
    lines: ['Host Puts Up', 'The Prize.', 'Winner Takes It'],
    hot: 2,
    body:
      'The host opens a room and puts up the prize. You join, check in, and play. When the results lock, the winner collects.',
    tiles: [
      { icon: 'add-circle', label: 'Host a\nroom' },
      { icon: 'enter', label: 'Join a\nroom' },
      { icon: 'checkmark-circle', label: 'Check\nin' },
      { icon: 'medal', label: 'Win the\nprize' },
    ],
  },
  {
    id: 'pick',
    image: require('../../assets/zivo/ob2-3.jpg'),
    eyebrow: 'PICK YOUR BATTLE',
    lines: ['Battle Royale', 'Or Clash', 'Squad'],
    hot: 2,
    body:
      '48 players drop and one survives — or 4v4 rounds, first to four. Pick your mode, pick your crew, enter free or with coins.',
    tiles: [
      { icon: 'earth', label: 'Battle\nRoyale' },
      { icon: 'people', label: 'Clash\nSquad' },
      { icon: 'gift', label: 'Free\nentry' },
      { icon: 'diamond', label: 'Premium\nrooms' },
    ],
  },
  {
    id: 'fair',
    image: require('../../assets/zivo/ob2-4.jpg'),
    eyebrow: 'FAIR PLAY, ALWAYS',
    lines: ['Every Result', 'Verified.', 'Every Time'],
    hot: 1,
    body:
      'Players send their own post-match screenshot, a referee records from the spectator slot, and any mismatch is flagged before a prize moves.',
    tiles: [
      { icon: 'camera', label: 'Screenshot\nproof' },
      { icon: 'videocam', label: 'Referee\nrecords' },
      { icon: 'time', label: '24h\ndisputes' },
      { icon: 'receipt', label: 'Payout\nreceipt' },
    ],
  },
  {
    id: 'ready',
    image: require('../../assets/zivo/ob2-5.jpg'),
    eyebrow: 'YOU ARE READY',
    lines: ['Your Room', 'Is Waiting.', 'Come Inside'],
    hot: 2,
    body:
      'Grab your starter coins and join your first room tonight. Winner takes the prize — and the bragging rights.',
    tiles: [
      { icon: 'flash', label: 'Quick\nsignup' },
      { icon: 'logo-bitcoin', label: 'Starter\ncoins' },
      { icon: 'enter', label: 'Join a\nroom' },
      { icon: 'trending-up', label: 'Climb\nthe ranks' },
    ],
  },
];

// ============================================================
//  2. THE SCREEN
// ============================================================
export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const scroller = useRef(null);

  // the phone tells us how big the screen is (a 0 here breaks everything)
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [index, setIndex] = useState(0);

  const isLast = index === PANELS.length - 1;

  /** the Next button */
  function handleNext() {
    if (isLast) {
      router.replace('/(tabs)'); // into the app
      return;
    }
    const to = index + 1;
    scroller.current?.scrollTo({ x: to * size.w, animated: true });
    setIndex(to);
  }

  /** the Skip button, top right */
  function handleSkip() {
    router.replace('/(tabs)');
  }

  return (
    <View style={styles.screen}>
      {/* ============================================================
          the 5 panels, side by side
      ============================================================ */}
      <ScrollView
        ref={scroller}
        onLayout={(e) =>
          setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })
        }
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          if (!size.w) return;
          const which = Math.round(e.nativeEvent.contentOffset.x / size.w);
          if (which !== index && which >= 0 && which < PANELS.length) setIndex(which);
        }}
        style={{ flex: 1 }}
      >
        {PANELS.map((panel, i) => (
          <View key={panel.id} style={{ width: size.w, height: size.h }}>
            {/* --- the full-screen picture --- */}
            <Image source={panel.image} style={StyleSheet.absoluteFill} contentFit="cover" />

            {/* --- the dark wash that makes the words readable --- */}
            <LinearGradient
              colors={[
                'rgba(8,8,15,0.62)',
                'rgba(8,8,15,0.12)',
                'rgba(8,8,15,0.88)',
                'rgba(8,8,15,1)',
              ]}
              locations={[0, 0.34, 0.68, 1]}
              style={StyleSheet.absoluteFill}
            />

            {/* --- the little slanted words on panel 1 only --- */}
            {i === 0 ? (
              <View style={[styles.script, { top: size.h * 0.24 }]}>
                <Text style={[styles.scriptWord, { color: '#C9C9DC' }]}>PLAY</Text>
                <Text style={[styles.scriptWord, { color: '#FF8A00', marginLeft: 10 }]}>COMPETE</Text>
                <Text style={[styles.scriptWord, { color: '#FFC529' }]}>WIN</Text>
                <View style={styles.scriptRule} />
              </View>
            ) : null}

            {/* --- the words at the bottom --- */}
            <View style={styles.bottom}>
              <Text style={[styles.eyebrow, { color: '#FF8A00' }]}>{panel.eyebrow}</Text>

              {panel.lines.map((line, li) => (
                <Text
                  key={line}
                  style={[styles.bigLine, li === panel.hot && styles.bigLineHot]}
                >
                  {line}
                </Text>
              ))}

              <Text style={styles.body}>{panel.body}</Text>

              {/* the 4 little tiles */}
              <View style={styles.tiles}>
                {panel.tiles.map((t) => (
                  <View key={t.label} style={styles.tile}>
                    <Ionicons name={t.icon} size={17} color="#FF8A00" />
                    <Text style={styles.tileText}>{t.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ============================================================
          the top strip (sits ON TOP of the picture)
      ============================================================ */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
        <Image
          source={require('../../assets/zivo/mark.png')}
          style={styles.topMark}
          contentFit="contain"
          tintColor="#FF6A00"
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.topBrand}>ZIVO</Text>
          <Text style={styles.topSub}>TOURNAMENTS</Text>
        </View>

        <Pressable
          onPress={handleSkip}
          style={({ pressed }) => [styles.skipPill, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.skipText}>Skip</Text>
          <Ionicons name="arrow-forward" size={13} color="#F4F4F8" />
        </Pressable>
      </View>

      {/* ============================================================
          the bottom strip: Next button + dots
      ============================================================ */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [styles.nextWrap, pressed && { opacity: 0.88 }]}
        >
          <LinearGradient
            colors={['#FF8A00', '#FF6A00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextInner}
          >
            <Text style={styles.nextText}>{isLast ? 'Enter ZIVO' : 'Next'}</Text>
            <Ionicons name="arrow-forward" size={16} color="#0B0B12" />
          </LinearGradient>
        </Pressable>

        <View style={styles.dots}>
          {PANELS.map((p, i) => (
            <View key={p.id} style={[styles.dot, i === index && styles.dotOn]} />
          ))}
        </View>
      </View>
    </View>
  );
}

// ============================================================
//  3. THE STYLES
// ============================================================
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#08080F' },

  // --- the words at the bottom of each panel ---
  bottom: { position: 'absolute', left: 20, right: 20, bottom: 132 },
  eyebrow: { fontFamily: 'Rajdhani-Bold', fontSize: 10, letterSpacing: 2.4, marginBottom: 6 },
  bigLine: {
    fontFamily: 'BebasNeue',
    fontSize: 36,
    lineHeight: 37,
    letterSpacing: 0.6,
    color: '#F4F4F8',
  },
  bigLineHot: { color: '#FF8A00' },
  body: {
    fontFamily: 'Rajdhani-Medium',
    fontSize: 12.5,
    lineHeight: 19,
    color: '#C9C9DC',
    marginTop: 10,
  },

  tiles: { flexDirection: 'row', gap: 7, marginTop: 14 },
  tile: {
    flex: 1,
    backgroundColor: 'rgba(8,8,15,0.62)',
    borderWidth: 1,
    borderColor: '#2A2A3E',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 6,
  },
  tileText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 9.5,
    lineHeight: 11.5,
    color: '#E6E6F0',
    textAlign: 'center',
  },

  // --- the slanted words on panel 1 ---
  script: { position: 'absolute', left: 16, transform: [{ rotate: '-8deg' }] },
  scriptWord: { fontFamily: 'BebasNeue', fontSize: 26, letterSpacing: 2, lineHeight: 28 },
  scriptRule: {
    width: 54,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#FF8A00',
    marginTop: 6,
    marginLeft: 4,
  },

  // --- the top strip ---
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  topMark: { width: 30, height: 30 },
  topBrand: { fontFamily: 'BebasNeue', fontSize: 27, letterSpacing: 3.4, color: '#F4F4F8' },
  topSub: { fontFamily: 'Rajdhani-Bold', fontSize: 8.5, letterSpacing: 3.4, color: '#8B8BA5', marginTop: -2 },
  skipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#3A3A4C',
    backgroundColor: 'rgba(8,8,15,0.45)',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  skipText: { fontFamily: 'Rajdhani-Bold', fontSize: 12.5, color: '#F4F4F8' },

  // --- the bottom strip ---
  footer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 0,
    paddingTop: 10,
  },
  nextWrap: { borderRadius: 14, overflow: 'hidden' },
  nextInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
  },
  nextText: { fontFamily: 'Rajdhani-Bold', fontSize: 15.5, color: '#0B0B12' },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 14 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotOn: { backgroundColor: '#FF8A00', width: 20 },
});
