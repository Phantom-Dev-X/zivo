/**
 * ============================================================
 *  ZIVO — ONBOARDING  (5 stages, one shared look)
 * ============================================================
 *  ONE file, ONE design system, FIVE stages.
 *  Stage 1, Stage 2, Stage 3, Stage 4, Stage 5 all use the
 *  exact same pieces:
 *
 *      <SkipPill />       the glass button, top right
 *      <Eyebrow />        the small orange words
 *      <Headline />       the 3 big lines (last one orange)
 *      <Body />           the paragraph
 *      <FeatureCards />   the 4 little cards
 *      <NextButton />     the big orange button
 *      <Dots />           5 dots, the current one orange
 *
 *  Stages do NOT have their own copies of those parts.
 *  A stage is just DATA (some words). Change the words in the
 *  STAGES list below and the screen changes. That is the whole
 *  idea — one system, five pages.
 *
 *  ------------------------------------------------------------
 *  THE BACKGROUND
 *  ------------------------------------------------------------
 *  The background picture is YOUR artwork. Nothing in this file
 *  draws or edits it. Right now all 5 stages share the same
 *  picture (bg-1.jpg) because that is the only one we have.
 *
 *  >>> When you send the other background pictures, give each
 *      stage its own `bg:` line in the STAGES list, and move the
 *      <ImageBackground> from the root into each page (there is
 *      a note showing exactly where). <<<
 *
 *  ------------------------------------------------------------
 *  EDGE-TO-EDGE (no black strip behind the status bar)
 *  ------------------------------------------------------------
 *  BACKGROUND  = fills the whole physical screen, top to bottom,
 *                including behind the status bar and behind the
 *                phone's bottom gesture bar.
 *  FOREGROUND  = every word and button respects the safe area,
 *                so nothing hides under the clock or the notch.
 *
 *  The background is the ROOT of this screen, so there is no
 *  coloured layer above it that could show a strip.
 *  The status bar itself is transparent on its own in Expo SDK 57
 *  (edge-to-edge is mandatory there), so we only set its icon
 *  colour to white — nothing else is needed or allowed.
 * ============================================================
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============================================================
//  1. THE 5 STAGES  —  every word on every page lives here
// ============================================================
//  eyebrow  small orange words above the headline
//  lines    the big headline, exactly 3 lines
//  hot      which line is orange (0 = first, 1 = second, 2 = third)
//  body     the paragraph
//  cards    the 4 little cards (icon + label, \n = a new line)
// ============================================================

/** the background picture. Same asset for now — see the note up top. */
const BG = require('../../assets/zivo/onboard/bg-1.jpg');

/** Stage 1's cards. Stage 2 uses the same four, on purpose. */
const CARDS_WELCOME = [
  { icon: 'trophy', label: 'Free\nTournaments' },
  { icon: 'logo-bitcoin', label: 'Earn\nCoins' },
  { icon: 'stats-chart', label: 'XP &\nLeaderboards' },
  { icon: 'people', label: 'Referral\nRewards' },
];

const STAGES = [
  // ---------------- STAGE 1 (already on your phone — untouched) ----------------
  {
    id: 'welcome',
    bg: BG,
    eyebrow: 'WELCOME TO ZIVO',
    lines: ['Turn Your', 'Skills Into', 'Rewards'],
    hot: 2,
    body:
      'Join Free Fire tournaments, compete with players, earn coins, climb the leaderboards and win amazing prizes.',
    cards: CARDS_WELCOME,
  },

  // ---------------- STAGE 2 (the new one) ----------------
  {
    id: 'levelup',
    bg: BG,
    eyebrow: 'LEVEL UP YOUR GAME',
    lines: ['More Tournaments', 'Bigger Rewards', 'Real Opportunities'],
    hot: 2,
    body:
      'Join daily and premium tournaments, prove your skills, earn coins and climb the ranks on the leaderboard.',
    cards: CARDS_WELCOME, // same four cards as Stage 1, as you asked
  },

  // ---------------- STAGE 3 ----------------
  {
    id: 'how',
    bg: BG,
    eyebrow: 'HOW ZIVO WORKS',
    lines: ['Host Puts Up', 'The Prize.', 'Winner Takes It'],
    hot: 2,
    body:
      'The host opens a room and puts up the prize. You join, check in, and play. When the results lock, the winner collects.',
    cards: [
      { icon: 'add-circle', label: 'Host a\nroom' },
      { icon: 'enter', label: 'Join a\nroom' },
      { icon: 'checkmark-circle', label: 'Check\nin' },
      { icon: 'medal', label: 'Win the\nprize' },
    ],
  },

  // ---------------- STAGE 4 ----------------
  {
    id: 'fair',
    bg: BG,
    eyebrow: 'FAIR PLAY, ALWAYS',
    lines: ['Every Result', 'Verified.', 'Every Time'],
    hot: 1,
    body:
      'Players send their own post-match screenshot, a referee records from the spectator slot, and any mismatch is flagged before a prize moves.',
    cards: [
      { icon: 'camera', label: 'Screenshot\nproof' },
      { icon: 'videocam', label: 'Referee\nrecords' },
      { icon: 'time', label: '24h\ndisputes' },
      { icon: 'receipt', label: 'Payout\nreceipt' },
    ],
  },

  // ---------------- STAGE 5 ----------------
  {
    id: 'ready',
    bg: BG,
    eyebrow: 'YOU ARE READY',
    lines: ['Your Room', 'Is Waiting.', 'Come Inside'],
    hot: 2,
    body:
      'Grab your starter coins and join your first room tonight. Winner takes the prize — and the bragging rights.',
    cards: [
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
  const insets = useSafeAreaInsets(); // status bar height + bottom gesture bar
  const { width, height } = useWindowDimensions(); // the real screen size
  const pager = useRef(null);

  // which stage we are on (0 = Stage 1)
  const [index, setIndex] = useState(0);

  const isLast = index === STAGES.length - 1;

  /**
   * The headline size grows with the phone instead of using a fixed
   * number from a screenshot:
   *   - it follows the screen WIDTH (so wide phones get big words)
   *   - but it also follows the screen HEIGHT (so short phones do not
   *     push the cards off the bottom)
   *   - and it stops at 44 so a tablet does not look silly
   */
  const headlineSize = Math.min(Math.round(width * 0.098), Math.round(height * 0.052), 44);

  /** the Next button */
  function goNext() {
    if (isLast) {
      router.replace('/(tabs)'); // into the app
      return;
    }
    const to = index + 1;
    pager.current?.scrollTo({ x: to * width, animated: true });
    setIndex(to);
  }

  /** the Skip button — the same behaviour as Stage 1 */
  function goSkip() {
    router.replace('/(tabs)');
  }

  return (
    // ============================================================
    //  THE BACKGROUND IS THE ROOT
    //  It fills the whole screen — behind the status bar, behind
    //  the notch, down behind the bottom gesture bar.
    //  (When each stage gets its own picture, cut this
    //   <ImageBackground> and paste it inside the page below,
    //   using {stage.bg} instead of {BG}.)
    // ============================================================
    <ImageBackground source={BG} style={styles.root} resizeMode="cover">
      {/* white status-bar icons; the bar itself stays transparent
          so your artwork shows through it */}
      <StatusBar style="light" />

      {/*
        One very light dark wash, bottom half only, so the small grey
        paragraph stays readable on every phone. It does not move or
        change your artwork. Delete this block for zero overlay.
      */}
      <LinearGradient
        colors={['rgba(6,8,16,0)', 'rgba(6,8,16,0.35)', 'rgba(6,8,16,0.78)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* ============================================================
          THE FOREGROUND LAYER  (safe-area aware)
      ============================================================ */}
      <View style={styles.column}>
        {/* ---- space for the status bar / notch ---- */}
        <View style={{ height: insets.top }} />

        {/* ============================================================
            TOP SECTION — same as Stage 1.
            The ZIVO logo and the word TOURNAMENTS are already inside
            your picture, so we do not draw them again. The only thing
            we build is the Skip pill.
        ============================================================ */}
        <View style={styles.topRow}>
          <Pressable
            onPress={goSkip}
            style={({ pressed }) => [styles.skipPill, pressed && { opacity: 0.8 }]}
            hitSlop={8}
          >
            <Text style={styles.skipText}>Skip</Text>
            <Ionicons name="arrow-forward" size={14} color="#EDEDF5" />
          </Pressable>
        </View>

        {/* ---- this gap lets the artwork breathe ---- */}
        <View style={{ flex: 1 }} />

        {/* ============================================================
            THE 5 PAGES  (swipe sideways, or press Next)
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
              {/*
                EVERY PAGE USES THE SAME PIECES BELOW.
                Nothing here is a copy of another stage — these are the
                shared building blocks, fed different words.
              */}
              <View style={styles.content}>
                {/* ---- small orange words ---- */}
                <Text style={styles.eyebrow}>{stage.eyebrow}</Text>

                {/* ---- the 3 big lines ---- */}
                {stage.lines.map((line, li) => (
                  <Text
                    key={line}
                    style={[
                      styles.headline,
                      { fontSize: headlineSize, lineHeight: headlineSize * 1.08 },
                      li === stage.hot && styles.headlineHot,
                    ]}
                  >
                    {line}
                  </Text>
                ))}

                {/* ---- the paragraph ---- */}
                <Text style={styles.body}>{stage.body}</Text>

                {/* ---- the 4 cards ---- */}
                <FeatureCards cards={stage.cards} />
              </View>
            </View>
          ))}
        </ScrollView>

        {/* ============================================================
            THE BOTTOM — same Next button and dots on all 5 pages,
            so they never move when you swipe.
        ============================================================ */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <NextButton label={isLast ? 'Enter ZIVO' : 'Next'} onPress={goNext} />
          <Dots total={STAGES.length} active={index} />
        </View>
      </View>
    </ImageBackground>
  );
}

// ============================================================
//  3. THE SHARED PIECES
//     (used by all 5 stages — never duplicated)
// ============================================================

/** the 4 little cards in one row */
function FeatureCards({ cards }) {
  return (
    <View style={styles.cardRow}>
      {cards.map((c) => (
        <View key={c.label} style={styles.card}>
          <Ionicons name={c.icon} size={18} color="#FF8A00" />
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
        <Ionicons name="arrow-forward" size={17} color="#0B0B12" />
      </LinearGradient>
    </Pressable>
  );
}

/**
 * The dots. `active` decides which one is orange —
 * on Stage 2 we pass active={1}, so the SECOND dot lights up.
 */
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
//  4. THE STYLES
// ============================================================
const styles = StyleSheet.create({
  // the picture, filling the entire physical screen
  root: { flex: 1, backgroundColor: '#05070E' },

  // the stack: status-bar gap / Skip / artwork gap / pages / button+dots
  column: { flex: 1 },

  // --- the Skip pill (identical to Stage 1) ---
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

  // --- the pager ---
  pager: { flexGrow: 0 },

  // --- the words ---
  content: { paddingHorizontal: 20, paddingBottom: 4 },
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
    flex: 1, // equal widths, whatever the phone
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

  // --- the button and the dots ---
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
