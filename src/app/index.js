/**
 * ============================================================
 *  ZIVO  —  the "Get Started" screen  (src/app/index.js)
 * ============================================================
 *  This is the first screen anybody sees.
 *
 *  THE PICTURE IS THE WHOLE SCREEN.
 *  Everything you can read is already drawn inside the artwork:
 *      ZIVO · TOURNAMENTS · PLAY · COMPETE · CONNECT · RISE
 *      YOUR GAME. YOUR MOMENT.
 *      "Join tournaments, compete with players and earn rewards."
 *
 *  So this file does NOT draw any of that. No logo, no tagline,
 *  no heading, no description. If we drew them again they would
 *  sit on top of the picture's own words and look messy.
 *
 *  All this file adds is TWO REAL BUTTONS:
 *      [ GET STARTED → ]   orange, dark text, soft orange glow
 *      [     LOG IN    ]   dark glass, thin light border
 *
 *  There is no "New to Zivo? Create account" line, on purpose.
 *
 *  Read it in 4 parts:
 *      1. the imports
 *      2. the artwork facts + the maths that keeps the buttons clear
 *      3. the screen
 *      4. the styles
 * ============================================================
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router'; // router.push / router.replace
import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============================================================
//  1. THE ARTWORK  — the two facts we need about your picture
// ============================================================
//  These two numbers come from the artwork file itself.
//  If you ever swap the picture for a new one with different
//  size, only these two lines change.
// ============================================================
const ART = {
  src: require('../../assets/zivo/getstarted.jpg'),

  // the picture's real pixel size
  w: 864,
  h: 1821,

  // where the picture's own words END (0.80 = 80% down the
  // picture). Below that line the artwork is dark and empty —
  // that is where our buttons are allowed to live.
  copyEnd: 0.8,
};

// ============================================================
//  2. THE SCREEN
// ============================================================
export default function GetStarted() {
  const insets = useSafeAreaInsets(); // the notch and the phone's home bar
  const screen = Dimensions.get('screen'); // the WHOLE physical screen

  // how tall our button block actually is — the phone tells us
  const [blockH, setBlockH] = useState(0);

  // ---- how the picture lands on this phone -------------------
  // "cover" means: scale the picture up until it fills the screen.
  // Which side gets cropped depends on the phone's shape.
  const scale = Math.max(screen.width / ART.w, screen.height / ART.h);
  const drawnH = ART.h * scale; // how tall the picture becomes
  const crop = Math.max(0, (drawnH - screen.height) / 2); // centred crop

  // where the picture's words end, in screen pixels
  const copyEndsAt = ART.copyEnd * drawnH - crop;

  // where our buttons start
  const buttonsStartAt = screen.height - blockH;

  // if the buttons would reach up into the words, slide the
  // picture up by exactly that much. Never more than 10%, so the
  // ZIVO logo at the top can never be cut off.
  const overlap = blockH > 0 ? Math.max(0, copyEndsAt + 12 - buttonsStartAt) : 0;
  const shiftUp = Math.min(crop + overlap, drawnH * 0.1);

  const picturePosition = shiftUp > 1 ? { top: shiftUp } : 'center';

  // ---- the two buttons ---------------------------------------
  // push = go forward; the phone's back button brings you back
  function startOnboarding() {
    router.push('/onboarding');
  }

  // replace = go forward and forget this screen, so the back
  // button does not return to the splash screen
  function goToApp() {
    router.replace('/(tabs)');
  }

  return (
    // the root tag spans the whole phone screen
    <View style={styles.root}>
      {/* ============================================================
          THE PICTURE
          Pinned to all four edges of the physical screen, so it runs
          behind the status bar and behind the home indicator.
          Colouring is NOT added on top of it — what you see is the
          artwork, plus the two buttons below.
      ============================================================ */}
      <View style={styles.bgLayer} pointerEvents="none">
        <Image
          source={ART.src}
          style={{ width: screen.width, height: screen.height }}
          contentFit="cover"
          contentPosition={picturePosition}
        />
      </View>

      {/* ============================================================
          THE BUTTONS  (these respect the safe areas)
      ============================================================ */}
      <View
        style={styles.column}
        onLayout={(e) => setBlockH(e.nativeEvent.layout.height)}
      >
        {/* the artwork needs the room — this pushes the buttons down */}
        <View style={{ flex: 1, minHeight: insets.top }} />

        <View
          style={[
            styles.buttons,
            { paddingBottom: Math.max(insets.bottom, 16) + 10 },
          ]}
        >
          {/* ---- GET STARTED ---- */}
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
              style={styles.goldInner}
            >
              <Text style={styles.goldText}>GET STARTED</Text>
              <Ionicons name="arrow-forward" size={19} color="#170B00" />
            </LinearGradient>
          </Pressable>

          {/* ---- LOG IN ---- */}
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
  // darkest edge, so a sliver can never look like a black strip.
  root: { flex: 1, backgroundColor: '#05030A' },

  // the picture layer, pinned to every edge of the screen
  bgLayer: { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 },

  // the column that holds the buttons at the bottom
  column: { flex: 1 },

  // the two buttons, with breathing room from the phone's home bar
  buttons: { paddingHorizontal: 24, gap: 11 },

  // --- GET STARTED ---
  // The glow lives on this OUTER view (an outer glow is cut off if
  // the view clips its children, so the rounded corners and the
  // clipping live on the inner gradient instead).
  goldOuter: {
    borderRadius: 14,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 5, // the two small corners give it that
    borderBottomRightRadius: 14, // angular, gaming look
    borderBottomLeftRadius: 5,
    boxShadow: '0 8px 20px rgba(255,110,0,0.45)', // the soft orange glow
  },
  goldInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
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

  // --- LOG IN ---
  darkBtn: {
    borderRadius: 14,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(10,10,18,0.55)',
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
