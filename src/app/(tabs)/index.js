/**
 * ============================================================
 *  ZIVO — PAGE 3: the HOME screen
 * ============================================================
 *  Read it top to bottom, in 4 parts:
 *    1. the imports
 *    2. the room list (HEROES) and the 3 quick buttons (ACTIONS)
 *    3. the screen
 *    4. the styles at the bottom
 *
 *  The hero carousel uses the SAME trick as the intro pages:
 *  a horizontal ScrollView that stops on each card. You already
 *  know how to read it.
 * ============================================================
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ------------------------------------------------------------
//  THE FEATURED CARDS at the top (swipe sideways)
// ------------------------------------------------------------
const HEROES = [
  {
    art: require('../../../assets/zivo/hero-3.jpg'),
    title: 'Weekly Clash',
    prize: '15,000 Coins',
    players: '128 / 256 Players',
    when: 'Starts: Today, 7:00 PM',
  },
  {
    art: require('../../../assets/zivo/hero-1.jpg'),
    title: 'Phantom Invitational',
    prize: '₦25,000',
    players: '42 / 48 Players',
    when: 'Starts: Tonight, 9:30 PM',
  },
  {
    art: require('../../../assets/zivo/hero-2.jpg'),
    title: 'Clash Squad Cup',
    prize: '₦15,000',
    players: '26 / 32 Players',
    when: 'Starts: Tomorrow, 8:00 PM',
  },
];

// ------------------------------------------------------------
//  THE 3 QUICK BUTTONS
// ------------------------------------------------------------
const ACTIONS = [
  { key: 'tournaments', label: 'Tournaments', sub: 'Join 4 & compete', icon: 'trophy', tint: '#FFC529' },
  { key: 'leaderboard', label: 'Leaderboard', sub: 'Top Players', icon: 'podium', tint: '#7C5CFF' },
  { key: 'host', label: 'Host Room', sub: 'Create Your Own', icon: 'add-circle', tint: '#22C55E' },
];

// ------------------------------------------------------------
//  LIVE & ONGOING cards (the small row under the buttons)
// ------------------------------------------------------------
const LIVE_CARDS = [
  {
    img: require('../../../assets/zivo/hero-1.jpg'),
    tag: 'LIVE',
    tagColour: '#EF4444',
    name: 'Solo Showdown',
    when: 'BR · 42/48 · Round 2',
    prize: '₦25,000',
    button: 'Watch',
  },
  {
    img: require('../../../assets/zivo/hero-2.jpg'),
    tag: 'CHECK-IN OPEN',
    tagColour: '#F59E0B',
    name: 'Squad Clash',
    when: 'CS · 4v4 · 26/32',
    prize: '₦15,000',
    button: 'Join',
  },
];

// ------------------------------------------------------------
//  THE SCREEN
// ------------------------------------------------------------
export default function Home() {
  const insets = useSafeAreaInsets();

  // which featured card we are showing (for the dots)
  const [hero, setHero] = useState(0);

  // the width of one featured card — the phone tells us below
  const [size, setSize] = useState({ w: 0, h: 0 });
  const cardWidth = size.w - 32; // 16 of space on each side

  function handleHeroScroll(event) {
    if (!cardWidth) return;
    const which = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
    if (which !== hero) setHero(which);
  }

  function onQuickAction(key) {
    if (key === 'tournaments') {
      router.push('/(tabs)/tournaments');
    } else if (key === 'leaderboard') {
      Alert.alert('Leaderboard', 'The rankings screen is one of the next pages.');
    } else {
      Alert.alert('Host a tournament', 'The host wizard is coming next.');
    }
  }

  return (
    <View style={styles.screen} onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {/* ---------- top bar: ZIVO + icons + avatar ---------- */}
        <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.brand}>ZIVO</Text>
            <Text style={styles.brandSub}>COMPETE · EARN · GROW</Text>
          </View>

          <Ionicons name="search" size={19} color="#C9C9DC" style={styles.headerIcon} />

          <View>
            <Ionicons name="notifications-outline" size={19} color="#C9C9DC" style={styles.headerIcon} />
            <View style={styles.dot} />
          </View>

          <Image source={require('../../../assets/zivo/avatar.jpg')} style={styles.avatar} contentFit="cover" />
        </View>

        {/* ---------- the 3 featured cards, swipe sideways ---------- */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleHeroScroll}
          scrollEventThrottle={16}
          snapToInterval={cardWidth}
          decelerationRate="fast"
        >
          {HEROES.map((h) => (
            <View key={h.title} style={[styles.heroCard, { width: cardWidth }]}>
              <Image source={h.art} style={StyleSheet.absoluteFill} contentFit="cover" />

              {/* dark fade on the LEFT so the words stay readable */}
              <LinearGradient
                colors={['rgba(8,8,15,0.96)', 'rgba(8,8,15,0.72)', 'rgba(8,8,15,0.12)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={StyleSheet.absoluteFill}
              />

              <View style={styles.heroInner}>
                <View style={styles.featPill}>
                  <Text style={styles.featText}>★ FEATURED TOURNAMENT</Text>
                </View>

                <Text style={styles.freeFire}>
                  FREE <Text style={{ color: '#FF8A00' }}>FIRE</Text>
                </Text>

                <Text style={styles.heroTitle}>{h.title}</Text>

                <View style={styles.metaRow}>
                  <Ionicons name="calendar-outline" size={13} color="#C9C9DC" />
                  <Text style={styles.heroMeta}>{h.when}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="people-outline" size={13} color="#C9C9DC" />
                  <Text style={styles.heroMeta}>{h.players}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="cash-outline" size={13} color="#FFC529" />
                  <Text style={styles.heroMeta}>Prize: {h.prize}</Text>
                </View>

                <OrangeButton
                  label="Join Now →"
                  onPress={() =>
                    Alert.alert(h.title, 'The tournament page is one of the next pages.')
                  }
                  style={{ width: 140, minHeight: 40, marginTop: 10 }}
                />
              </View>
            </View>
          ))}
        </ScrollView>

        {/* ---------- the 3 dots ---------- */}
        <View style={styles.heroDots}>
          {HEROES.map((h, i) => (
            <View key={h.title} style={[styles.heroDot, i === hero && styles.heroDotOn]} />
          ))}
        </View>

        {/* ---------- the 3 quick buttons ---------- */}
        <View style={styles.actions}>
          {ACTIONS.map((a) => (
            <Pressable
              key={a.key}
              onPress={() => onQuickAction(a.key)}
              style={({ pressed }) => [
                styles.action,
                { borderColor: a.tint + '66' }, // '66' = see-through
                pressed && { opacity: 0.9 },
              ]}
            >
              <View style={[styles.actionIcon, { backgroundColor: a.tint + '24' }]}>
                <Ionicons name={a.icon} size={22} color={a.tint} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
              <Text style={styles.actionSub}>{a.sub}</Text>
            </Pressable>
          ))}
        </View>

        {/* ---------- LIVE & ONGOING ---------- */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Live & Ongoing</Text>
          <Text style={styles.sectionAction}>See All →</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.liveRow}>
          {LIVE_CARDS.map((c) => (
            <View key={c.name} style={styles.liveCard}>
              <View style={styles.liveArt}>
                <Image source={c.img} style={StyleSheet.absoluteFill} contentFit="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(8,8,15,0.95)']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={[styles.liveTag, { backgroundColor: c.tagColour }]}>
                  <Text style={styles.liveTagText}>{c.tag}</Text>
                </View>
              </View>

              <View style={styles.liveBody}>
                <Text style={styles.liveName}>{c.name}</Text>
                <Text style={styles.liveWhen}>{c.when}</Text>
                <Text style={styles.livePrize}>PRIZE · {c.prize}</Text>
                <OrangeButton
                  label={c.button}
                  style={{ minHeight: 38 }}
                  onPress={() =>
                    Alert.alert(
                      c.name,
                      c.button === 'Watch'
                        ? 'Live room: the round, who is alive, the live score.'
                        : 'Tournament page: prize, rules, slots left, one big JOIN.'
                    )
                  }
                />
              </View>
            </View>
          ))}
        </ScrollView>

        {/* ---------- your progress ---------- */}
        <View style={styles.duo}>
          <View style={styles.duoCard}>
            <Text style={styles.duoLvl}>Lv. 12</Text>
            <Text style={styles.duoTitle}>340 / 600 XP</Text>
            <View style={styles.xpBar}>
              <View style={styles.xpFill} />
            </View>
            <View style={styles.duoStats}>
              <Stat n="45" l="TOURNAMENTS" />
              <Stat n="12" l="WINS" />
              <Stat n="3.2" l="K/D" />
            </View>
          </View>

          <View style={[styles.duoCard, styles.duoReward]}>
            <Text style={styles.duoTiny}>NEXT REWARD</Text>
            <Text style={styles.duoBig}>+50 Coins</Text>
            <Text style={styles.duoTitle}>Reach Lv. 15 to unlock</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ------------------------------------------------------------
//  small pieces used above
// ------------------------------------------------------------
function Stat({ n, l }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={styles.statN}>{n}</Text>
      <Text style={styles.statL}>{l}</Text>
    </View>
  );
}

/** the orange button — same one as pages 1 and 2 */
function OrangeButton({ label, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && { opacity: 0.88 }, style]}
    >
      <LinearGradient
        colors={['#FFC529', '#FF6A00']}
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
//  THE STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#08080F' },

  // --- top bar ---
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 12 },
  brand: { fontFamily: 'BebasNeue', fontSize: 26, letterSpacing: 3, color: '#F4F4F8' },
  brandSub: { fontFamily: 'Rajdhani-Bold', fontSize: 8.5, letterSpacing: 2, color: '#5C5C76', marginTop: -2 },
  headerIcon: { padding: 9, backgroundColor: '#13131E', borderRadius: 11, borderWidth: 1, borderColor: '#2A2A3E' },
  dot: { position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: 4, backgroundColor: '#EF4444' },
  avatar: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: '#22C55E' },

  // --- featured card ---
  heroCard: { height: 232, marginLeft: 16, borderRadius: 20, overflow: 'hidden', backgroundColor: '#13131E' },
  heroInner: { flex: 1, justifyContent: 'center', paddingHorizontal: 18 },
  featPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(124,92,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(124,92,255,0.5)',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  featText: { fontFamily: 'Rajdhani-Bold', fontSize: 9, letterSpacing: 1, color: '#B9A6FF' },
  freeFire: { fontFamily: 'BebasNeue', fontSize: 30, letterSpacing: 1, color: '#F4F4F8' },
  heroTitle: { fontFamily: 'Rajdhani-Bold', fontSize: 17, color: '#F4F4F8', marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  heroMeta: { fontFamily: 'Rajdhani-SemiBold', fontSize: 11.5, color: '#C9C9DC' },

  heroDots: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 12 },
  heroDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.22)' },
  heroDotOn: { backgroundColor: '#FFC529', width: 18 },

  // --- the 3 quick buttons ---
  actions: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 18 },
  action: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#13131E',
    borderWidth: 1,
  },
  actionIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontFamily: 'Rajdhani-Bold', fontSize: 13.5, color: '#F4F4F8', marginTop: 8 },
  actionSub: { fontFamily: 'Rajdhani-Medium', fontSize: 10, color: '#8B8BA5', marginTop: 1 },

  // --- section heading ---
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 22, marginBottom: 12 },
  sectionTitle: { fontFamily: 'BebasNeue', fontSize: 22, letterSpacing: 0.6, color: '#F4F4F8' },
  sectionAction: { fontFamily: 'Rajdhani-SemiBold', fontSize: 12, color: '#8B8BA5' },

  // --- live cards ---
  liveRow: { paddingHorizontal: 16, gap: 12 },
  liveCard: { width: 232, borderRadius: 18, overflow: 'hidden', backgroundColor: '#13131E', borderWidth: 1, borderColor: '#2A2A3E' },
  liveArt: { height: 108 },
  liveTag: { position: 'absolute', top: 10, left: 10, borderRadius: 100, paddingHorizontal: 9, paddingVertical: 3 },
  liveTagText: { fontFamily: 'Rajdhani-Bold', fontSize: 9, letterSpacing: 0.8, color: '#0B0B12' },
  liveBody: { padding: 12 },
  liveName: { fontFamily: 'Rajdhani-Bold', fontSize: 15, color: '#F4F4F8' },
  liveWhen: { fontFamily: 'Rajdhani-Medium', fontSize: 11.5, color: '#8B8BA5', marginTop: 2 },
  livePrize: { fontFamily: 'Rajdhani-Bold', fontSize: 12, color: '#FFC529', marginTop: 6, marginBottom: 9 },

  // --- progress duo ---
  duo: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginTop: 22 },
  duoCard: { flex: 1, backgroundColor: '#13131E', borderRadius: 16, borderWidth: 1, borderColor: '#2A2A3E', padding: 14 },
  duoReward: { borderColor: 'rgba(255,197,41,0.35)' },
  duoLvl: { fontFamily: 'BebasNeue', fontSize: 21, color: '#FFC529' },
  duoTitle: { fontFamily: 'Rajdhani-SemiBold', fontSize: 11, color: '#8B8BA5', marginTop: 2 },
  duoTiny: { fontFamily: 'Rajdhani-Bold', fontSize: 9, letterSpacing: 1, color: '#8B8BA5' },
  duoBig: { fontFamily: 'BebasNeue', fontSize: 24, color: '#FFC529', marginTop: 4 },
  xpBar: { height: 5, borderRadius: 3, backgroundColor: '#2A2A3E', marginTop: 10, overflow: 'hidden' },
  xpFill: { width: '57%', height: '100%', backgroundColor: '#FFC529' },
  duoStats: { flexDirection: 'row', marginTop: 12 },
  statN: { fontFamily: 'Rajdhani-Bold', fontSize: 14, color: '#F4F4F8' },
  statL: { fontFamily: 'Rajdhani-Medium', fontSize: 8, color: '#5C5C76', marginTop: 1 },

  // --- the button ---
  btn: { width: '100%', borderRadius: 13, overflow: 'hidden', justifyContent: 'center' },
  btnInner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  btnText: { fontFamily: 'Rajdhani-Bold', fontSize: 14.5, color: '#171000' },
});
