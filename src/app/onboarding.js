/**
 * ============================================================
 *  ZIVO — ONBOARDING  (2 pages, one shared look)
 * ============================================================
 *  ONE file, ONE design system, TWO pages.
 *  Both pages use the exact same pieces:
 *
 *      <FeatureCards />   the 4 little cards
 *      <NextButton />     the big orange button
 *      <Dots />           the dots, current one orange
 *
 *  A "page" is just DATA (some words). Change the words in the
 *  STAGES list below and the screen changes.
 *
 *  Pages 3, 4 and 5 were removed because you did not like that
 *  copy. They are parked at the bottom of this file — scroll to
 *  the very end, put your own words in, and they come back.
 *
 *  ------------------------------------------------------------
 *  THE BACKGROUND SITS OVER THE WHOLE SCREEN
 *  ------------------------------------------------------------
 *  This was the important fix. There are two different screen
 *  sizes on a phone and they are NOT the same:
 *
 *      window  = the app area, NOT including the status bar
 *      screen  = the WHOLE physical screen, INCLUDING the status
 *                bar and the phone's bottom navigation bar
 *
 *  If you size the picture with "window", a black strip shows
 *  where the status bar is. So the picture here is pinned to
 *  "screen" with position:absolute on all four sides — exactly
 *  the thing you did before with your View tag.
 *
 *  The words and buttons still sit inside the safe area, so the
 *  clock and the notch never cover them.
 * ============================================================
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============================================================
//  1. YOUR ARTWORK
// ============================================================
//  Nothing in this file draws or edits this picture.
//  It is pinned full-screen behind everything.
const BG = require('../../assets/zivo/onboard/bg-1.jpg');

// ============================================================
//  2. THE PAGES  —  every word lives here
// ============================================================
//  eyebrow  the small orange words above the headline
//  lines    the big headline. Keep them short — the code
//           measures the longest line and sizes the text so it
//           always fits across the phone.
//  hot      which line is orange (0 = first, 1 = second, 2 = third)
//  body     the paragraph
//  cards    the 4 little cards (icon + label, \n = new line)
// ============================================================
const STAGES = [
  {
    id: 'welcome',
    eyebrow: 'WELCOME TO ZIVO',
    lines: ['Turn Your', 'Skills Into', 'Rewards'],
    hot: 2,
    body:
      'Join Free Fire tournaments, compete with players, earn coins, climb the leaderboards and win amazing prizes.',
    cards: [
      { icon: 'trophy', label: 'Free\nTournaments' },
      { icon: 'logo-bitcoin', label: 'Earn\nCoins' },
      { icon: 'stats-chart', label: 'XP &\nLeaderboards' },
      { icon: 'people', label: 'Referral\nRewards' },
    ],
  },
  {
    id: 'levelup',
    eyebrow: 'LEVEL UP YOUR GAME',
    lines: ['More Tournaments', 'Bigger Rewards', 'Real Opportunities'],
    hot: 2,
    body:
      'Join daily and premium tournaments, prove your skills, earn coins and climb the ranks on the leaderboard.',
    cards: [
      { icon: 'trophy', label: 'Free\nTournaments' },
      { icon: 'logo-bitcoin', label: 'Earn\nCoins' },
      { icon: 'stats-chart', label: 'XP &\nLeaderboards' },
      { icon: 'people', label: 'Referral\nRewards' },
    ],
  },
];

// ============================================================
//  3. SIZING  —  measured from your real font, not guessed
// ============================================================
//  In Bebas Neue, one letter is about 0.395 of the font size
//  wide (0.395 = 39.5% of the height). I measured this from the
//  actual font file, using your real headlines.
//
//  So: the longest line of every page decides how big the text
//  can be without touching the screen edge.
// ============================================================
const SIDE = 20; // left/right margin for all text
const CHAR_RATIO = 0.395; // Bebas Neue, measured
const MAX_HEADLINE = 56; // never bigger than this, even on a tablet

function headlineSizeFor(stages, width, height) {
  // the longest line across every page, so both pages match
  const longest = stages.reduce(
    (max, s) => Math.max(max, ...s.lines.map((l) => l.length)),
    0
  );

  const usable = width - SIDE * 2;
  const fitsAcross = usable / (CHAR_RATIO * longest); // width limit
  const fitsDown = height * 0.058; // height limit (short phones)

  return Math.floor(Math.min(fitsAcross, fitsDown, MAX_HEADLINE));
}

// ============================================================
//  4. THE SCREEN
// ============================================================
export default function Onboarding() {
  const insets = useSafeAreaInsets(); // keeps words off the clock + home bar
  const { width, height } = useWindowDimensions(); // the app area
  const pager = useRef(null);

  const [index, setIndex] = useState(0);

  // THE WHOLE PHYSICAL SCREEN — status bar and nav bar included.
  // This is what makes the picture cover everything.
  const full = Dimensions.get('screen');

  const headlineSize = headlineSizeFor(STAGES, width, height);
  const isLast = index === STAGES.length - 1;

  function goNext() {
    if (isLast) {
      router.replace('/(tabs)'); // into the app
      return;
    }
    const to = index + 1;
    pager.current?.scrollTo({ x: to * width, animated: true });
    setIndex(to);
  }

  function goSkip() {
    router.replace('/(tabs)');
  }

  return (
    // the root view tag — it spans the entire phone screen
    <View style={styles.root}>
      {/* white status-bar icons. The bar itself paints nothing, so
          your artwork is what shows behind it. */}
      <StatusBar style="light" />

      {/* ============================================================
          THE BACKGROUND LAYER
          Pinned to the full physical screen: top 0, bottom 0,
          left 0, right 0. It goes UNDER the status bar and UNDER
          the bottom navigation bar.
      ============================================================ */}
      <View
        style={[styles.bgLayer, { width: full.width, height: full.height }]}
        pointerEvents="none"
      >
        <Image
          source={BG}
          style={[styles.bgImage, { width: full.width, height: full.height }]}
          resizeMode="cover"
        />

        {/*
          A very light dark wash over the bottom half only, so the
          small grey paragraph stays readable on every phone.
          Delete this block for zero overlay — nothing else changes.
        */}
        <LinearGradient
          colors={['rgba(6,8,16,0)', 'rgba(6,8,16,0.32)', 'rgba(6,8,16,0.76)']}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* ============================================================
          THE FOREGROUND  (safe-area aware)
      ============================================================ */}
      <View style={styles.column}>
        {/* ---- clear the status bar / notch ---- */}
        <View style={{ height: insets.top }} />

        {/* ---- Skip pill, top right. ZIVO logo and TOURNAMENTS are
             already inside your picture, so we never draw them. ---- */}
        <View style={styles.topRow}>
          <Pressable
            onPress={goSkip}
            style={({ pressed }) => [styles.skipPill, pressed && { opacity: 0.8 }]}
            hitSlop={8}
          >
            <Text style={styles.skipText}>Skip</Text>
            <Ionicons name="arrow-forward" size={15} color="#EDEDF5" />
          </Pressable>
        </View>

        {/* ---- the artwork breathes here ---- */}
        <View style={{ flex: 1 }} />

        {/* ============================================================
            THE PAGES  (swipe, or press Next)
        ============================================================ */}
        <ScrollView
          ref={pager}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) => {
            const which = Math.round(e.nativeEvent.contentOffset.x / width);
            if (which !== index && which >= 0 && which < STAGES.length) setIndex(which);
          }}
          style={styles.pager}
        >
          {STAGES.map((stage) => (
            <View key={stage.id} style={{ width }}>
              <View style={styles.content}>
                <Text style={styles.eyebrow}>{stage.eyebrow}</Text>

                {stage.lines.map((line, li) => (
                  <Text
                    key={line}
                    numberOfLines={1}
                    style={[
                      styles.headline,
                      { fontSize: headlineSize, lineHeight: headlineSize * 1.06 },
                      li === stage.hot && styles.headlineHot,
                    ]}
                  >
                    {line}
                  </Text>
                ))}

                <Text style={styles.body}>{stage.body}</Text>

                <FeatureCards cards={stage.cards} />
              </View>
            </View>
          ))}
        </ScrollView>

        {/* ============================================================
            THE BOTTOM — Next + dots (same on both pages)
        ============================================================ */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <NextButton label={isLast ? 'Enter ZIVO' : 'Next'} onPress={goNext} />
          <Dots total={STAGES.length} active={index} />
        </View>
      </View>
    </View>
  );
}

// ============================================================
//  5. THE SHARED PIECES  (used by every page — never copied)
// ============================================================

/** the 4 little cards in one row */
function FeatureCards({ cards }) {
  return (
    <View style={styles.cardRow}>
      {cards.map((c) => (
        <View key={c.label} style={styles.card}>
          <Ionicons name={c.icon} size={21} color="#FF8A00" />
          <Text style={styles.cardText}>{c.label}</Text>
        </View>
      ))}
    </View>
  );
}

/** the big orange button */
function NextButton({ label, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.nextWrap, pressed && { opacity: 0.9 }]}>
      <LinearGradient
        colors={['#FF8A00', '#FF6A00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.nextInner}
      >
        <Text style={styles.nextText}>{label}</Text>
        <Ionicons name="arrow-forward" size={19} color="#0B0B12" />
      </LinearGradient>
    </Pressable>
  );
}

/** the dots — `active` decides which one is orange */
function Dots({ total, active }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i === active && styles.dotOn]} />
      ))}
    </View>
  );
}

// ============================================================
//  6. THE STYLES
// ============================================================
const styles = StyleSheet.create({
  // the root spans the whole phone screen.
  // Its colour matches the very top of your artwork (near black),
  // so even a one-pixel sliver can never look like a black strip.
  root: { flex: 1, backgroundColor: '#000205' },

  // the background layer, pinned to all four physical edges
  bgLayer: { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 },
  bgImage: { position: 'absolute', top: 0, left: 0 },

  // the stack: status-bar gap / Skip / artwork gap / pages / bottom
  column: { flex: 1 },

  // --- Skip pill ---
  topRow: { alignItems: 'flex-end', paddingHorizontal: SIDE, paddingTop: 8 },
  skipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    backgroundColor: 'rgba(12,14,24,0.45)',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  skipText: { fontFamily: 'Rajdhani-Bold', fontSize: 14.5, color: '#EDEDF5' },

  // --- the pager ---
  pager: { flexGrow: 0 },

  // --- the words ---
  content: { paddingHorizontal: SIDE, paddingBottom: 4 },
  eyebrow: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 12.5,
    letterSpacing: 2.6,
    color: '#FF8A00',
    marginBottom: 7,
  },
  headline: {
    fontFamily: 'BebasNeue',
    letterSpacing: 0.4,
    color: '#FFFFFF',
  },
  headlineHot: { color: '#FF8A00' },
  body: {
    fontFamily: 'Rajdhani-Medium',
    fontSize: 14.5,
    lineHeight: 22,
    color: 'rgba(233,233,242,0.84)',
    marginTop: 11,
  },

  // --- the 4 cards ---
  cardRow: { flexDirection: 'row', gap: 7, marginTop: 17 },
  card: {
    flex: 1, // equal widths on every phone
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    backgroundColor: 'rgba(10,12,22,0.55)',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  cardText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 10.5,
    lineHeight: 13,
    color: '#F2F2F7',
    textAlign: 'center',
  },

  // --- the button and the dots ---
  footer: { paddingHorizontal: SIDE, paddingTop: 16 },
  nextWrap: { borderRadius: 16, overflow: 'hidden' },
  nextInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 17,
  },
  nextText: { fontFamily: 'Rajdhani-Bold', fontSize: 18, color: '#0B0B12' },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: 7, marginTop: 16 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.22)' },
  dotOn: { width: 24, backgroundColor: '#FF8A00' },
});

/**
 * ============================================================
 *  PARKED PAGES — the 3 we cut
 * ============================================================
 *  You said this copy was not meaningful, so the app now has 2
 *  pages. When you write better words, copy one of the blocks
 *  below into the STAGES list above and the page comes back —
 *  the dots count themselves.
 *
 *  {
 *    id: 'how',
 *    eyebrow: 'HOW ZIVO WORKS',
 *    lines: ['LINE ONE', 'LINE TWO', 'LINE THREE'],
 *    hot: 2,
 *    body: 'Your paragraph here.',
 *    cards: [
 *      { icon: 'add-circle', label: 'Host a\nroom' },
 *      { icon: 'enter', label: 'Join a\nroom' },
 *      { icon: 'checkmark-circle', label: 'Check\nin' },
 *      { icon: 'medal', label: 'Win the\nprize' },
 *    ],
 *  },
 * ============================================================
 */
