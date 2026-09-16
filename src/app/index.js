/**
 * ============================================================
 *  ZIVO  —  PAGE 1: the "Get Started" screen
 * ============================================================
 *  Everything for this page is inside THIS ONE FILE.
 *  Nothing is hidden somewhere else. Read it top to bottom:
 *
 *    part 1 — the imports (the tools this page needs)
 *    part 2 — the screen itself
 *    part 3 — the two buttons (small parts written right here)
 *    part 4 — the styles (all the looks, at the bottom)
 *
 *  Only 4 colours matter on this page, and they are written
 *  where you can see them:
 *     #FFC529 / #FF6A00  the orange of the button
 *     #08080F           the screen background
 *     #F4F4F8           normal white text
 *     #C9C9DC / #84849C grey text (the small lines)
 * ============================================================
 */

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router'; // router.push / router.replace
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ------------------------------------------------------------
//  PART 2 — THE SCREEN
// ------------------------------------------------------------
export default function GetStarted() {
  // insets = how far the phone's notch and home bar stick into the
  // screen. We use it so nothing hides behind them.
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      {/* 1. THE PICTURE — fills the whole screen */}
      <Image
        source={require('../../assets/zivo/splash.jpg')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />

      {/* 2. THE DARK FADE — sits on top of the picture so the white
             text stays readable. Delete this and the text disappears. */}
      <LinearGradient
        colors={[
          'rgba(6,6,12,0.86)',
          'rgba(6,6,12,0.24)',
          'rgba(6,6,12,0.42)',
          'rgba(6,6,12,0.94)',
          '#06060C',
        ]}
        locations={[0, 0.3, 0.58, 0.84, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* 3. THE LOGO + ZIVO + the small line under it */}
      <View style={[styles.logoWrap, { marginTop: insets.top + 80 }]}>
        <Image
          source={require('../../assets/zivo/mark.png')}
          style={styles.mark}
          resizeMode="contain"
        />
        <Text style={styles.brand}>ZIVO</Text>
        <Text style={styles.tagline}>PLAY · COMPETE · CONNECT · RISE</Text>
      </View>

      {/* 4. THE BOTTOM: one line of text and two buttons */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 28 }]}>
        <Text style={styles.pitch}>
          Host tournaments. Compete for rewards.{'\n'}Build your legend.
        </Text>

        {/* push = go forward, and the back button brings you back here */}
        <OrangeButton label="Get Started" onPress={() => router.push('/onboarding')} />

        <View style={{ height: 10 }} />

        {/* replace = go forward and forget this page (so back does not
            return to the splash screen) */}
        <DarkButton label="Log in" onPress={() => router.replace('/(tabs)')} />

        <Text style={styles.legal}>Independent platform · Not affiliated with Garena</Text>
      </View>
    </View>
  );
}

// ------------------------------------------------------------
//  PART 3 — THE TWO BUTTONS (little parts, right here in the file)
// ------------------------------------------------------------

/** The orange button. This is the main button of the whole app. */
function OrangeButton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
    >
      <LinearGradient
        colors={['#FFC529', '#FF6A00']} // <-- change these to change the colour
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.btnInner}
      >
        <Text style={[styles.btnText, { color: '#171000' }]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

/** The quiet see-through button (used for "Log in"). */
function DarkButton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, styles.btnDark, pressed && styles.btnPressed]}
    >
      <Text style={[styles.btnText, { color: '#F4F4F8' }]}>{label}</Text>
    </Pressable>
  );
}

// ------------------------------------------------------------
//  PART 4 — THE STYLES. Every look on this page is here.
//  Change a number, save, and your phone updates.
// ------------------------------------------------------------
const styles = StyleSheet.create({
  // flex: 1 = take up the whole screen
  // space-between = logo pushed to the top, buttons pushed to the bottom
  screen: {
    flex: 1,
    backgroundColor: '#08080F',
    justifyContent: 'space-between',
  },

  logoWrap: { alignItems: 'center' },
  mark: { width: 58, height: 58 },

  brand: {
    fontFamily: 'BebasNeue',
    fontSize: 42,
    letterSpacing: 9,
    color: '#F4F4F8',
    marginTop: 12,
  },

  tagline: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 10,
    letterSpacing: 2.4,
    color: '#C6C6DA',
    marginTop: 6,
  },

  bottom: { paddingHorizontal: 26 },

  pitch: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 12.5,
    lineHeight: 21,
    textAlign: 'center',
    color: '#C9C9DC',
    marginBottom: 16,
  },

  legal: {
    fontFamily: 'Rajdhani-Medium',
    fontSize: 10.5,
    textAlign: 'center',
    color: '#84849C',
    marginTop: 14,
  },

  // --- the buttons ---
  btn: {
    width: '100%',
    minHeight: 52,
    borderRadius: 13,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  btnInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  btnDark: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  btnPressed: { opacity: 0.88 },
});
