/**
 * ============================================================
 *  ZIVO  —  the "Get Started" screen  (src/app/index.js)
 * ============================================================
 *  The first screen anybody sees.
 *
 *  ------------------------------------------------------------
 *  WHAT IS INSIDE YOUR ARTWORK  (we never redraw these)
 *  ------------------------------------------------------------
 *      the ZIVO mark · TOURNAMENTS · PLAY · COMPETE · CONNECT · RISE
 *      the fiery portal · the city · the character
 *      the aircraft and parachuters · the orange corner frame
 *
 *  ------------------------------------------------------------
 *  WHAT THIS FILE BUILDS  (real React Native UI on top)
 *  ------------------------------------------------------------
 *      YOUR GAME.                <- white
 *      YOUR MOMENT.              <- orange
 *      Join tournaments, compete with players and earn rewards.
 *      [ GET STARTED → ]
 *      [     LOG IN    ]
 *
 *  No "New to Zivo?", no "Create account", no second logo.
 *
 *  ------------------------------------------------------------
 *  WHY THERE IS NO BLACK STRIP AT THE TOP  (read this)
 *  ------------------------------------------------------------
 *  A phone has TWO screen sizes and they are not the same:
 *      window = the app area, NOT including the status bar
 *      screen = the WHOLE physical screen, INCLUDING the status bar
 *  If the picture is laid out inside "window", it stops just under
 *  the status bar and you get a strip. So here the picture is
 *  pinned to "screen" with position:absolute on all four sides.
 *  It runs behind the status bar and behind the home indicator.
 *
 *  There is also no colour painted behind the picture, so there is
 *  nothing that could ever show as a strip.
 *
 *  ------------------------------------------------------------
 *  WHY THE PICTURE IS NEVER CROPPED TOP OR BOTTOM
 *  ------------------------------------------------------------
 *  Your artwork is 940 x 1672 = a ratio of 0.5622 (quite wide).
 *  Every portrait phone is narrower than that, so "cover" scales
 *  the picture to fill the screen HEIGHT and trims a little off
 *  the LEFT and RIGHT edges. The top and bottom are always fully
 *  visible: the portal, the logo and the character can never be
 *  cut off, on any phone.
 * ============================================================
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router'; // router.push / router.replace
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============================================================
//  1. YOUR ARTWORK
// ============================================================
const ART = {
  src: require('../../assets/zivo/getstarted.jpg'),
  w: 940,
  h: 1672, // (kept here for reference — the maths above uses this ratio)
};

// ============================================================
//  2. THE SCREEN
// ============================================================
export default function GetStarted() {
  const insets = useSafeAreaInsets(); // the notch and the phone's home bar
  const screen = Dimensions.get('screen'); // the WHOLE physical screen
  const { width, height } = useWindowDimensions(); // the app area

  // ---- responsive sizing, no hard-coded pixels ----
  //  Short phones get slightly smaller type and tighter spacing so
  //  the buttons always fit. Tall phones get more breathing room.
  const compact = height < 720;

  const heroSize = Math.min(width * 0.125, height * 0.058, 52);
  const descSize = compact ? 13.5 : 14.5;
  const btnGap = compact ? 8 : 11;
  const stackTop = compact ? 14 : 20;

  // ---- the two buttons: navigation reused exactly as it was ----
  // push = go forward; the phone's back button brings you back here
  function startOnboarding() {
    router.push('/onboarding');
  }

  // replace = go forward and forget this screen, so the back button
  // does not return to the splash screen
  function goToApp() {
    router.replace('/(tabs)');
  }

  return (
    // the root tag spans the whole physical screen
    <View style={styles.root}>
      {/* ============================================================
          THE ARTWORK — pinned to all four screen edges
      ============================================================ */}
      <View style={styles.bgLayer} pointerEvents="none">
        <Image
          source={ART.src}
          style={{ width: screen.width, height: screen.height }}
          contentFit="cover"
          contentPosition="center"
        />
      </View>

      {/*
        A soft dark wash over the LOWER part of the screen only, so
        YOUR GAME / YOUR MOMENT stay readable over the bright grass
        and city lights. The top of the picture (the portal, the
        logo, the tagline) is not touched at all.
        Delete this one block for zero overlay.
      */}
      <LinearGradient
        colors={['rgba(4,4,10,0)', 'rgba(4,4,10,0.28)', 'rgba(4,4,10,0.74)']}
        locations={[0, 0.55, 1]}
        style={styles.scrim}
        pointerEvents="none"
      />

      {/* ============================================================
          THE FOREGROUND — words and buttons, safe-area aware
      ============================================================ */}
      <View style={styles.column}>
        {/* the artwork breathes here (never less than the status bar) */}
        <View style={{ flex: 1, minHeight: insets.top }} />

        {/* ---- the hero text + description ---- */}
        <View style={styles.content}>
          <Text
            style={[
              styles.hero,
              { fontSize: heroSize, lineHeight: heroSize * 1.02 },
            ]}
          >
            YOUR GAME.
          </Text>

          <Text
            style={[
              styles.hero,
              styles.heroHot,
              { fontSize: heroSize, lineHeight: heroSize * 1.02 },
            ]}
          >
            YOUR MOMENT.
          </Text>

          <Text
            style={[
              styles.desc,
              {
                fontSize: descSize,
                lineHeight: descSize * 1.5,
                marginTop: compact ? 8 : 12,
              },
            ]}
          >
            Join tournaments, compete with players and earn rewards.
          </Text>
        </View>

        {/* ---- the two buttons ---- */}
        <View
          style={[
            styles.buttons,
            {
              gap: btnGap,
              marginTop: stackTop,
              paddingBottom: Math.max(insets.bottom, 14) + 10,
            },
          ]}
        >
          {/* GET STARTED */}
          <Pressable
            onPress={startOnboarding}
            style={({ pressed }) => [styles.goldOuter, pressed && { opacity: 0.9 }]}
            accessibilityRole="button"
            accessibilityLabel="Get Started"
          >
            <LinearGradient
              colors={['#FF8A00', '#FF6A00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.goldInner, { paddingVertical: compact ? 14 : 16 }]}
            >
              <Text style={styles.goldText}>GET STARTED</Text>
              <Ionicons name="arrow-forward" size={19} color="#170B00" />
            </LinearGradient>
          </Pressable>

          {/* LOG IN */}
          <Pressable
            onPress={goToApp}
            style={({ pressed }) => [styles.darkBtn, pressed && { opacity: 0.85 }]}
            accessibilityRole="button"
            accessibilityLabel="Log in"
          >
            <Text style={styles.darkText}>LOG IN</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ============================================================
//  3. THE STYLES
// ============================================================
const styles = StyleSheet.create({
  // the whole physical screen. The colour matches the artwork's
  // darkest edge, so a sliver can never read as a strip.
  root: { flex: 1, backgroundColor: '#06040E' },

  // the picture layer, pinned to every edge of the physical screen
  bgLayer: { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 },

  // the readable wash — lower part of the screen only
  scrim: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '58%' },

  // the column: artwork space / words / buttons
  column: { flex: 1 },

  // --- the hero words + description ---
  content: { paddingHorizontal: 22, alignItems: 'center' },
  hero: {
    fontFamily: 'BebasNeue',
    letterSpacing: 1.2,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  heroHot: {
    color: '#FF8A00',
    textShadowColor: 'rgba(255,110,0,0.55)',
    textShadowRadius: 16,
  },
  desc: {
    fontFamily: 'Rajdhani-Medium',
    color: 'rgba(238,238,246,0.92)',
    textAlign: 'center',
    maxWidth: 330, // so it wraps naturally on small phones
  },

  // --- the buttons ---
  buttons: { paddingHorizontal: 24 },

  // The glow lives on the OUTER view: a glow drawn on a view that
  // clips its children gets cut off. So the corners and the clipping
  // live on the inner gradient instead.
  goldOuter: {
    borderRadius: 14,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 5, // the two tight corners = the angular,
    borderBottomRightRadius: 14, // gaming look
    borderBottomLeftRadius: 5,
    boxShadow: '0 8px 20px rgba(255,110,0,0.45)', // soft orange glow
  },
  goldInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 5,
    overflow: 'hidden',
  },
  goldText: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 16.5,
    letterSpacing: 1.6,
    color: '#170B00',
  },

  darkBtn: {
    borderRadius: 14,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    backgroundColor: 'rgba(10,10,20,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  darkText: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 15.5,
    letterSpacing: 1.6,
    color: '#F4F4F8',
  },
});
