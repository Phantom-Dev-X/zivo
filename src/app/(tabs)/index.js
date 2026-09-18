/**
 * ============================================================
 *  ZIVO — HOME  (v2, the long scrolling home)
 * ============================================================
 *  This file is ONE screen. Read it top to bottom, in 4 parts:
 *
 *     1. the imports                    (what we borrow)
 *     2. the DATA blocks                (the words you edit)
 *     3. the screen                     (the 12 sections)
 *     4. the styles                     (colours + sizes)
 *
 *  The 12 sections, in order:
 *     1  header (ZIVO, search, bell, avatar)
 *     2  featured tournament (swipe the cards)
 *     3  quick actions (3 buttons)
 *     4  live & ongoing
 *     5  xp & rewards
 *     6  upcoming tournaments
 *     7  your performance
 *     8  earn more coins
 *     9  daily challenges
 *     10 top players today
 *     11 ZIVO updates
 *     12 ZIVO community
 *
 *  Every list of words lives in a const array near the top, so
 *  you change text in ONE place and it changes on the screen.
 * ============================================================
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============================================================
//  1. THE DATA  —  edit the words right here
// ============================================================

/** The big cards at the top. Swipe sideways through them. */
const HEROES = [
  {
    art: require('../../../assets/zivo/hero-1.jpg'),
    title: 'Weekly Clash',
    when: 'Starts: Today, 7:00 PM',
    players: '128 / 256 Players',
    prize: '15,000 Coins',
  },
  {
    art: require('../../../assets/zivo/hero-2.jpg'),
    title: 'Phantom Invitational',
    when: 'Starts: Tonight, 9:30 PM',
    players: '42 / 48 Players',
    prize: '₦25,000',
  },
  {
    art: require('../../../assets/zivo/hero-3.jpg'),
    title: 'Clash Squad Cup',
    when: 'Starts: Tomorrow, 8:00 PM',
    players: '26 / 32 Players',
    prize: '₦15,000',
  },
];

/** The 3 quick buttons under the featured card. */
const ACTIONS = [
  { key: 'tournaments', label: 'Tournaments', sub: 'Join & compete', icon: 'trophy', tint: '#FFC529' },
  { key: 'leaderboard', label: 'Leaderboard', sub: 'Top Players', icon: 'stats-chart', tint: '#7C5CFF' },
  { key: 'host', label: 'Host Room', sub: 'Create Your Own', icon: 'add-circle', tint: '#22C55E' },
];

/** Live & ongoing — the two cards side by side. */
const LIVE_CARDS = [
  {
    img: require('../../../assets/zivo/hero-1.jpg'),
    tag: 'LIVE',
    tint: '#EF4444',
    watching: '24 watching',
    name: 'Solo Showdown',
    meta: 'BR · 42/48 · Round 2',
    prize: '₦25,000',
    button: 'Watch',
  },
  {
    img: require('../../../assets/zivo/hero-2.jpg'),
    tag: 'CHECK-IN OPEN',
    tint: '#F59E0B',
    watching: 'closes soon',
    name: 'Squad Clash',
    meta: 'CS · 4v4 · 26/32',
    prize: '₦15,000',
    button: 'Join',
  },
];

/** Upcoming — the two cards under live. */
const UPCOMING = [
  {
    art: require('../../../assets/zivo/hero-3.jpg'), // the picture at the top of the card
    chipKind: 'countdown', // this one ticks live
    chip: 'STARTS IN',
    startIn: 2 * 60 * 60 + 15 * 60, // 2 hours 15 minutes, in seconds
    chipTint: '#22C55E',
    name: 'Clash Squad Night',
    meta: 'CS · 4v4 · 32/32',
    entry: '100',
    prize: '5,000',
  },
  {
    art: require('../../../assets/zivo/hero-2.jpg'),
    chipKind: 'time',
    chip: 'TOMORROW · 6:00 PM',
    chipTint: '#7C5CFF',
    name: 'Solo Battle',
    meta: 'BR · 1v1 · 128/128',
    entry: 'FREE',
    prize: '3,000',
  },
];

/** Your performance — the numbers row. */
const PERFORMANCE = [
  { icon: 'trophy', tint: '#FFC529', value: '3', label: 'Wins' },
  { icon: 'game-controller', tint: '#7C5CFF', value: '18', label: 'Matches' },
  { icon: 'flash', tint: '#22C55E', value: '420', label: 'XP earned' },
];

/** Win rate — the little ring on the right. */
const WIN_RATE = 16.7;

/** Earn more coins — the 3 tiles. */
const EARN = [
  {
    key: 'daily',
    icon: 'gift',
    tint: '#22C55E',
    label: 'Daily Bonus',
    sub: 'Claim once a day',
    reward: '+20',
    ready: true, // this one works today
  },
  {
    key: 'refer',
    icon: 'person-add',
    tint: '#7C5CFF',
    label: 'Refer Friends',
    sub: 'Invite a friend',
    reward: '+200',
    ready: false,
  },
  {
    key: 'share',
    icon: 'logo-whatsapp',
    tint: '#25D366',
    label: 'Share & Earn',
    sub: 'Post a room link',
    reward: '+50',
    ready: true, // opens your phone's share sheet
  },
];

/** Daily challenges — 3 rows with progress bars. */
const CHALLENGES = [
  { icon: 'game-controller-outline', tint: '#7C5CFF', label: 'Play 3 tournaments', done: 2, total: 3, reward: '+100 XP' },
  { icon: 'trophy-outline', tint: '#FFC529', label: 'Finish Top 10', done: 1, total: 2, reward: '+150 XP' },
  { icon: 'add-circle-outline', tint: '#22C55E', label: 'Host a room', done: 0, total: 1, reward: '+40 Coins' },
];

/** Top players today. */
const TOP_PLAYERS = [
  { rank: 1, name: 'ZivoKing', xp: '1,240 XP' },
  { rank: 2, name: 'GhostYt', xp: '1,180 XP' },
  { rank: 3, name: 'Flexx', xp: '1,095 XP' },
];

/** ZIVO updates — what is new in the app. */
const UPDATES = [
  { icon: 'sparkles', tint: '#7C5CFF', tag: 'NEW', label: 'New tournament format available', date: 'Sep 19' },
  { icon: 'flame', tint: '#EF4444', tag: 'HOT', label: 'Weekly Clash registration is open', date: 'Sep 16' },
  { icon: 'alarm', tint: '#F59E0B', tag: 'REMINDER', label: 'Weekend XP starts Friday', date: 'Sep 15' },
];

// ============================================================
//  2. THE SCREEN
// ============================================================
export default function Home() {
  const insets = useSafeAreaInsets();

  // which featured card is showing (for the dots)
  const [hero, setHero] = useState(0);

  // the phone tells us how wide the screen is, so the cards fit
  const [size, setSize] = useState({ w: 0, h: 0 });
  const side = 16; // space on the left and right of everything
  const gap = 12; // space between two cards in a row
  const half = (size.w - side * 2 - gap) / 2; // width of one card in a pair
  const heroWidth = size.w - side * 2;

  // coins live here for now. Later this comes from the account (page 4).
  const [coins, setCoins] = useState(2450);
  const [bonusTaken, setBonusTaken] = useState(false);

  function handleHeroScroll(event) {
    if (!heroWidth) return;
    const which = Math.round(event.nativeEvent.contentOffset.x / heroWidth);
    if (which !== hero && which >= 0 && which < HEROES.length) setHero(which);
  }

  // small helper so every "not built yet" tap says something friendly
  function soon(title, body) {
    Alert.alert(title, body);
  }

  function onQuickAction(key) {
    if (key === 'tournaments') return router.push('/(tabs)/tournaments');
    if (key === 'leaderboard') return router.push('/(tabs)/leaderboard');
    return router.push('/(tabs)/host'); // the host wizard (a hidden page for now)
  }

  // ---- the 3 "earn coins" taps ----
  function onClaimBonus() {
    if (bonusTaken) return soon('Daily bonus', 'You already took today\'s bonus. Come back tomorrow.');
    setCoins((c) => c + 20);
    setBonusTaken(true);
    Alert.alert('Daily bonus claimed', '+20 coins. Balance: ' + (coins + 20).toLocaleString());
  }

  async function onShare() {
    try {
      await Share.share({
        message:
          'Join me on ZIVO — Free Fire tournaments, real prizes. Host a room or jump into one: https://zivo.gg',
      });
      setCoins((c) => c + 50);
      Alert.alert('Thanks for sharing!', '+50 coins added.');
    } catch (e) {
      // the person closed the share sheet — no problem, no coins
    }
  }

  function onEarn(key) {
    if (key === 'daily') return onClaimBonus();
    if (key === 'share') return onShare();
    return soon('Refer Friends', 'Invite links come with the account page — then you both get coins.');
  }

  return (
    <View
      style={styles.screen}
      onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* ============================================================
            1. HEADER
        ============================================================ */}
        <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.brand}>ZIVO</Text>
            <Text style={styles.brandSub}>COMPETE · EARN · GROW</Text>
          </View>

          <Pressable onPress={() => soon('Search', 'Search for players, rooms and hosts — coming with Tournaments.')} hitSlop={6}>
            <Ionicons name="search" size={19} color="#C9C9DC" style={styles.headerIcon} />
          </Pressable>

          <Pressable onPress={() => soon('Notifications', 'Room results, check-in alerts and payouts land here.')} hitSlop={6}>
            <Ionicons name="notifications-outline" size={19} color="#C9C9DC" style={styles.headerIcon} />
            <View style={styles.dot} />
          </Pressable>

          <Pressable onPress={() => router.push('/(tabs)/profile')} hitSlop={6}>
            <Image source={require('../../../assets/zivo/avatar.jpg')} style={styles.avatar} contentFit="cover" />
          </Pressable>
        </View>

        {/* ============================================================
            2. FEATURED TOURNAMENT  (swipe sideways)
        ============================================================ */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleHeroScroll}
          scrollEventThrottle={16}
          snapToInterval={heroWidth}
          decelerationRate="fast"
        >
          {HEROES.map((h) => (
            <View key={h.title} style={[styles.heroCard, { width: heroWidth }]}>
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

                <GoldButton
                  label="Join Now →"
                  onPress={() => router.push('/(tabs)/tournaments')}
                  style={{ width: 140, minHeight: 40, marginTop: 10 }}
                />
              </View>
            </View>
          ))}
        </ScrollView>

        {/* the dots under the featured card */}
        <View style={styles.heroDots}>
          {HEROES.map((h, i) => (
            <View key={h.title} style={[styles.heroDot, i === hero && styles.heroDotOn]} />
          ))}
        </View>

        {/* ============================================================
            3. QUICK ACTIONS
        ============================================================ */}
        <View style={styles.actions}>
          {ACTIONS.map((a) => (
            <Pressable
              key={a.key}
              onPress={() => onQuickAction(a.key)}
              style={({ pressed }) => [styles.action, { borderColor: a.tint + '55' }, pressed && { opacity: 0.9 }]}
            >
              <View style={[styles.actionIcon, { backgroundColor: a.tint + '22' }]}>
                <Ionicons name={a.icon} size={22} color={a.tint} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
              <Text style={styles.actionSub}>{a.sub}</Text>
            </Pressable>
          ))}
        </View>

        {/* ============================================================
            4. LIVE & ONGOING
        ============================================================ */}
        <SectionHead
          title="Live & Ongoing"
          action="See All →"
          onAction={() => router.push('/(tabs)/tournaments')}
        />

        <View style={styles.rowOfTwo}>
          {LIVE_CARDS.map((c) => (
            <View key={c.name} style={[styles.card, { width: half }]}>
              <View style={styles.liveArt}>
                <Image source={c.img} style={StyleSheet.absoluteFill} contentFit="cover" />
                <LinearGradient colors={['transparent', 'rgba(8,8,15,0.9)']} style={StyleSheet.absoluteFill} />

                <View style={[styles.tagPill, { backgroundColor: c.tint }]}>
                  <Text style={styles.tagPillText}>{c.tag}</Text>
                </View>

                <View style={styles.watchPill}>
                  <Text style={styles.watchText}>{c.watching}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardName} numberOfLines={1}>{c.name}</Text>
                <Text style={styles.cardMeta} numberOfLines={1}>{c.meta}</Text>
                <Text style={styles.cardPrize}>PRIZE: {c.prize}</Text>

                {c.button === 'Watch' ? (
                  <GoldButton
                    label="Watch"
                    onPress={() =>
                      soon(c.name, 'The Match Room: the round, who is alive and the live score. Watchers can follow, not join.')
                    }
                    style={{ minHeight: 38 }}
                  />
                ) : (
                  <Pressable
                    onPress={() =>
                      soon(c.name, 'Check in to get the room code. Check-in closes 15 minutes before the match.')
                    }
                    style={({ pressed }) => [styles.amberBtn, pressed && { opacity: 0.88 }]}
                  >
                    <LinearGradient
                      colors={['#F59E0B', '#FF8A00']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.btnInner}
                    >
                      <Text style={styles.btnText}>Check in</Text>
                    </LinearGradient>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* ============================================================
            5. XP & REWARDS
        ============================================================ */}
        <View style={[styles.rowOfTwo, { marginTop: 12 }]}>
          {/* left: level + xp + three numbers */}
          <View style={[styles.card, { width: half * 1.18 }]}>
            <View style={{ padding: 12 }}>
              <Text style={styles.lvl}>Lv. 12</Text>
              <Text style={styles.xpText}>340 / 600 XP</Text>
              <View style={styles.xpBar}>
                <View style={styles.xpFill} />
              </View>
              <View style={styles.statRow}>
                {[
                  { n: '45', l: 'TOURNAMENTS' },
                  { n: '12', l: 'WINS' },
                  { n: '3.2', l: 'K/D' },
                ].map((s) => (
                  <View key={s.l} style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={styles.statN}>{s.n}</Text>
                    <Text style={styles.statL}>{s.l}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* right: next reward */}
          <View style={[styles.card, styles.rewardCard, { flex: 1 }]}>
            <View style={{ padding: 12 }}>
              <Text style={styles.tiny}>NEXT REWARD</Text>
              <Text style={styles.rewardBig}>+50 Coins</Text>
              <Text style={styles.rewardSub}>Reach Lv. 15 to unlock</Text>
            </View>
          </View>
        </View>

        {/* ============================================================
            6. UPCOMING TOURNAMENTS
        ============================================================ */}
        <SectionHead
          title="Upcoming Tournaments"
          action="See All →"
          onAction={() => router.push('/(tabs)/tournaments')}
        />

        <View style={styles.rowOfTwo}>
          {UPCOMING.map((u) => (
            <View key={u.name} style={[styles.card, { width: half }]}>
              {/* the picture band at the top of the card */}
              <View style={styles.upArt}>
                <Image source={u.art} style={StyleSheet.absoluteFill} contentFit="cover" />
                <LinearGradient
                  colors={['rgba(8,8,15,0.10)', 'rgba(8,8,15,0.55)', 'rgba(19,19,30,1)']}
                  style={StyleSheet.absoluteFill}
                />

                {/* the little timing pill, sitting on the picture */}
                <View style={styles.upChipPos}>
                  {u.chipKind === 'countdown' ? (
                    <View style={[styles.chipPill, { borderColor: u.chipTint + '77', backgroundColor: u.chipTint + '1A' }]}>
                      <Ionicons name="time-outline" size={11} color={u.chipTint} />
                      <Text style={[styles.chipText, { color: u.chipTint }]}>{u.chip} </Text>
                      <Countdown seconds={u.startIn} tint={u.chipTint} />
                    </View>
                  ) : (
                    <View style={[styles.chipPill, { borderColor: u.chipTint + '77', backgroundColor: u.chipTint + '1A' }]}>
                      <Ionicons name="calendar-outline" size={11} color={u.chipTint} />
                      <Text style={[styles.chipText, { color: u.chipTint }]}>{u.chip}</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={{ padding: 12 }}>
                <Text style={styles.cardName} numberOfLines={1}>{u.name}</Text>
                <Text style={styles.cardMeta} numberOfLines={1}>{u.meta}</Text>

                <View style={styles.divider} />

                <View style={styles.entryLine}>
                  <View style={styles.entryBit}>
                    <Ionicons name="ticket-outline" size={12} color="#8B8BA5" />
                    <Text style={styles.entryText}>Entry: {u.entry}</Text>
                  </View>
                  <View style={styles.entryBit}>
                    <Ionicons name="cash-outline" size={12} color="#FFC529" />
                    <Text style={[styles.entryText, { color: '#FFC529' }]}>{u.prize}</Text>
                  </View>
                </View>

                {/* quieter button — the hero card owns the loud one */}
                <Pressable
                  onPress={() => soon(u.name, 'Room detail: prize, rules, slots left, then one big JOIN.')}
                  style={({ pressed }) => [styles.ghostBtn, pressed && { opacity: 0.8 }]}
                >
                  <Text style={styles.ghostBtnText}>Join</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* ============================================================
            7. YOUR PERFORMANCE
        ============================================================ */}
        <SectionHead title="Your Performance" badge="THIS WEEK" />

        <View style={styles.wideCard}>
          <View style={styles.perfRow}>
            {PERFORMANCE.map((p) => (
              <View key={p.label} style={styles.perfBit}>
                <View style={[styles.perfIcon, { backgroundColor: p.tint + '1F' }]}>
                  <Ionicons name={p.icon} size={15} color={p.tint} />
                </View>
                <Text style={styles.perfValue}>{p.value}</Text>
                <Text style={styles.perfLabel}>{p.label}</Text>
              </View>
            ))}

            {/* the win-rate ring */}
            <View style={styles.perfBit}>
              <View style={styles.ring}>
                <View style={styles.ringOn} />
                <Text style={styles.ringText}>{WIN_RATE}%</Text>
              </View>
              <Text style={styles.perfLabel}>Win Rate</Text>
            </View>
          </View>

          <Pressable onPress={() => soon('Full stats', 'Your match history, K/D per season and best finishes.')} hitSlop={6}>
            <Text style={styles.linkText}>View Full Stats →</Text>
          </Pressable>
        </View>

        {/* ============================================================
            8. EARN MORE COINS
        ============================================================ */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Earn More Coins</Text>
          {/* your balance, so a claim visibly lands somewhere */}
          <View style={styles.coinChip}>
            <Ionicons name="ellipse" size={12} color="#FFC529" />
            <Text style={styles.coinChipText}>{coins.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.rowOfThree}>
          {EARN.map((e) => (
            <Pressable
              key={e.key}
              onPress={() => onEarn(e.key)}
              style={({ pressed }) => [styles.earnTile, { borderColor: e.tint + '44' }, pressed && { opacity: 0.9 }]}
            >
              <View style={[styles.earnIcon, { backgroundColor: e.tint + '22' }]}>
                <Ionicons name={e.icon} size={18} color={e.tint} />
              </View>
              <Text style={styles.earnLabel} numberOfLines={1}>{e.label}</Text>
              <Text style={styles.earnSub} numberOfLines={1}>{e.sub}</Text>
              <Text style={[styles.earnReward, { color: e.tint }]}>{e.reward} Coins</Text>
            </Pressable>
          ))}
        </View>

        {/* ============================================================
            9. DAILY CHALLENGES
        ============================================================ */}
        <SectionHead
          title="Daily Challenges"
          action="View Challenges →"
          onAction={() => soon('Daily Challenges', 'Every day you get 3 small goals. Finish them for XP and coins.')}
        />

        <View style={styles.wideCard}>
          {CHALLENGES.map((c, i) => (
            <View key={c.label} style={[styles.challengeRow, i > 0 && styles.rowTopLine]}>
              <View style={[styles.challengeIcon, { backgroundColor: c.tint + '1F' }]}>
                <Ionicons name={c.icon} size={16} color={c.tint} />
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.challengeTop}>
                  <Text style={styles.challengeLabel} numberOfLines={1}>{c.label}</Text>
                  <Text style={[styles.challengeReward, { color: c.tint }]}>{c.reward}</Text>
                </View>
                <View style={styles.challengeBar}>
                  <View style={[styles.challengeFill, { width: (c.done / c.total) * 100 + '%', backgroundColor: c.tint }]} />
                </View>
                <Text style={styles.challengeCount}>
                  {c.done} / {c.total}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ============================================================
            10. TOP PLAYERS TODAY
        ============================================================ */}
        <SectionHead
          title="Top Players Today"
          action="See All →"
          onAction={() => soon('Leaderboard', 'The full board — daily, weekly and all-time.')}
        />

        <View style={styles.wideCard}>
          {TOP_PLAYERS.map((p, i) => (
            <View key={p.name} style={[styles.playerRow, i > 0 && styles.rowTopLine]}>
              <View style={[styles.medal, rankStyle(p.rank).badge]}>
                <Text style={[styles.medalText, { color: rankStyle(p.rank).ink }]}>{p.rank}</Text>
              </View>
              <Image source={require('../../../assets/zivo/avatar.jpg')} style={styles.playerAvatar} contentFit="cover" />
              <View style={{ flex: 1 }}>
                <Text style={styles.playerName}>{p.name}</Text>
                <Text style={styles.playerXp}>{p.xp}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#3A3A4C" />
            </View>
          ))}
        </View>

        {/* ============================================================
            11. ZIVO UPDATES
        ============================================================ */}
        <SectionHead
          title="ZIVO Updates"
          action="See All →"
          onAction={() => soon('ZIVO Updates', 'News, new formats and reminders from the ZIVO team.')}
        />

        <View style={styles.rowOfThree}>
          {UPDATES.map((u) => (
            <Pressable
              key={u.label}
              onPress={() => soon(u.label, 'Posted ' + u.date)}
              style={({ pressed }) => [styles.updateTile, pressed && { opacity: 0.9 }]}
            >
              <View style={[styles.updateIcon, { backgroundColor: u.tint + '22' }]}>
                <Ionicons name={u.icon} size={15} color={u.tint} />
              </View>
              <Text style={styles.updateLabel} numberOfLines={3}>{u.label}</Text>
              <View style={styles.updateFoot}>
                <Text style={styles.updateDate}>{u.date}</Text>
                <Text style={[styles.updateTag, { color: u.tint }]}>{u.tag}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* ============================================================
            12. ZIVO COMMUNITY
        ============================================================ */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>ZIVO Community</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>1,284 online</Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/(tabs)/community')}
          style={({ pressed }) => [styles.communityCard, pressed && { opacity: 0.92 }]}
        >
          <View style={styles.communityIcon}>
            <Ionicons name="chatbubbles" size={18} color="#7C5CFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.communityTitle}>What's happening?</Text>
            <Text style={styles.communitySub} numberOfLines={1}>Squad looking for 2 players…</Text>
          </View>
          <Text style={styles.communityAction}>Join →</Text>
        </Pressable>

        {/* the small print at the very bottom */}
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

/** The heading of a section: title on the left, link on the right. */
function SectionHead({ title, badge, action, onAction }) {
  return (
    <View style={styles.sectionHead}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {badge ? (
          <View style={styles.headBadge}>
            <Text style={styles.headBadgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>

      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** The gold button. Same look as pages 1, 2 and 3. */
function GoldButton({ label, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btn, pressed && { opacity: 0.88 }, style]}>
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

/**
 * A number that counts down by itself, once per second.
 * Used on the upcoming card: "STARTS IN 2h 15m".
 */
function Countdown({ seconds, tint }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id); // stop the clock when we leave the screen
  }, []);

  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);

  return <Text style={[styles.chipText, { color: tint }]}>{h > 0 ? h + 'h ' + m + 'm' : m + 'm'}</Text>;
}

/** medal colours for the 3 top players */
function rankStyle(rank) {
  if (rank === 1) return { badge: { backgroundColor: '#3A2E08', borderColor: '#FFC529' }, ink: '#FFC529' };
  if (rank === 2) return { badge: { backgroundColor: '#2A2D33', borderColor: '#C9CDD6' }, ink: '#C9CDD6' };
  return { badge: { backgroundColor: '#33230F', borderColor: '#C98A4B' }, ink: '#C98A4B' };
}

// ============================================================
//  4. THE STYLES
// ============================================================
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#08080F' },
  scrollBody: { paddingBottom: 28 },

  // --- 1. header ---
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 12 },
  brand: { fontFamily: 'BebasNeue', fontSize: 26, letterSpacing: 3, color: '#F4F4F8' },
  brandSub: { fontFamily: 'Rajdhani-Bold', fontSize: 8.5, letterSpacing: 2, color: '#5C5C76', marginTop: -2 },
  headerIcon: { padding: 9, backgroundColor: '#13131E', borderRadius: 11, borderWidth: 1, borderColor: '#2A2A3E' },
  dot: { position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: 4, backgroundColor: '#EF4444' },
  avatar: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: '#22C55E' },

  // --- 2. featured card ---
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

  // --- 3. quick actions ---
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

  // --- section headings ---
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: { fontFamily: 'BebasNeue', fontSize: 22, letterSpacing: 0.6, color: '#F4F4F8' },
  sectionAction: { fontFamily: 'Rajdhani-SemiBold', fontSize: 12, color: '#8B8BA5' },
  headBadge: {
    borderWidth: 1,
    borderColor: 'rgba(124,92,255,0.5)',
    backgroundColor: 'rgba(124,92,255,0.18)',
    borderRadius: 100,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  headBadgeText: { fontFamily: 'Rajdhani-Bold', fontSize: 9, letterSpacing: 1, color: '#B9A6FF' },

  // --- shared card look ---
  rowOfTwo: { flexDirection: 'row', gap: 12, paddingHorizontal: 16 },
  rowOfThree: { flexDirection: 'row', gap: 10, paddingHorizontal: 16 },
  card: { backgroundColor: '#13131E', borderRadius: 16, borderWidth: 1, borderColor: '#2A2A3E', overflow: 'hidden' },
  wideCard: {
    marginHorizontal: 16,
    backgroundColor: '#13131E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    padding: 14,
  },

  // --- 4. live cards ---
  liveArt: { height: 96 },
  tagPill: { position: 'absolute', top: 9, left: 9, borderRadius: 100, paddingHorizontal: 9, paddingVertical: 3 },
  tagPillText: { fontFamily: 'Rajdhani-Bold', fontSize: 8.5, letterSpacing: 0.8, color: '#0B0B12' },
  watchPill: {
    position: 'absolute',
    top: 9,
    right: 9,
    backgroundColor: 'rgba(8,8,15,0.75)',
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  watchText: { fontFamily: 'Rajdhani-Medium', fontSize: 9.5, color: '#E6E6F0' },
  cardBody: { padding: 11 },
  cardName: { fontFamily: 'Rajdhani-Bold', fontSize: 15, color: '#F4F4F8' },
  cardMeta: { fontFamily: 'Rajdhani-Medium', fontSize: 11, color: '#8B8BA5', marginTop: 2 },
  cardPrize: { fontFamily: 'Rajdhani-Bold', fontSize: 12, color: '#FFC529', marginTop: 7, marginBottom: 9 },

  // --- 5. xp ---
  lvl: { fontFamily: 'BebasNeue', fontSize: 21, color: '#FFC529' },
  xpText: { fontFamily: 'Rajdhani-SemiBold', fontSize: 11, color: '#8B8BA5', marginTop: 1 },
  xpBar: { height: 5, borderRadius: 3, backgroundColor: '#2A2A3E', marginTop: 9, overflow: 'hidden' },
  xpFill: { width: '57%', height: '100%', backgroundColor: '#FFC529' },
  statRow: { flexDirection: 'row', marginTop: 11 },
  statN: { fontFamily: 'Rajdhani-Bold', fontSize: 14, color: '#F4F4F8' },
  statL: { fontFamily: 'Rajdhani-Medium', fontSize: 7.5, color: '#5C5C76', marginTop: 1 },
  rewardCard: { borderColor: 'rgba(255,197,41,0.35)' },
  tiny: { fontFamily: 'Rajdhani-Bold', fontSize: 8.5, letterSpacing: 1, color: '#8B8BA5' },
  rewardBig: { fontFamily: 'BebasNeue', fontSize: 24, color: '#FFC529', marginTop: 5 },
  rewardSub: { fontFamily: 'Rajdhani-Medium', fontSize: 10.5, color: '#8B8BA5', marginTop: 2 },

  // --- 6. upcoming ---
  upArt: { height: 78 },
  upChipPos: { position: 'absolute', top: 9, left: 9 },
  chipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  chipText: { fontFamily: 'Rajdhani-Bold', fontSize: 9, letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: '#2A2A3E', marginVertical: 9 },
  entryLine: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  entryBit: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  entryText: { fontFamily: 'Rajdhani-SemiBold', fontSize: 11, color: '#C9C9DC' },
  ghostBtn: {
    borderWidth: 1.4,
    borderColor: 'rgba(255,197,41,0.6)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  ghostBtnText: { fontFamily: 'Rajdhani-Bold', fontSize: 13.5, color: '#FFC529' },

  // --- 7. performance ---
  perfRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  perfBit: { alignItems: 'center', flex: 1 },
  perfIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  perfValue: { fontFamily: 'Rajdhani-Bold', fontSize: 15, color: '#F4F4F8' },
  perfLabel: { fontFamily: 'Rajdhani-Medium', fontSize: 9.5, color: '#8B8BA5', marginTop: 1 },
  ring: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 4,
    borderColor: '#242438',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  // the bright quarter of the ring (16.7% of a full circle, drawn as a quarter)
  ringOn: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#22C55E',
  },
  ringText: { fontFamily: 'Rajdhani-Bold', fontSize: 11, color: '#F4F4F8' },
  linkText: { fontFamily: 'Rajdhani-Bold', fontSize: 12, color: '#FFC529', marginTop: 14 },

  // --- 8. earn ---
  coinChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,197,41,0.35)',
    backgroundColor: 'rgba(255,197,41,0.12)',
    borderRadius: 100,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  coinChipText: { fontFamily: 'Rajdhani-Bold', fontSize: 12, color: '#FFC529' },
  earnTile: {
    flex: 1,
    backgroundColor: '#13131E',
    borderRadius: 15,
    borderWidth: 1,
    padding: 10,
    minHeight: 118,
  },
  earnIcon: { width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  earnLabel: { fontFamily: 'Rajdhani-Bold', fontSize: 12, color: '#F4F4F8', marginTop: 8 },
  earnSub: { fontFamily: 'Rajdhani-Medium', fontSize: 9.5, color: '#8B8BA5', marginTop: 1 },
  earnReward: { fontFamily: 'Rajdhani-Bold', fontSize: 11, marginTop: 7 },

  // --- 9. challenges ---
  challengeRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 11 },
  rowTopLine: { borderTopWidth: 1, borderTopColor: '#2A2A3E' },
  challengeIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  challengeTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  challengeLabel: { fontFamily: 'Rajdhani-SemiBold', fontSize: 12.5, color: '#F4F4F8', flex: 1 },
  challengeReward: { fontFamily: 'Rajdhani-Bold', fontSize: 11.5 },
  challengeBar: { height: 5, borderRadius: 3, backgroundColor: '#2A2A3E', marginTop: 7, overflow: 'hidden' },
  challengeFill: { height: '100%', borderRadius: 3 },
  challengeCount: { fontFamily: 'Rajdhani-Medium', fontSize: 9.5, color: '#8B8BA5', marginTop: 3 },

  // --- 10. top players ---
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 10 },
  medal: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalText: { fontFamily: 'Rajdhani-Bold', fontSize: 12 },
  playerAvatar: { width: 34, height: 34, borderRadius: 17, borderWidth: 1.5, borderColor: '#2A2A3E' },
  playerName: { fontFamily: 'Rajdhani-Bold', fontSize: 13.5, color: '#F4F4F8' },
  playerXp: { fontFamily: 'Rajdhani-Medium', fontSize: 10.5, color: '#8B8BA5', marginTop: 1 },

  // --- 11. updates ---
  updateTile: {
    flex: 1,
    backgroundColor: '#13131E',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    padding: 10,
    minHeight: 130,
    justifyContent: 'space-between',
  },
  updateIcon: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  updateLabel: { fontFamily: 'Rajdhani-SemiBold', fontSize: 11, color: '#E6E6F0', marginTop: 8, lineHeight: 14 },
  updateFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  updateDate: { fontFamily: 'Rajdhani-Medium', fontSize: 9, color: '#5C5C76' },
  updateTag: { fontFamily: 'Rajdhani-Bold', fontSize: 8, letterSpacing: 0.8 },

  // --- 12. community ---
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#22C55E' },
  onlineText: { fontFamily: 'Rajdhani-SemiBold', fontSize: 11, color: '#22C55E' },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginHorizontal: 16,
    backgroundColor: '#13131E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    padding: 13,
  },
  communityIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(124,92,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityTitle: { fontFamily: 'Rajdhani-Bold', fontSize: 13.5, color: '#F4F4F8' },
  communitySub: { fontFamily: 'Rajdhani-Medium', fontSize: 11, color: '#8B8BA5', marginTop: 1 },
  communityAction: { fontFamily: 'Rajdhani-Bold', fontSize: 12, color: '#FFC529' },

  footer: {
    fontFamily: 'Rajdhani-Medium',
    fontSize: 10,
    color: '#3A3A4C',
    textAlign: 'center',
    marginTop: 22,
  },

  // --- buttons ---
  btn: { width: '100%', borderRadius: 13, overflow: 'hidden', justifyContent: 'center' },
  amberBtn: { width: '100%', borderRadius: 13, overflow: 'hidden', justifyContent: 'center', minHeight: 38 },
  btnInner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 11 },
  btnText: { fontFamily: 'Rajdhani-Bold', fontSize: 14, color: '#171000' },
});
