/**
 * ============================================================
 *  ZIVO — TOURNAMENTS  (the room list)
 * ============================================================
 *  This is where a player finds a room to join:
 *
 *      LIVE NOW        match don start — you can only WATCH
 *      CHECK-IN OPEN   confirm you are ready, get the room code
 *      THIS WEEK       room still open — tap JOIN
 *
 *  Read the file in 4 parts:
 *     1. the imports
 *     2. the DATA  (ROOMS = every tournament on the screen)
 *     3. the screen  (header, filters, then the 3 bands)
 *     4. the styles
 *
 *  THE FILTERS REALLY WORK. Tap FREE ENTRY and the list changes.
 *  Tap BATTLE ROYALE and only BR rooms stay. Tap both and you
 *  get free BR rooms only. The count at the top follows along.
 * ============================================================
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============================================================
//  1. THE DATA — every room on this screen
// ============================================================
//  stage    'live'    = started, entry closed, you can Watch
//           'checkin' = check-in window, get the room code
//           'soon'    = open for entry, you can Join
//  entry    'free' or 'elite'   (elite = you pay coins to enter)
//  mode     'br'   or 'cs'
// ============================================================
const ROOMS = [
  // ---------------- LIVE NOW ----------------
  {
    id: 'l1',
    stage: 'live',
    art: require('../../../assets/zivo/hero-1.jpg'),
    entry: 'free',
    entryLabel: 'FREE ENTRY',
    mode: 'br',
    name: 'Phantom Clash',
    host: 'host: PHANTOM_X',
    meta: 'BR · Squad · 42/48',
    prize: '₦25,000',
    note: 'Round 2 · 24 watching',
  },
  {
    id: 'l2',
    stage: 'live',
    art: require('../../../assets/zivo/hero-3.jpg'),
    entry: 'free',
    entryLabel: 'FREE ENTRY',
    mode: 'cs',
    name: '9JA CS Showdown',
    host: 'host: KIDO_9JA',
    meta: 'CS · 4v4 · 31/32',
    prize: '₦15,000',
    note: 'Semi 3 · 11 watching',
  },
  {
    id: 'l3',
    stage: 'live',
    art: require('../../../assets/zivo/hero-2.jpg'),
    entry: 'elite',
    entryLabel: '500 COINS',
    mode: 'br',
    name: 'ZIVO Friday Night',
    host: 'host: ZIVO_OFFICIAL',
    meta: 'BR · Squad · 96/100',
    prize: '₦150,000',
    note: 'Round 1 · 58 watching',
  },

  // ---------------- CHECK-IN OPEN ----------------
  {
    id: 'c1',
    stage: 'checkin',
    art: require('../../../assets/zivo/hero-2.jpg'),
    entry: 'free',
    entryLabel: 'FREE ENTRY',
    mode: 'br',
    name: 'Midnight Snipers',
    host: 'host: ZEE_007',
    meta: 'BR · Solo · 18/48',
    prize: '₦5,000',
    closesIn: 8 * 60, // seconds until check-in closes
  },
  {
    id: 'c2',
    stage: 'checkin',
    art: require('../../../assets/zivo/hero-3.jpg'),
    entry: 'free',
    entryLabel: 'FREE ENTRY',
    mode: 'cs',
    name: 'Quick CS Ladder',
    host: 'host: TOLA',
    meta: 'CS · 4v4 · 14/16',
    prize: '3,000 Coins',
    closesIn: 4 * 60,
  },
  {
    id: 'c3',
    stage: 'checkin',
    art: require('../../../assets/zivo/hero-1.jpg'),
    entry: 'elite',
    entryLabel: '1,000 COINS',
    mode: 'br',
    name: 'Elite BR Cup',
    host: 'host: ZIVO_OFFICIAL',
    meta: 'BR · Squad · 30/48',
    prize: '₦50,000',
    closesIn: 22 * 60,
  },

  // ---------------- THIS WEEK (open for entry) ----------------
  {
    id: 's1',
    stage: 'soon',
    art: require('../../../assets/zivo/ob-2.jpg'),
    entry: 'free',
    entryLabel: 'FREE ENTRY',
    mode: 'br',
    name: 'Squad Up Friday',
    host: 'host: LUIBUOY',
    meta: 'BR · Squad · 27/48',
    prize: '₦10,000',
    when: 'Tomorrow · 7:00 PM',
  },
  {
    id: 's2',
    stage: 'soon',
    art: require('../../../assets/zivo/ob-6.jpg'),
    entry: 'free',
    entryLabel: 'FREE ENTRY',
    mode: 'br',
    name: 'Saturday Showdown',
    host: 'host: NAJA_PROD',
    meta: 'BR · Squad · 44/64',
    prize: '₦100,000',
    when: 'Sat 20 Sep · 6:00 PM',
  },
  {
    id: 's3',
    stage: 'soon',
    art: require('../../../assets/zivo/ob-7.jpg'),
    entry: 'free',
    entryLabel: 'FREE ENTRY',
    mode: 'cs',
    name: 'CS King Hill',
    host: 'host: NASTY_9JA',
    meta: 'CS · 4v4 · 20/32',
    prize: '₦20,000',
    when: 'Sat 20 Sep · 8:00 PM',
  },
  {
    id: 's4',
    stage: 'soon',
    art: require('../../../assets/zivo/ob-4.jpg'),
    entry: 'elite',
    entryLabel: '250 COINS',
    mode: 'br',
    name: 'Rookie Room',
    host: 'host: MOSTFUN',
    meta: 'BR · Squad · 9/48',
    prize: '1,500 Coins',
    when: 'Sun 21 Sep · 5:00 PM',
  },
  {
    id: 's5',
    stage: 'soon',
    art: require('../../../assets/zivo/ob-1.jpg'),
    entry: 'elite',
    entryLabel: '300 COINS',
    mode: 'br',
    name: 'Sunday Solo Rush',
    host: 'host: LASGIDI_PRO',
    meta: 'BR · Solo · 33/50',
    prize: '₦7,500',
    when: 'Sun 21 Sep · 4:00 PM',
  },
  {
    id: 's6',
    stage: 'soon',
    art: require('../../../assets/zivo/ob-5.jpg'),
    entry: 'elite',
    entryLabel: '1,500 COINS',
    mode: 'br',
    name: 'ZIVO Sunday Showcase',
    host: 'host: ZIVO_OFFICIAL',
    meta: 'BR · Squad · 44/64',
    prize: '₦75,000',
    when: 'Sun 21 Sep · 8:00 PM',
  },
  {
    id: 's7',
    stage: 'soon',
    art: require('../../../assets/zivo/ob-3.jpg'),
    entry: 'free',
    entryLabel: 'FREE ENTRY',
    mode: 'cs',
    name: 'Clash Squad Night',
    host: 'host: SEVEN_X',
    meta: 'CS · 4v4 · 32/32',
    prize: '₦5,000',
    when: 'Mon 22 Sep · 9:00 PM',
  },
];

/** The two filter rows at the top. */
const ENTRY_FILTERS = [
  { key: 'all', label: 'ALL' },
  { key: 'free', label: 'FREE ENTRY' },
  { key: 'elite', label: 'ELITE' },
];

const MODE_FILTERS = [
  { key: 'all', label: 'ALL MODES' },
  { key: 'br', label: 'BATTLE ROYALE' },
  { key: 'cs', label: 'CLASH SQUAD' },
];

/** the 3 bands, in the order they appear on the screen */
const BANDS = [
  {
    stage: 'live',
    title: 'LIVE NOW',
    badge: 'RUNNING',
    blurb: 'Match don start — entry closed. Tap a room to watch and follow the score.',
  },
  {
    stage: 'checkin',
    title: 'CHECK-IN OPEN',
    badge: 'ROOMS',
    blurb: 'Confirm say you ready, then collect the room code. E close 15 minutes before match.',
  },
  {
    stage: 'soon',
    title: 'THIS WEEK',
    badge: 'COMING',
    blurb: 'Room still open. Grab your slot before e full up.',
  },
];

// ============================================================
//  2. THE SCREEN
// ============================================================
export default function Tournaments() {
  const insets = useSafeAreaInsets();

  // the two filters the player picked
  const [entry, setEntry] = useState('all');
  const [mode, setMode] = useState('all');

  // apply the filters to the room list
  const shown = ROOMS.filter((r) => {
    const entryOk = entry === 'all' || r.entry === entry;
    const modeOk = mode === 'all' || r.mode === mode;
    return entryOk && modeOk;
  });

  const liveCount = ROOMS.filter((r) => r.stage === 'live').length;
  const nothing = shown.length === 0;

  function soon(title, body) {
    Alert.alert(title, body);
  }

  /** what happens when you tap the button on a card */
  function onAction(room) {
    if (room.stage === 'live') {
      return soon(
        room.name,
        'Match don start. You go enter the watcher room — see the round, who still dey alive, and the live score. You no fit join again.'
      );
    }
    if (room.stage === 'checkin') {
      return soon(
        room.name,
        'Check in now to lock your slot and collect the room code. If you no check in, your slot go open for another player.'
      );
    }
    return soon(
      room.name,
      'Room detail: prize, rules, slots left, entry fee — then one big JOIN.'
    );
  }

  const actionLabel = { live: 'Watch', checkin: 'Check in', soon: 'Join' };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* ============================================================
            HEADER — the big title band
        ============================================================ */}
        <View style={styles.header}>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.livePillText}>{liveCount} LIVE NOW</Text>
          </View>

          <Text style={styles.title}>TOURNAMENTS</Text>
          <Text style={styles.subtitle}>
            Find a room. Join. Win the host's prize.
          </Text>
        </View>

        {/* ============================================================
            THE FILTERS  (two rows of chips)
        ============================================================ */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {ENTRY_FILTERS.map((f) => (
            <Chip
              key={f.key}
              label={f.label}
              on={entry === f.key}
              tint="#FFC529"
              onPress={() => setEntry(f.key)}
            />
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {MODE_FILTERS.map((f) => (
            <Chip
              key={f.key}
              label={f.label}
              on={mode === f.key}
              tint="#7C5CFF"
              onPress={() => setMode(f.key)}
            />
          ))}
        </ScrollView>

        {/* how many rooms survived the filters */}
        <Text style={styles.showing}>
          SHOWING {shown.length} {shown.length === 1 ? 'TOURNAMENT' : 'TOURNAMENTS'}
        </Text>

        {/* ============================================================
            THE EMPTY STATE — filters matched nothing
        ============================================================ */}
        {nothing ? (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={32} color="#5C5C76" />
            <Text style={styles.emptyTitle}>No room match</Text>
            <Text style={styles.emptyBody}>
              Nothing dey for this filter combo. Try another one, or host your own room.
            </Text>
            <Pressable
              onPress={() => {
                setEntry('all');
                setMode('all');
              }}
              style={({ pressed }) => [styles.emptyBtn, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.emptyBtnText}>Clear filters</Text>
            </Pressable>
          </View>
        ) : null}

        {/* ============================================================
            THE 3 BANDS — live, check-in, this week
        ============================================================ */}
        {BANDS.map((band) => {
          const rooms = shown.filter((r) => r.stage === band.stage);
          if (rooms.length === 0) return null; // hide a band that has nothing

          return (
            <View key={band.stage}>
              <View style={styles.bandHead}>
                <View style={styles.bandTitleRow}>
                  {band.stage === 'live' ? <View style={styles.bandDot} /> : null}
                  <Text style={styles.bandTitle}>{band.title}</Text>
                  <View style={styles.bandBadge}>
                    <Text style={styles.bandBadgeText}>
                      {rooms.length} {band.badge}
                    </Text>
                  </View>
                </View>
                <Text style={styles.bandBlurb}>{band.blurb}</Text>
              </View>

              {rooms.map((r) => (
                <View key={r.id} style={styles.card}>
                  {/* --- left: the picture --- */}
                  <View style={styles.cardArt}>
                    <Image source={r.art} style={StyleSheet.absoluteFill} contentFit="cover" />
                    <LinearGradient
                      colors={['transparent', 'rgba(8,8,15,0.75)']}
                      style={StyleSheet.absoluteFill}
                    />

                    {r.stage === 'live' ? (
                      <View style={[styles.tagPill, { backgroundColor: '#EF4444' }]}>
                        <Text style={styles.tagPillText}>LIVE</Text>
                      </View>
                    ) : null}

                    {r.stage === 'checkin' ? (
                      <View style={[styles.tagPill, { backgroundColor: '#F59E0B' }]}>
                        <Text style={styles.tagPillText}>CHECK-IN</Text>
                      </View>
                    ) : null}

                    {r.stage === 'soon' ? (
                      <View style={[styles.tagPill, { backgroundColor: '#7C5CFF' }]}>
                        <Text style={styles.tagPillText}>OPEN</Text>
                      </View>
                    ) : null}
                  </View>

                  {/* --- right: everything about the room --- */}
                  <View style={styles.cardBody}>
                    <View style={styles.cardTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardName} numberOfLines={1}>{r.name}</Text>
                        <Text style={styles.cardHost} numberOfLines={1}>{r.host}</Text>
                      </View>

                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.cardPrize}>{r.prize}</Text>
                        <Text
                          style={[
                            styles.entryTag,
                            { color: r.entry === 'free' ? '#22C55E' : '#B9A6FF' },
                          ]}
                        >
                          {r.entryLabel}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.metaRow}>
                      <Ionicons
                        name={r.mode === 'br' ? 'earth-outline' : 'people-outline'}
                        size={12}
                        color="#8B8BA5"
                      />
                      <Text style={styles.cardMeta} numberOfLines={1}>{r.meta}</Text>
                    </View>

                    {/* the extra line: round + watchers, or check-in clock, or the date */}
                    {r.stage === 'live' ? (
                      <Text style={styles.cardNote}>{r.note}</Text>
                    ) : null}

                    {r.stage === 'checkin' ? (
                      <View style={styles.clockRow}>
                        <Ionicons name="time-outline" size={12} color="#F59E0B" />
                        <Text style={styles.clockText}>
                          Check-in closes in <Countdown seconds={r.closesIn} />
                        </Text>
                      </View>
                    ) : null}

                    {r.stage === 'soon' ? (
                      <View style={styles.clockRow}>
                        <Ionicons name="calendar-outline" size={12} color="#8B8BA5" />
                        <Text style={styles.dateText}>{r.when}</Text>
                      </View>
                    ) : null}

                    {/* --- the button: Watch / Check in / Join --- */}
                    <ActionButton
                      label={actionLabel[r.stage]}
                      stage={r.stage}
                      onPress={() => onAction(r)}
                    />
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        <Text style={styles.footer}>
          Independent platform · Not affiliated with Garena
        </Text>
      </ScrollView>
    </View>
  );
}

// ============================================================
//  3. SMALL PIECES USED ABOVE
// ============================================================

/** one filter chip */
function Chip({ label, on, onPress, tint }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        on && { borderColor: tint, backgroundColor: tint + '1F' },
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.chipText, on && { color: tint }]}>{label}</Text>
    </Pressable>
  );
}

/**
 * The button on a card. Three looks for three stages:
 *   Watch    -> gold (this is the loud one)
 *   Check in -> amber
 *   Join     -> quiet outline (the room is not live yet)
 */
function ActionButton({ label, stage, onPress }) {
  if (stage === 'soon') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.ghostBtn, pressed && { opacity: 0.8 }]}
      >
        <Text style={styles.ghostBtnText}>{label}</Text>
      </Pressable>
    );
  }

  const colours =
    stage === 'live' ? ['#FFC529', '#FF6A00'] : ['#F59E0B', '#FF8A00'];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btn, pressed && { opacity: 0.88 }]}>
      <LinearGradient
        colors={colours}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.btnInner}
      >
        <Text style={styles.btnText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

/** A clock that counts itself down, one tick per second. */
function Countdown({ seconds }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id); // stop when we leave the screen
  }, []);

  const m = Math.floor(left / 60);
  const s = String(left % 60).padStart(2, '0');

  return <Text style={styles.clockText}>{m}:{s}</Text>;
}

// ============================================================
//  4. THE STYLES
// ============================================================
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#08080F' },
  scrollBody: { paddingBottom: 28 },

  // --- header ---
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.5)',
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  livePillText: { fontFamily: 'Rajdhani-Bold', fontSize: 9.5, letterSpacing: 1, color: '#EF4444' },
  title: { fontFamily: 'BebasNeue', fontSize: 36, letterSpacing: 1, color: '#F4F4F8' },
  subtitle: { fontFamily: 'Rajdhani-SemiBold', fontSize: 12.5, color: '#8B8BA5', marginTop: 2 },

  // --- filters ---
  chipRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 10 },
  chip: {
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
    borderRadius: 100,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  chipText: { fontFamily: 'Rajdhani-Bold', fontSize: 11, letterSpacing: 0.6, color: '#8B8BA5' },
  showing: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 9.5,
    letterSpacing: 1.4,
    color: '#5C5C76',
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 4,
  },

  // --- band heading ---
  bandHead: { paddingHorizontal: 16, marginTop: 20, marginBottom: 10 },
  bandTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bandDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#EF4444' },
  bandTitle: { fontFamily: 'BebasNeue', fontSize: 22, letterSpacing: 0.6, color: '#F4F4F8' },
  bandBadge: {
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
    borderRadius: 100,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  bandBadgeText: { fontFamily: 'Rajdhani-Bold', fontSize: 9, letterSpacing: 0.8, color: '#8B8BA5' },
  bandBlurb: { fontFamily: 'Rajdhani-Medium', fontSize: 11, color: '#5C5C76', marginTop: 3 },

  // --- the room card ---
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#13131E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    overflow: 'hidden',
  },
  cardArt: { height: 104 },
  tagPill: {
    position: 'absolute',
    top: 9,
    left: 9,
    borderRadius: 100,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  tagPillText: { fontFamily: 'Rajdhani-Bold', fontSize: 8.5, letterSpacing: 0.8, color: '#0B0B12' },

  cardBody: { padding: 12 },
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  cardName: { fontFamily: 'Rajdhani-Bold', fontSize: 16, color: '#F4F4F8' },
  cardHost: { fontFamily: 'Rajdhani-Medium', fontSize: 10.5, color: '#8B8BA5', marginTop: 1 },
  cardPrize: { fontFamily: 'BebasNeue', fontSize: 19, color: '#FFC529' },
  entryTag: { fontFamily: 'Rajdhani-Bold', fontSize: 8.5, letterSpacing: 0.8, marginTop: 1 },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  cardMeta: { fontFamily: 'Rajdhani-SemiBold', fontSize: 11.5, color: '#C9C9DC' },
  cardNote: { fontFamily: 'Rajdhani-Medium', fontSize: 10.5, color: '#5C5C76', marginTop: 4 },

  clockRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  clockText: { fontFamily: 'Rajdhani-Bold', fontSize: 11, color: '#F59E0B' },
  dateText: { fontFamily: 'Rajdhani-Medium', fontSize: 11, color: '#8B8BA5' },

  // --- buttons ---
  btn: { width: '100%', borderRadius: 12, overflow: 'hidden', justifyContent: 'center', marginTop: 11 },
  btnInner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  btnText: { fontFamily: 'Rajdhani-Bold', fontSize: 13.5, color: '#171000' },
  ghostBtn: {
    width: '100%',
    borderWidth: 1.4,
    borderColor: 'rgba(255,197,41,0.6)',
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
    marginTop: 11,
  },
  ghostBtnText: { fontFamily: 'Rajdhani-Bold', fontSize: 13.5, color: '#FFC529' },

  // --- empty state ---
  empty: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
    alignItems: 'center',
  },
  emptyTitle: { fontFamily: 'Rajdhani-Bold', fontSize: 16, color: '#F4F4F8', marginTop: 10 },
  emptyBody: {
    fontFamily: 'Rajdhani-Medium',
    fontSize: 11.5,
    color: '#8B8BA5',
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 17,
  },
  emptyBtn: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,197,41,0.6)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  emptyBtnText: { fontFamily: 'Rajdhani-Bold', fontSize: 12.5, color: '#FFC529' },

  footer: {
    fontFamily: 'Rajdhani-Medium',
    fontSize: 10,
    color: '#3A3A4C',
    textAlign: 'center',
    marginTop: 18,
  },
});
