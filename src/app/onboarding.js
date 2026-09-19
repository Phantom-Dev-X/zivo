/**
 * ============================================================
 *  ZIVO — ONBOARDING  (screen 1)
 * ============================================================
 *  This file does ONE job: it puts the words and buttons ON TOP
 *  of your background picture.
 *
 *  Your background picture (assets/zivo/onboard/bg-1.jpg)
 *  ALREADY contains, drawn inside the image itself:
 *      - the ZIVO logo
 *      - the word TOURNAMENTS
 *      - PLAY / COMPETE / WIN and the little crown
 *      - the orange decorative edges
 *      - the soldier, the plane, the sunset
 *
 *  So the code below does NOT recreate any of that. It only adds:
 *      1. the Skip pill (top right)
 *      2. WELCOME TO ZIVO            (small orange words)
 *      3. Turn Your / Skills Into / Rewards   (the big headline)
 *      4. the paragraph
 *      5. the 4 little cards
 *      6. the Next button
 *      7. the 5 dots
 *
 *  HOW IT STAYS CORRECT ON EVERY PHONE
 *  -----------------------------------
 *  Nothing is placed with hard pixel numbers from a screenshot.
 *  Instead:
 *      - useSafeAreaInsets()  keeps things off the status bar and
 *        off the phone's bottom gesture bar
 *      - useWindowDimensions() sizes the big headline from the
 *        real screen width
 *      - flex: 1 in the middle pushes the words down and lets the
 *        artwork breathe, whatever the screen height is
 *
 *  So on a small Android it still fits, and on a tall iPhone the
 *  words sit in the same relative place.
 * ============================================================
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============================================================
//  1. THE WORDS  —  every word on this screen lives right here
// ============================================================
//  Change a word below, save, and the phone updates itself.
// ============================================================
const SCREEN = {
  // ---- your background picture ----
  bg: require('../../assets/zivo/onboard/bg-1.jpg'),

  // ---- small orange words above the headline ----
  eyebrow: 'WELCOME TO ZIVO',

  // ---- the big headline: exactly 3 lines ----
  //  hot = which line is painted ZIVO orange (0 = first line)
  lines: ['Turn Your', 'Skills Into', 'Rewards'],
  hot: 2,

  // ---- the paragraph under the headline ----
  body:
    'Join Free Fire tournaments, compete with players, earn coins, climb the leaderboards and win amazing prizes.',

  // ---- the 4 little cards ----
  cards: [
    { icon: 'trophy', label: 'Free\nTournaments' },
    { icon: 'logo-bitcoin', label: 'Earn\nCoins' },
    { icon: 'stats-chart', label: 'XP &\nLeaderboards' },
    { icon: 'people', label: 'Referral\nRewards' },
  ],
};

/**
 * How many dots to draw.
 * Your mock shows 5 steps, so we draw 5 dots and light the first one.
 * When you send me the other 4 background pictures, we add them to a
 * list and the Next button starts swiping between them — the dots
 * already know how to follow along.
 */
const TOTAL_STEPS = 5;

// ============================================================
//  2. THE SCREEN
// ============================================================
export default function Onboarding() {
  const insets = useSafeAreaInsets(); // status bar + bottom gesture area
  const { width } = useWindowDimensions(); // the real screen width

  // the big headline grows with the phone, but never gets silly big
  const headlineSize = Math.min(Math.round(width * 0.098), 44);

  // "Next" at this stage walks straight into the app
  function goNext() {
    router.replace('/(tabs)');
  }

  return (
    <ImageBackground source={SCREEN.bg} style={styles.bg} resizeMode="cover">
      {/* the phone's own status bar stays visible, with white text */}
      <StatusBar style="light" />

      {/*
        A gentle dark wash over the bottom half only, so the words stay
        readable on every phone without touching your artwork.
        Delete this one <LinearGradient> block if you want ZERO overlay.
      */}
      <LinearGradient
        colors={['rgba(6,8,16,0)', 'rgba(6,8,16,0.35)', 'rgba(6,8,16,0.78)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* the whole layout, top to bottom */}
      <View style={styles.column}>
        {/* ---- keep clear of the status bar ---- */}
        <View style={{ height: insets.top }} />

        {/* ============================================================
            TOP ROW  —  only the Skip pill.
            (The ZIVO logo and TOURNAMENTS are already inside your
            picture, so we do not draw them again.)
        ============================================================ */}
        <View style={styles.topRow}>
          <Pressable
            onPress={goNext}
            style={({ pressed }) => [styles.skipPill, pressed && { opacity: 0.8 }]}
            hitSlop={8}
          >
            <Text style={styles.skipText}>Skip</Text>
            <Ionicons name="arrow-forward" size={14} color="#EDEDF5" />
          </Pressable>
        </View>

        {/* ---- this empty space lets the artwork show through ---- */}
        <View style={{ flex: 1 }} />

        {/* ============================================================
            THE WORDS  —  lower middle of the screen
        ============================================================ */}
        <View style={styles.content}>
          <Text style={styles.eyebrow}>{SCREEN.eyebrow}</Text>

          {SCREEN.lines.map((line, i) => (
            <Text
              key={line}
              style={[
                styles.headline,
                { fontSize: headlineSize, lineHeight: headlineSize * 1.08 },
                i === SCREEN.hot && styles.headlineHot,
              ]}
            >
              {line}
            </Text>
          ))}

          <Text style={styles.body}>{SCREEN.body}</Text>

          {/* ---- the 4 cards, one row, equal widths ---- */}
          <View style={styles.cardRow}>
            {SCREEN.cards.map((c) => (
              <View key={c.label} style={styles.card}>
                <Ionicons name={c.icon} size={18} color="#FF8A00" />
                <Text style={styles.cardText}>{c.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ============================================================
            BOTTOM  —  the Next button and the dots
        ============================================================ */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Pressable
            onPress={goNext}
            style={({ pressed }) => [styles.nextWrap, pressed && { opacity: 0.9 }]}
          >
            <LinearGradient
              colors={['#FF8A00', '#FF6A00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextInner}
            >
              <Text style={styles.nextText}>Next</Text>
              <Ionicons name="arrow-forward" size={17} color="#0B0B12" />
            </LinearGradient>
          </Pressable>

          {/* the 5 dots — the first one is lit */}
          <View style={styles.dots}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <View key={i} style={[styles.dot, i === 0 && styles.dotOn]} />
            ))}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

// ============================================================
//  3. THE STYLES
// ============================================================
const styles = StyleSheet.create({
  // the picture fills the whole screen, behind everything
  bg: { flex: 1, backgroundColor: '#05070E' },

  // the column that stacks: status bar space / skip / art / words / buttons
  column: { flex: 1 },

  // --- the Skip pill, top right ---
  topRow: { alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 8 },
  skipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    backgroundColor: 'rgba(12,14,24,0.45)',
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  skipText: { fontFamily: 'Rajdhani-Bold', fontSize: 13, color: '#EDEDF5' },

  // --- the words ---
  content: { paddingHorizontal: 20, paddingBottom: 6 },
  eyebrow: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 10.5,
    letterSpacing: 2.6,
    color: '#FF8A00',
    marginBottom: 6,
  },
  headline: {
    fontFamily: 'BebasNeue',
    letterSpacing: 0.4,
    color: '#FFFFFF',
  },
  headlineHot: { color: '#FF8A00' },
  body: {
    fontFamily: 'Rajdhani-Medium',
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(233,233,242,0.82)',
    marginTop: 10,
  },

  // --- the 4 cards ---
  cardRow: { flexDirection: 'row', gap: 7, marginTop: 16 },
  card: {
    flex: 1, // equal width, whatever the phone
    alignItems: 'center',
    gap: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    backgroundColor: 'rgba(10,12,22,0.55)',
    paddingVertical: 11,
    paddingHorizontal: 4,
  },
  cardText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 9.5,
    lineHeight: 11.5,
    color: '#F2F2F7',
    textAlign: 'center',
  },

  // --- the Next button + dots ---
  footer: { paddingHorizontal: 20, paddingTop: 16 },
  nextWrap: { borderRadius: 16, overflow: 'hidden' },
  nextInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingVertical: 16,
  },
  nextText: { fontFamily: 'Rajdhani-Bold', fontSize: 16.5, color: '#0B0B12' },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: 7, marginTop: 16 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.22)' },
  dotOn: { width: 22, backgroundColor: '#FF8A00' },
});
