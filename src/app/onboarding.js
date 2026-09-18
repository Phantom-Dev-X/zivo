/**
 * ============================================================
 *  ZIVO — PAGE 2: the intro pages (onboarding)
 * ============================================================
 *  Seven pages you swipe through, one picture each.
 *  Everything for this screen is inside THIS ONE FILE.
 *
 *  HOW IT WORKS (the only new idea on this page):
 *  > it is ONE wide row of 7 panels inside a ScrollView
 *  > `pagingEnabled` makes the scroll stop neatly on each panel
 *  > so swiping = scrolling sideways
 *  > the Next button just scrolls to the next panel
 *  > the dots at the bottom show which panel you are on
 *
 *  TO CHANGE A PANEL: edit the PANELS list below. That is all.
 *  To make an 8th panel, copy one block and change the picture
 *  and the words. Nothing else in the file needs touching.
 * ============================================================
 */

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ------------------------------------------------------------
//  THE 7 PANELS — change the words or the pictures here
//  heading: an array of lines. The line with `hot: true` is orange.
// ------------------------------------------------------------
const PANELS = [
  {
    image: require('../../assets/zivo/ob-1.jpg'),
    heading: [
      { text: 'PLAY', hot: false },
      { text: 'BIGGER', hot: true },
      { text: 'TOGETHER', hot: false },
    ],
    body: 'Tournaments. Rewards. Community. All in one place.',
  },
  {
    image: require('../../assets/zivo/ob-2.jpg'),
    heading: [
      { text: 'COMPETE IN', hot: false },
      { text: 'TOURNAMENTS', hot: true },
    ],
    body: 'Join tournaments, test your skills and win prizes put up by the host.',
  },
  {
    image: require('../../assets/zivo/ob-3.jpg'),
    heading: [
      { text: 'CONNECT WITH', hot: false },
      { text: 'THE COMMUNITY', hot: true },
    ],
    body: 'Meet players, make friends and be part of something bigger.',
  },
  {
    image: require('../../assets/zivo/ob-4.jpg'),
    heading: [
      { text: 'EARN REWARDS', hot: false },
      { text: '& LEVEL UP', hot: true },
    ],
    body: 'Complete challenges, win tournaments and get rewarded for your grind.',
  },
  {
    image: require('../../assets/zivo/ob-5.jpg'),
    heading: [
      { text: 'BE A ZIVO', hot: false },
      { text: 'CREATOR', hot: true },
    ],
    body: 'Share your clips, build an audience and turn your passion into something.',
  },
  {
    image: require('../../assets/zivo/ob-6.jpg'),
    heading: [
      { text: 'WATCH LIVE', hot: false },
      { text: '& STAY UPDATED', hot: true },
    ],
    body: 'Follow live rooms, watch the score move and never miss a match.',
  },
  {
    image: require('../../assets/zivo/ob-7.jpg'),
    heading: [
      { text: 'BUILD YOUR', hot: false },
      { text: 'PROFILE', hot: true },
    ],
    body: 'Track your progress, show your skills and let the world know who you are.',
  },
];

// ------------------------------------------------------------
//  THE SCREEN
// ------------------------------------------------------------
export default function Onboarding() {
  // insets = how far the notch and the home bar stick in
  const insets = useSafeAreaInsets();

  // How big each panel is. We get this from onLayout below — the
  // phone tells us its own size the moment the screen draws.
  // Every panel is exactly one screen wide, which is what makes the
  // swiping line up perfectly.
  const [size, setSize] = useState({ w: 0, h: 0 });

  // scroller = a handle on the ScrollView, so the Next button can
  // tell it "scroll to panel 4" without the user swiping.
  const scroller = useRef(null);

  // index = which panel we are on right now (0 to 6)
  const [index, setIndex] = useState(0);

  const isLastPanel = index === PANELS.length - 1;

  // Runs every time the user swipes. We work out which panel is
  // nearest and remember it, so the dots and button stay correct.
  function handleScroll(event) {
    if (!size.w) return;
    const which = Math.round(event.nativeEvent.contentOffset.x / size.w);
    if (which !== index) {
      setIndex(which);
    }
  }

  // The Next button. On the last panel it goes into the app instead.
  function handleNext() {
    if (isLastPanel) {
      goIntoApp();
      return;
    }
    const to = index + 1;
    scroller.current?.scrollTo({ x: to * size.w, animated: true });
    setIndex(to);
  }

  // Where "you are in" leads. replace (not push) so that pressing
  // the phone's back button does not throw you back into the intro.
  function goIntoApp() {
    router.replace('/(tabs)');
  }

  return (
    <View style={styles.screen}>
      {/* ---------- the 7 panels, side by side ---------- */}
      <ScrollView
        ref={scroller}
        onLayout={(e) =>
          setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })
        }
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {PANELS.map((panel) => (
          // every panel is exactly one screen big
          <View key={panel.body} style={{ width: size.w, height: size.h }}>
            {/* the picture, inside a rounded card */}
            <View style={styles.art}>
              <Image
                source={panel.image}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />
              {/* the fade so the words at the bottom stay readable */}
              <LinearGradient
                colors={['rgba(8,8,15,0.05)', 'rgba(8,8,15,0.55)', '#08080F']}
                locations={[0, 0.62, 1]}
                style={StyleSheet.absoluteFill}
              />
            </View>

            {/* the words under the picture */}
            <View style={styles.text}>
              {panel.heading.map((line) => (
                <Text
                  key={line.text}
                  style={[styles.big, line.hot && styles.bigHot]}
                >
                  {line.text}
                </Text>
              ))}
              <Text style={styles.body}>{panel.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ---------- "Skip" in the top right corner ---------- */}
      <Pressable
        onPress={goIntoApp}
        style={[styles.skip, { top: insets.top + 12 }]}
        hitSlop={12}
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      {/* ---------- the dots + the big button at the bottom ---------- */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.dots}>
          {PANELS.map((panel, i) => (
            <View key={panel.body} style={[styles.dot, i === index && styles.dotOn]} />
          ))}
        </View>

        <OrangeButton
          label={isLastPanel ? 'Create my account' : 'Next'}
          onPress={handleNext}
        />
      </View>
    </View>
  );
}

// ------------------------------------------------------------
//  THE ORANGE BUTTON (same one as the Get Started page)
// ------------------------------------------------------------
function OrangeButton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && { opacity: 0.88 }]}
    >
      <LinearGradient
        colors={['#FFC529', '#FF6A00']} // <-- the button colour
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.btnInner}
      >
        <Text style={styles.btnText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

// ------------------------------------------------------------
//  THE STYLES — every look on this page is here
// ------------------------------------------------------------
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#08080F' },

  // the picture card: rounded, with a thin grey border
  art: {
    flex: 1,
    marginHorizontal: 14,
    marginTop: 64,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#140F22',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },

  text: { paddingHorizontal: 26, paddingTop: 22 },

  // the big headings (Bebas Neue, from _layout.js)
  big: {
    fontFamily: 'BebasNeue',
    fontSize: 38,
    lineHeight: 40,
    color: '#F4F4F8',
    letterSpacing: 0.4,
  },
  bigHot: { color: '#FF6A00' }, // the orange line

  body: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 12.5,
    lineHeight: 20,
    color: '#8B8BA5',
    marginTop: 12,
    maxWidth: 320,
  },

  skip: { position: 'absolute', right: 24, paddingVertical: 6, paddingHorizontal: 10 },
  skipText: { fontFamily: 'Rajdhani-Bold', fontSize: 12.5, color: '#5C5C76' },

  footer: { paddingHorizontal: 26, paddingTop: 4 },

  // the row of little dots
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 18 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.22)' },
  dotOn: { backgroundColor: '#FF6A00', width: 20 }, // the one you are on

  // the button
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
  btnText: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 15,
    letterSpacing: 0.3,
    color: '#171000',
  },
});
