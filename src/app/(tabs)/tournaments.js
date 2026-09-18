/**
 * ============================================================
 *  ZIVO — TOURNAMENTS  (the premium room list)
 * ============================================================
 *  Read it in 4 parts, same as every other page:
 *     1. the imports
 *     2. the DATA  (everything you can edit lives here)
 *     3. the screen  (top to bottom, in the order it shows)
 *     4. the styles
 *
 *  THE ORDER OF THE SCREEN:
 *     header (logo, coins, bell, avatar)
 *     featured carousel  (swipe, 4 dots)
 *     category tiles  (6 buttons)
 *     filter row  (6 chips — tap to cycle, they REALLY filter)
 *     live & ongoing  (2 big cards)
 *     upcoming tournaments  (scroll sideways)
 *     categories + play more earn more  (side by side)
 *     featured tournaments  (scroll sideways)
 *
 *  TWO RULES WE HOLD EVERYWHERE:
 *    - A LIVE room can only be WATCHED. Entry is closed.
 *    - Every card shows its stage tag, so a player always knows
 *      if they can join or only watch.
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

// ============================================================
//  1. THE DATA
// ============================================================

/** Where the artwork lives. One folder, so it is easy to swap. */
const ART = '../../../assets/zivo/tour/';

/** The big swipeable cards at the top. */
const HEROES = [
  {
    art: require('../../../assets/zivo/tour/v3-hero.jpg'),
    brand: 'ZIVO GRAND CLASH',
    sub: 'BIGGER PRIZES. HIGHER STAKES.',
    when: 'Today, 7:00 PM',
    players: '128 / 256',
    prize: '15,000 Coins',
    // the yellow button's words
    cta: 'Join Now',
  },
  {
    art: require('../../../assets/zivo/tour/v3-elite-cup.jpg'),
    brand: 'ELITE CUP',
    sub: 'PREMIUM ROOM. REAL PRESSURE.',
    when: 'Sat, 9:00 PM',
    players: '64 / 128',
    prize: '₦50,000',
    cta: 'Join Now',
  },
  {
    art: require('../../../assets/zivo/tour/v3-cs-night.jpg'),
    brand: 'CLASH NIGHT',
    sub: '4V4 ALL NIGHT LONG.',
    when: 'Tonight, 8:00 PM',
    players: '32 / 32',
    prize: '₦20,000',
    cta: 'Full',
  },
  {
    art: require('../../../assets/zivo/tour/v2-squad.jpg'),
    brand: 'PHANTOM INVITATIONAL',
    sub: 'SQUAD UP. TAKE THE POUCH.',
    when: 'Tomorrow, 9:30 PM',
    players: '42 / 48',
    prize: '₦25,000',
    cta: 'Join Now',
  },
];

/** The 6 category tiles under the carousel. */
const CATEGORY_TILES = [
  { key: 'all', icon: 'trophy', label: 'All Tournaments', sub: 'Browse all events' },
  { key: 'free', icon: 'gift', label: 'Free', sub: 'Earn coins & XP' },
  { key: 'premium', icon: 'diamond', label: 'Premium', sub: 'Use your coins' },
  { key: 'custom', icon: 'people', label: 'Custom Room', sub: 'Create / Join' },
  { key: 'live', icon: 'radio', label: 'Live', sub: 'Ongoing now' },
];

/**
 * The 6 filters. Each one CYCLES: tap it and it moves to the next
 * option, then the list below re-filters itself.
 * The last item in every list loops back to the first.
 */
const FILTERS = [
  { key: 'game', label: 'Games', options: ['All Games', 'Free Fire', 'Free Fire MAX'] },
  { key: 'type', label: 'Types', options: ['All Types', 'Battle Royale', 'Clash Squad', '1v1', 'Squad'] },
  { key: 'entry', label: 'Entry Fee', options: ['Any Entry', 'Free', 'Coins (premium)'] },
  { key: 'prize', label: 'Prize Pool', options: ['Any Prize', 'Under ₦10k', '₦10k – ₦50k', '₦50k and up'] },
  { key: 'time', label: 'Time', options: ['Any Time', 'Closing soon', 'Tomorrow', 'This week'] },
  { key: 'sort', label: 'Sort', options: ['Sort', 'Prize: high first', 'Prize: low first'] },
];

/**
 * EVERY ROOM on the page.
 *
 *  stage    'live'    = match don start, entry closed → WATCH only
 *           'checkin' = check-in window open → COLLECT ROOM CODE
 *           'soon'    = still open → JOIN
 *  tag      the little label on the card picture
 *  kind     'free' or 'premium' (premium rooms cost coins)
 *  type     'Battle Royale' | 'Clash Squad' | '1v1' | 'Squad' | 'Custom'
 *  prizeValue  the prize as a plain number, so the Prize filter
 *              can actually compare. 0 means it is coins, not naira.
 */
const ROOMS = [
  // ---------------- LIVE & ONGOING ----------------
  {
    id: 'live1',
    stage: 'live',
    tag: 'LIVE',
    tagColour: '#22C55E',
    art: require('../../../assets/zivo/tour/v2-solo.jpg'),
    name: 'Solo Showdown',
    meta: 'BR · 42/48 · Round 2',
    type: 'Battle Royale',
    kind: 'free',
    game: 'Free Fire',
    prize: '₦25,000',
    prizeValue: 25000,
    entry: '100',
    joined: 32,
    button: 'Watch',
  },
  {
    id: 'live2',
    stage: 'live',
    tag: 'HAPPENING NOW',
    tagColour: '#7C5CFF',
    art: require('../../../assets/zivo/tour/v2-squad.jpg'),
    name: 'Squad Clash',
    meta: 'CS · 4v4 · 26/32',
    type: 'Clash Squad',
    kind: 'premium',
    game: 'Free Fire',
    prize: '₦15,000',
    prizeValue: 15000,
    entry: '100',
    joined: 18,
    button: 'Join',
  },

  // ---------------- UPCOMING ----------------
  {
    id: 'up1',
    stage: 'checkin',
    tag: 'TOMORROW · 6:00 PM',
    tagColour: '#7C5CFF',
    art: require('../../../assets/zivo/tour/v3-cs-night.jpg'),
    name: 'Clash Squad Night',
    meta: 'CS · 4v4 · 32/32',
    type: 'Clash Squad',
    kind: 'free',
    game: 'Free Fire',
    prize: '₦8,000',
    prizeValue: 8000,
    entry: '100',
    when: 'Tomorrow',
    button: 'Join',
  },
  {
    id: 'up2',
    stage: 'soon',
    tag: 'SAT · 8:00 PM',
    tagColour: '#3B82F6',
    art: require('../../../assets/zivo/tour/v3-solo-battle.jpg'),
    name: 'Solo Battle',
    meta: 'BR · 1v1 · 128/128',
    type: '1v1',
    kind: 'free',
    game: 'Free Fire',
    prize: '₦5,000',
    prizeValue: 5000,
    entry: 'FREE',
    when: 'Tomorrow',
    button: 'Full',
  },
  {
    id: 'up3',
    stage: 'soon',
    tag: 'SUN · 4:00 PM',
    tagColour: '#3B82F6',
    art: require('../../../assets/zivo/tour/v3-custom.jpg'),
    name: 'Custom Room',
    meta: 'CS · 4v4 · 16/16',
    type: 'Custom',
    kind: 'premium',
    game: 'Free Fire',
    prize: '₦10,000',
    prizeValue: 10000,
    entry: '50',
    when: 'This week',
    button: 'Full',
  },
  {
    id: 'up4',
    stage: 'soon',
    tag: 'MON · 7:00 PM',
    tagColour: '#3B82F6',
    art: require('../../../assets/zivo/tour/v3-elite-cup.jpg'),
    name: 'Elite Cup',
    meta: 'BR · Squad · 64/64',
    type: 'Squad',
    kind: 'premium',
    game: 'Free Fire',
    prize: '₦50,000',
    prizeValue: 50000,
    entry: '500',
    when: 'This week',
    button: 'Join',
  },
  {
    id: 'up5',
    stage: 'checkin',
    tag: 'CLOSING SOON',
    tagColour: '#F59E0B',
    art: require('../../../assets/zivo/tour/v3-hero.jpg'),
    name: 'ZIVO Grand Clash',
    meta: 'BR · Squad · 128/256',
    type: 'Squad',
    kind: 'free',
    game: 'Free Fire',
    prize: '15,000 Coins',
    prizeValue: 0,
    entry: 'FREE',
    when: 'Today',
    button: 'Join',
  },
];

/** The small category shortcuts inside the Categories card. */
const CATEGORY_ICONS = [
  { key: 'br', icon: 'shield', label: 'BR' },
  { key: 'cs', icon: 'git-compare', label: 'CS' },
  { key: '1v1', icon: 'person', label: '1v1' },
  { key: 'squad', icon: 'people', label: 'Squad' },
  { key: 'custom', icon: 'construct', label: 'Customs' },
  { key: 'premium', icon: 'diamond', label: 'Premium' },
];

/** The three featured tournament cards at the bottom. */
const FEATURED = [
  {
    art: require('../../../assets/zivo/tour/v3-hero.jpg'),
    crest: 'shield',
    crestColour: '#FFC529',
    name: 'RANK PUSH CUP',
    meta: 'BR · Squad',
    tag: 'HOT',
    tagColour: '#EF4444',
    prize: '25,000',
    entry: '200',
  },
  {
    art: require('../../../assets/zivo/tour/v2-squad.jpg'),
    crest: 'ribbon',
    crestColour: '#22C55E',
    name: 'WEEKEND WARRIORS',
    meta: 'CS · 4v4',
    tag: 'NEW',
    tagColour: '#22C55E',
    prize: '15,000',
    entry: '100',
  },
  {
    art: require('../../../assets/zivo/tour/v3-custom.jpg'),
    crest: 'star',
    crestColour: '#7C5CFF',
    name: 'GUILD SHOWDOWN',
    meta: 'CS · 4v4',
    tag: 'TRENDING',
    tagColour: '#3B82F6',
    prize: '30,000',
    entry: '300',
  },
];

// ============================================================
//  2. THE SCREEN
// ============================================================
export default function Tournaments() {
  const insets = useSafeAreaInsets();

  // which featured card is showing (the dots)
  const [hero, setHero] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // the filter settings. 'index' = which option is picked.
  const [filters, setFilters] = useState({
    game: 0,
    type: 0,
    entry: 0,
    prize: 0,
    time: 0,
    sort: 0,
  });

  // which category tile is switched on ('all' = the first one)
  const [category, setCategory] = useState('all');

  const side = 14; // the left/right margin used everywhere
  const side2 = side * 2;
  const heroWidth = size.w - side2;

  function soon(title, body) {
    Alert.alert(title, body);
  }

  /** Tap a filter chip: move it to the next option. */
  function cycleFilter(key, howMany) {
    setFilters((f) => ({ ...f, [key]: (f[key] + 1) % howMany }));
  }

  // ---------------- the actual filtering ----------------
  let shown = ROOMS.filter((r) => {
    const g = FILTERS[0].options[filters.game];
    const t = FILTERS[1].options[filters.type];
    const e = FILTERS[2].options[filters.entry];
    const p = FILTERS[3].options[filters.prize];
    const tm = FILTERS[4].options[filters.time];

    if (g === 'Free Fire' && r.game !== 'Free Fire') return false;
    if (g === 'Free Fire MAX') return false; // we have none yet — honest empty state

    if (t !== 'All Types' && r.type !== t) return false;
    if (e === 'Free' && r.kind !== 'free') return false;
    if (e === 'Coins (premium)' && r.kind !== 'premium') return false;

    if (p === 'Under ₦10k' && !(r.prizeValue > 0 && r.prizeValue < 10000)) return false;
    if (p === '₦10k – ₦50k' && !(r.prizeValue >= 10000 && r.prizeValue <= 50000)) return false;
    if (p === '₦50k and up' && !(r.prizeValue > 50000)) return false;

    if (tm === 'Closing soon' && r.stage !== 'checkin') return false;
    if (tm === 'Tomorrow' && r.when !== 'Tomorrow') return false;
    if (tm === 'This week' && r.when !== 'This week') return false;

    return true;
  });

  // the category tiles filter too
  if (category === 'live') shown = shown.filter((r) => r.stage === 'live');
  if (category === 'free') shown = shown.filter((r) => r.kind === 'free');
  if (category === 'premium') shown = shown.filter((r) => r.kind === 'premium');
  if (category === 'custom') shown = shown.filter((r) => r.type === 'Custom');

  // ---------------- sorting ----------------
  const sortBy = FILTERS[5].options[filters.sort];
  if (sortBy === 'Prize: high first') shown = [...shown].sort((a, b) => b.prizeValue - a.prizeValue);
  if (sortBy === 'Prize: low first') shown = [...shown].sort((a, b) => a.prizeValue - b.prizeValue);

  const liveNow = shown.filter((r) => r.stage === 'live');
  const upcoming = shown.filter((r) => r.stage !== 'live');

  /** what happens when the button on a card is tapped */
  function onRoomButton(room) {
    if (room.button === 'Full') {
      return soon(room.name, 'This room don full. Check the other rooms — or host your own.');
    }
    if (room.stage === 'live') {
      return soon(
        room.name,
        'Match don start. You go enter the watcher room — see the round, who still dey alive and the live score. You no fit join again.'
      );
    }
    return soon(
      room.name,
      'Room detail: full prize, rules, slots wey remain, entry fee — then one big JOIN button.'
    );
  }

  function onCategoryTile(key) {
    if (key === 'custom') return router.push('/(tabs)/host'); // custom room = host wizard
    setCategory(key);
  }

  return (
    <View
      style={styles.screen}
      onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* ============================================================
            HEADER — logo, coins, bell, avatar
        ============================================================ */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Image source={require('../../../assets/zivo/mark.png')} style={styles.logo} contentFit="contain" />
          <View style={{ flex: 1 }}>
            <Text style={styles.brand}>ZIVO</Text>
            <Text style={styles.brandSub}>COMPETE · EARN · GROW</Text>
          </View>

          {/* coin balance + a way to get more */}
          <View style={styles.coinPill}>
            <Ionicons name="logo-bitcoin" size={15} color="#FFC529" />
            <Text style={styles.coinText}>2,450</Text>
            <Pressable
              onPress={() => soon('Get coins', 'Coin packs, daily bonus and referrals land here.')}
              style={styles.coinPlus}
              hitSlop={6}
            >
              <Ionicons name="add" size={13} color="#0B0B12" />
            </Pressable>
          </View>

          <Pressable onPress={() => soon('Notifications', 'Results, check-in alerts and payouts.')} hitSlop={6}>
            <Ionicons name="notifications-outline" size={19} color="#C9C9DC" style={styles.headerIcon} />
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>3</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => router.push('/(tabs)/profile')} hitSlop={6}>
            <Image source={require('../../../assets/zivo/avatar.jpg')} style={styles.avatar} contentFit="cover" />
          </Pressable>
        </View>

        {/* ============================================================
            FEATURED CAROUSEL  (swipe sideways)
        ============================================================ */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          snapToInterval={heroWidth}
          decelerationRate="fast"
          onScroll={(e) => {
            if (!heroWidth) return;
            const which = Math.round(e.nativeEvent.contentOffset.x / heroWidth);
            if (which !== hero && which >= 0 && which < HEROES.length) setHero(which);
          }}
        >
          {HEROES.map((h) => (
            <View key={h.brand} style={[styles.heroCard, { width: heroWidth }]}>
              <Image source={h.art} style={StyleSheet.absoluteFill} contentFit="cover" />

              {/* dark on the left so the words stay readable */}
              <LinearGradient
                colors={['rgba(6,6,14,0.97)', 'rgba(6,6,14,0.72)', 'rgba(6,6,14,0.05)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={StyleSheet.absoluteFill}
              />

              <View style={styles.heroInner}>
                <View style={styles.featPill}>
                  <Ionicons name="trophy" size={10} color="#FFC529" />
                  <Text style={styles.featText}>FEATURED TOURNAMENT</Text>
                </View>

                <Text style={styles.heroBrand}>{h.brand}</Text>
                <Text style={styles.heroSub}>{h.sub}</Text>

                {/* three little facts, divided by thin lines */}
                <View style={styles.heroMeta}>
                  <View style={styles.heroMetaBit}>
                    <Ionicons name="calendar-outline" size={14} color="#C9C9DC" />
                    <View>
                      <Text style={styles.heroMetaLabel}>Starts</Text>
                      <Text style={styles.heroMetaValue}>{h.when}</Text>
                    </View>
                  </View>

                  <View style={styles.heroDivider} />

                  <View style={styles.heroMetaBit}>
                    <Ionicons name="people-outline" size={14} color="#C9C9DC" />
                    <View>
                      <Text style={styles.heroMetaLabel}>Players</Text>
                      <Text style={styles.heroMetaValue}>{h.players}</Text>
                    </View>
                  </View>

                  <View style={styles.heroDivider} />

                  <View style={styles.heroMetaBit}>
                    <Ionicons name="cash-outline" size={14} color="#FFC529" />
                    <View>
                      <Text style={styles.heroMetaLabel}>Prize Pool</Text>
                      <Text style={[styles.heroMetaValue, { color: '#FFC529' }]}>{h.prize}</Text>
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={() =>
                    h.cta === 'Full'
                      ? onRoomButton({ name: h.brand, button: 'Full' })
                      : soon(h.brand, 'Room detail: prize, rules, slots left, then JOIN.')
                  }
                  style={({ pressed }) => [styles.heroBtn, pressed && { opacity: 0.88 }]}
                >
                  <LinearGradient
                    colors={['#FFC529', '#FF8A00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.heroBtnInner}
                  >
                    <Text style={styles.heroBtnText}>{h.cta}</Text>
                    <Ionicons name="arrow-forward" size={14} color="#171000" />
                  </LinearGradient>
                </Pressable>
              </View>

              {/* the game wordmark in the top right corner */}
              <Text style={styles.gameMark}>
                FREE <Text style={{ color: '#FF8A00' }}>FIRE</Text>
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* the dots under the carousel */}
        <View style={styles.heroDots}>
          {HEROES.map((h, i) => (
            <View key={h.brand} style={[styles.heroDot, i === hero && styles.heroDotOn]} />
          ))}
        </View>

        {/* ============================================================
            CATEGORY TILES  (scroll sideways)
        ============================================================ */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tileRow}>
          {CATEGORY_TILES.map((t) => {
            const on = category === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => onCategoryTile(t.key)}
                style={({ pressed }) => [styles.tile, on && styles.tileOn, pressed && { opacity: 0.9 }]}
              >
                <View style={[styles.tileIcon, on && { backgroundColor: 'rgba(255,197,41,0.18)' }]}>
                  <Ionicons name={t.icon} size={19} color={on ? '#FFC529' : '#8B8BA5'} />
                </View>
                <Text style={[styles.tileLabel, on && { color: '#FFC529' }]}>{t.label}</Text>
                <Text style={styles.tileSub}>{t.sub}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ============================================================
            THE FILTERS  (tap a chip to cycle its options)
        ============================================================ */}
        <View style={styles.filterWrap}>
          {FILTERS.map((f) => {
            const picked = f.options[filters[f.key]];
            const isOn = filters[f.key] !== 0; // option 0 is always "any"
            return (
              <Pressable
                key={f.key}
                onPress={() => cycleFilter(f.key, f.options.length)}
                style={({ pressed }) => [styles.filterChip, isOn && styles.filterChipOn, pressed && { opacity: 0.85 }]}
              >
                <Text style={[styles.filterText, isOn && { color: '#FFC529' }]}>{picked}</Text>
                <Ionicons name="chevron-down" size={13} color={isOn ? '#FFC529' : '#8B8BA5'} />
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.showing}>
          SHOWING {shown.length} {shown.length === 1 ? 'TOURNAMENT' : 'TOURNAMENTS'}
        </Text>

        {/* ============================================================
            EMPTY STATE — when the filters match nothing
        ============================================================ */}
        {shown.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="funnel-outline" size={30} color="#5C5C76" />
            <Text style={styles.emptyTitle}>No room match</Text>
            <Text style={styles.emptyBody}>
              Nothing dey for this filter combo. Clear the filters, or host your own room.
            </Text>
            <Pressable
              onPress={() => {
                setFilters({ game: 0, type: 0, entry: 0, prize: 0, time: 0, sort: 0 });
                setCategory('all');
              }}
              style={({ pressed }) => [styles.emptyBtn, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.emptyBtnText}>Clear filters</Text>
            </Pressable>
          </View>
        ) : null}

        {/* ============================================================
            LIVE & ONGOING  (two big cards, side by side)
        ============================================================ */}
        {liveNow.length > 0 ? (
          <>
            <SectionHead
              title="Live & Ongoing"
              icon="flame"
              iconColour="#EF4444"
              action="See All →"
              onAction={() => soon('Live now', 'Every room wey dey run right now, in one list.')}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bigRow}>
              {liveNow.map((r) => (
                <LiveCard key={r.id} room={r} onPress={() => onRoomButton(r)} />
              ))}
            </ScrollView>
          </>
        ) : null}

        {/* ============================================================
            UPCOMING TOURNAMENTS
        ============================================================ */}
        {upcoming.length > 0 ? (
          <>
            <SectionHead
              title="Upcoming Tournaments"
              icon="calendar"
              iconColour="#FFC529"
              action="See All →"
              onAction={() => soon('Upcoming', 'Everything wey still open for entry.')}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.smallRow}>
              {upcoming.map((r) => (
                <UpcomingCard key={r.id} room={r} onPress={() => onRoomButton(r)} />
              ))}
            </ScrollView>
          </>
        ) : null}

        {/* ============================================================
            CATEGORIES  +  PLAY MORE EARN MORE
        ============================================================ */}
        <View style={styles.duoRow}>
          {/* left: the categories card */}
          <View style={styles.catCard}>
            <View style={styles.catHead}>
              <Ionicons name="grid" size={14} color="#8B8BA5" />
              <Text style={styles.catTitle}>CATEGORIES</Text>
            </View>

            <View style={styles.catGrid}>
              {CATEGORY_ICONS.map((c) => (
                <Pressable
                  key={c.key}
                  onPress={() => soon(c.label, 'All ' + c.label + ' rooms, filtered for you.')}
                  style={({ pressed }) => [styles.catTile, pressed && { opacity: 0.85 }]}
                >
                  <Ionicons name={c.icon} size={16} color="#C9C9DC" />
                  <Text style={styles.catTileText}>{c.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* right: the promo card */}
          <View style={styles.promoCard}>
            <Image
              source={require('../../../assets/zivo/tour/v2-chest.jpg')}
              style={styles.promoArt}
              contentFit="cover"
            />
            <LinearGradient
              colors={['rgba(23,16,56,0.98)', 'rgba(23,16,56,0.55)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.promoInner}>
              <Text style={styles.promoTitle}>PLAY MORE,{'\n'}EARN MORE</Text>
              <Text style={styles.promoSub}>Join tournaments, get coins, climb the ranks.</Text>

              <Pressable
                onPress={() => router.push('/(tabs)/rewards')}
                style={({ pressed }) => [styles.promoBtn, pressed && { opacity: 0.88 }]}
              >
                <Text style={styles.promoBtnText}>Explore Rewards</Text>
                <Ionicons name="arrow-forward" size={12} color="#171000" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* ============================================================
            FEATURED TOURNAMENTS
        ============================================================ */}
        <SectionHead
          title="Featured Tournaments"
          icon="trophy"
          iconColour="#FFC529"
          action="See All →"
          onAction={() => soon('Featured', 'Rooms wey ZIVO dey push this week.')}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.smallRow}>
          {FEATURED.map((f) => (
            <Pressable
              key={f.name}
              onPress={() => soon(f.name, 'Room detail: prize, rules and how to enter.')}
              style={({ pressed }) => [styles.featCard, pressed && { opacity: 0.92 }]}
            >
              <Image source={f.art} style={styles.featArt} contentFit="cover" />
              <LinearGradient
                colors={['rgba(19,19,30,0)', 'rgba(19,19,30,0.95)']}
                style={StyleSheet.absoluteFill}
              />

              <View style={[styles.tagChip, { backgroundColor: f.tagColour }]}>
                <Text style={styles.tagChipText}>{f.tag}</Text>
              </View>

              <View style={styles.featBody}>
                <View style={[styles.crest, { borderColor: f.crestColour }]}>
                  <Ionicons name={f.crest} size={18} color={f.crestColour} />
                </View>
                <Text style={styles.featName} numberOfLines={1}>{f.name}</Text>
                <Text style={styles.featMeta}>{f.meta}</Text>

                <View style={styles.featStatRow}>
                  <View style={styles.featStat}>
                    <Ionicons name="cash-outline" size={11} color="#FFC529" />
                    <Text style={styles.featStatLabel}>Prize</Text>
                  </View>
                  <Text style={styles.featStatValue}>{f.prize}</Text>
                </View>

                <View style={styles.featStatRow}>
                  <View style={styles.featStat}>
                    <Ionicons name="ticket-outline" size={11} color="#8B8BA5" />
                    <Text style={styles.featStatLabel}>Entry</Text>
                  </View>
                  <Text style={styles.featEntryValue}>{f.entry}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.footer}>Independent platform · Not affiliated with Garena</Text>
      </ScrollView>
    </View>
  );
}

// ============================================================
//  3. SMALL PIECES USED ABOVE
// ============================================================

/** A section heading: small icon, title, and a link on the right. */
function SectionHead({ title, icon, iconColour, action, onAction }) {
  return (
    <View style={styles.sectionHead}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
        <Ionicons name={icon} size={16} color={iconColour} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Pressable onPress={onAction} hitSlop={8}>
        <Text style={styles.sectionAction}>{action}</Text>
      </Pressable>
    </View>
  );
}

/**
 * The big LIVE card. The picture is the background of the whole
 * card, the words sit on top of it.
 */
function LiveCard({ room, onPress }) {
  const isWatch = room.button === 'Watch';

  return (
    <View style={styles.liveCard}>
      <Image source={room.art} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={['rgba(6,6,14,0.55)', 'rgba(6,6,14,0.86)', 'rgba(6,6,14,0.97)']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* stage tag, top left */}
      <View style={[styles.liveTag, { backgroundColor: room.tagColour }]}>
        {room.stage === 'live' ? <View style={styles.liveTagDot} /> : null}
        <Text style={styles.liveTagText}>{room.tag}</Text>
      </View>

      <Text style={styles.liveGameMark}>
        FREE <Text style={{ color: '#FF8A00' }}>FIRE</Text>
      </Text>

      <View style={styles.liveBody}>
        <Text style={styles.liveName}>{room.name}</Text>
        <Text style={styles.liveMeta}>{room.meta}</Text>

        <View style={styles.liveFacts}>
          <View style={styles.liveFact}>
            <View style={styles.factIcon}>
              <Ionicons name="logo-bitcoin" size={11} color="#FFC529" />
            </View>
            <Text style={styles.factLabel}>Prize</Text>
            <Text style={styles.factPrize}>{room.prize}</Text>
          </View>

          <View style={styles.liveFact}>
            <View style={styles.factIcon}>
              <Ionicons name="ticket-outline" size={11} color="#C9C9DC" />
            </View>
            <Text style={styles.factLabel}>Entry</Text>
            <Text style={styles.factValue}>{room.entry}</Text>
          </View>

          {/* the little stack of who is inside */}
          <View style={styles.avatarStack}>
            <Image source={require('../../../assets/zivo/avatar.jpg')} style={styles.stackPic} />
            <Image source={require('../../../assets/zivo/avatar.jpg')} style={[styles.stackPic, styles.stackPic2]} />
            <Image source={require('../../../assets/zivo/avatar.jpg')} style={[styles.stackPic, styles.stackPic3]} />
            <Text style={styles.stackMore}>+{room.joined}</Text>
          </View>
        </View>

        <Pressable onPress={onPress} style={({ pressed }) => [styles.liveBtn, pressed && { opacity: 0.88 }]}>
          {isWatch ? (
            <View style={styles.watchInner}>
              <Ionicons name="play" size={13} color="#171000" />
              <Text style={styles.watchText}>Watch</Text>
            </View>
          ) : (
            <View style={styles.joinInner}>
              <Text style={styles.joinText}>Join</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

/** The smaller upcoming card (scrolls sideways). */
function UpcomingCard({ room, onPress }) {
  const full = room.button === 'Full';

  return (
    <View style={styles.upCard}>
      <View style={styles.upArtWrap}>
        <Image source={room.art} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient colors={['rgba(6,6,14,0.15)', 'rgba(19,19,30,1)']} style={StyleSheet.absoluteFill} />

        <View style={[styles.upTag, { borderColor: room.tagColour + '99', backgroundColor: room.tagColour + '22' }]}>
          <Ionicons name="time-outline" size={9} color={room.tagColour} />
          <Text style={[styles.upTagText, { color: room.tagColour }]}>{room.tag}</Text>
        </View>
      </View>

      <View style={styles.upBody}>
        <Text style={styles.upName} numberOfLines={1}>{room.name}</Text>
        <Text style={styles.upMeta} numberOfLines={1}>{room.meta}</Text>

        <View style={styles.upStatRow}>
          <View style={styles.upStatLeft}>
            <View style={styles.factIcon}>
              <Ionicons name="logo-bitcoin" size={10} color="#FFC529" />
            </View>
            <Text style={styles.factLabel}>Prize</Text>
          </View>
          <Text style={styles.factPrize}>{room.prize}</Text>
        </View>

        <View style={styles.upStatRow}>
          <View style={styles.upStatLeft}>
            <View style={styles.factIcon}>
              <Ionicons name="ticket-outline" size={10} color="#C9C9DC" />
            </View>
            <Text style={styles.factLabel}>Entry</Text>
          </View>
          <Text style={styles.factValue}>{room.entry}</Text>
        </View>

        <Pressable
          onPress={onPress}
          disabled={full}
          style={({ pressed }) => [
            full ? styles.upBtnFull : styles.upBtn,
            pressed && !full && { opacity: 0.85 },
          ]}
        >
          <Text style={full ? styles.upBtnFullText : styles.upBtnText}>{room.button}</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ============================================================
//  4. THE STYLES
// ============================================================
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#08080F' },
  scrollBody: { paddingBottom: 26 },

  // --- header ---
  header: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 14, paddingBottom: 12 },
  logo: { width: 30, height: 30 },
  brand: { fontFamily: 'BebasNeue', fontSize: 24, letterSpacing: 2.5, color: '#F4F4F8' },
  brandSub: { fontFamily: 'Rajdhani-Bold', fontSize: 7.5, letterSpacing: 1.6, color: '#5C5C76', marginTop: -2 },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,197,41,0.35)',
    backgroundColor: 'rgba(255,197,41,0.10)',
    paddingLeft: 9,
    paddingRight: 4,
    paddingVertical: 4,
  },
  coinText: { fontFamily: 'Rajdhani-Bold', fontSize: 12.5, color: '#FFC529' },
  coinPlus: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: '#FFC529',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: { padding: 8, backgroundColor: '#13131E', borderRadius: 10, borderWidth: 1, borderColor: '#2A2A3E' },
  bellBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  bellBadgeText: { fontFamily: 'Rajdhani-Bold', fontSize: 9, color: '#FFFFFF' },
  avatar: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: '#22C55E' },

  // --- featured carousel ---
  heroCard: { height: 214, marginLeft: 14, borderRadius: 18, overflow: 'hidden', backgroundColor: '#13131E' },
  heroInner: { flex: 1, justifyContent: 'center', paddingHorizontal: 15 },
  featPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,197,41,0.4)',
    backgroundColor: 'rgba(255,197,41,0.12)',
    borderRadius: 100,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginBottom: 8,
  },
  featText: { fontFamily: 'Rajdhani-Bold', fontSize: 8.5, letterSpacing: 1, color: '#FFC529' },
  heroBrand: {
    fontFamily: 'BebasNeue',
    fontSize: 30,
    letterSpacing: 1,
    color: '#FFC529',
    textShadowColor: 'rgba(255,138,0,0.75)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  heroSub: { fontFamily: 'Rajdhani-Bold', fontSize: 10.5, letterSpacing: 1.2, color: '#C9C9DC', marginTop: 1 },

  heroMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  heroMetaBit: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroMetaLabel: { fontFamily: 'Rajdhani-Medium', fontSize: 9.5, color: '#8B8BA5' },
  heroMetaValue: { fontFamily: 'Rajdhani-Bold', fontSize: 11, color: '#F4F4F8' },
  heroDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.14)', marginHorizontal: 10 },

  heroBtn: { alignSelf: 'flex-start', borderRadius: 11, overflow: 'hidden', marginTop: 13, width: 158 },
  heroBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  heroBtnText: { fontFamily: 'Rajdhani-Bold', fontSize: 13, color: '#171000' },
  gameMark: {
    position: 'absolute',
    top: 12,
    right: 12,
    fontFamily: 'BebasNeue',
    fontSize: 15,
    letterSpacing: 1,
    color: '#F4F4F8',
  },

  heroDots: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 11 },
  heroDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.22)' },
  heroDotOn: { backgroundColor: '#FFC529', width: 18 },

  // --- category tiles ---
  tileRow: { paddingHorizontal: 14, gap: 9, marginTop: 16, paddingBottom: 2 },
  tile: {
    width: 118,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
    borderRadius: 15,
    padding: 10,
  },
  tileOn: { borderColor: '#FFC529', backgroundColor: '#1A1710' },
  tileIcon: { width: 32, height: 32, borderRadius: 11, backgroundColor: '#1D1D2C', alignItems: 'center', justifyContent: 'center' },
  tileLabel: { fontFamily: 'Rajdhani-Bold', fontSize: 12.5, color: '#F4F4F8', marginTop: 8 },
  tileSub: { fontFamily: 'Rajdhani-Medium', fontSize: 9.5, color: '#8B8BA5', marginTop: 1 },

  // --- filters ---
  filterWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, paddingHorizontal: 14, marginTop: 16 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
    borderRadius: 100,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  filterChipOn: { borderColor: 'rgba(255,197,41,0.6)', backgroundColor: 'rgba(255,197,41,0.10)' },
  filterText: { fontFamily: 'Rajdhani-SemiBold', fontSize: 11.5, color: '#C9C9DC' },

  showing: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 9.5,
    letterSpacing: 1.4,
    color: '#5C5C76',
    paddingHorizontal: 14,
    marginTop: 12,
  },

  // --- section heads ---
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: { fontFamily: 'BebasNeue', fontSize: 21, letterSpacing: 0.6, color: '#F4F4F8' },
  sectionAction: { fontFamily: 'Rajdhani-SemiBold', fontSize: 11.5, color: '#8B8BA5' },

  // --- live cards ---
  bigRow: { paddingHorizontal: 14, gap: 11 },
  liveCard: {
    width: 268,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
  },
  liveTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 100,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  liveTagDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#0B0B12' },
  liveTagText: { fontFamily: 'Rajdhani-Bold', fontSize: 8.5, letterSpacing: 0.8, color: '#0B0B12' },
  liveGameMark: { position: 'absolute', top: 13, right: 11, fontFamily: 'BebasNeue', fontSize: 12, letterSpacing: 0.8, color: '#F4F4F8' },
  liveBody: { padding: 12, paddingTop: 108 },
  liveName: { fontFamily: 'Rajdhani-Bold', fontSize: 17, color: '#F4F4F8' },
  liveMeta: { fontFamily: 'Rajdhani-Medium', fontSize: 11, color: '#C9C9DC', marginTop: 2 },

  liveFacts: { flexDirection: 'row', alignItems: 'center', marginTop: 11 },
  liveFact: { flexDirection: 'row', alignItems: 'center', gap: 5, marginRight: 14 },
  factIcon: { width: 20, height: 20, borderRadius: 7, backgroundColor: '#1D1D2C', alignItems: 'center', justifyContent: 'center' },
  factLabel: { fontFamily: 'Rajdhani-Medium', fontSize: 9.5, color: '#8B8BA5' },
  factPrize: { fontFamily: 'Rajdhani-Bold', fontSize: 12, color: '#FFC529' },
  factValue: { fontFamily: 'Rajdhani-Bold', fontSize: 12, color: '#F4F4F8' },

  avatarStack: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' },
  stackPic: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#13131E' },
  stackPic2: { marginLeft: -7, opacity: 0.85 },
  stackPic3: { marginLeft: -7, opacity: 0.7 },
  stackMore: { fontFamily: 'Rajdhani-Bold', fontSize: 10, color: '#C9C9DC', marginLeft: 5 },

  liveBtn: { borderRadius: 11, overflow: 'hidden', marginTop: 12 },
  watchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    backgroundColor: '#FFC529',
  },
  watchText: { fontFamily: 'Rajdhani-Bold', fontSize: 14, color: '#171000' },
  joinInner: { alignItems: 'center', justifyContent: 'center', paddingVertical: 11, backgroundColor: '#6D48F5' },
  joinText: { fontFamily: 'Rajdhani-Bold', fontSize: 14, color: '#FFFFFF' },

  // --- upcoming cards ---
  smallRow: { paddingHorizontal: 14, gap: 10 },
  upCard: {
    width: 158,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
  },
  upArtWrap: { height: 74 },
  upTag: {
    position: 'absolute',
    bottom: 7,
    left: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  upTagText: { fontFamily: 'Rajdhani-Bold', fontSize: 8, letterSpacing: 0.5 },
  upBody: { padding: 10 },
  upName: { fontFamily: 'Rajdhani-Bold', fontSize: 13.5, color: '#F4F4F8' },
  upMeta: { fontFamily: 'Rajdhani-Medium', fontSize: 10, color: '#8B8BA5', marginTop: 1 },
  upStatRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  upStatLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  upBtn: { borderRadius: 10, paddingVertical: 9, alignItems: 'center', backgroundColor: '#FFC529', marginTop: 11 },
  upBtnText: { fontFamily: 'Rajdhani-Bold', fontSize: 12.5, color: '#171000' },
  upBtnFull: { borderRadius: 10, paddingVertical: 9, alignItems: 'center', backgroundColor: '#1D1D2C', marginTop: 11 },
  upBtnFullText: { fontFamily: 'Rajdhani-Bold', fontSize: 12.5, color: '#5C5C76' },

  // --- categories + promo ---
  duoRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 14, marginTop: 22 },
  catCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
    borderRadius: 16,
    padding: 11,
  },
  catHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  catTitle: { fontFamily: 'Rajdhani-Bold', fontSize: 10, letterSpacing: 1.2, color: '#8B8BA5' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catTile: {
    width: '29%',
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#1A1A28',
    borderRadius: 11,
    paddingVertical: 9,
    alignItems: 'center',
    gap: 4,
  },
  catTileText: { fontFamily: 'Rajdhani-SemiBold', fontSize: 9.5, color: '#C9C9DC' },

  promoCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(124,92,255,0.4)',
    backgroundColor: '#171038',
  },
  promoArt: { position: 'absolute', right: 0, top: 0, width: '58%', height: '100%' },
  promoInner: { padding: 11, width: '78%' },
  promoTitle: { fontFamily: 'BebasNeue', fontSize: 18, letterSpacing: 0.4, color: '#FFFFFF', lineHeight: 20 },
  promoSub: { fontFamily: 'Rajdhani-Medium', fontSize: 9.5, color: '#C9C9DC', marginTop: 5, lineHeight: 13 },
  promoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#FFC529',
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 10,
  },
  promoBtnText: { fontFamily: 'Rajdhani-Bold', fontSize: 10.5, color: '#171000' },

  // --- featured tournaments ---
  featCard: {
    width: 214,
    height: 196,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
    justifyContent: 'flex-end',
  },
  featArt: { ...StyleSheet.absoluteFillObject, height: 120 },
  tagChip: {
    position: 'absolute',
    top: 9,
    right: 9,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagChipText: { fontFamily: 'Rajdhani-Bold', fontSize: 8, letterSpacing: 0.8, color: '#FFFFFF' },
  featBody: { padding: 11 },
  crest: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.6,
    backgroundColor: 'rgba(8,8,15,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  featName: { fontFamily: 'BebasNeue', fontSize: 16, letterSpacing: 0.6, color: '#F4F4F8' },
  featMeta: { fontFamily: 'Rajdhani-Medium', fontSize: 10, color: '#8B8BA5', marginTop: 1, marginBottom: 6 },
  featStatRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 },
  featStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  featStatLabel: { fontFamily: 'Rajdhani-Medium', fontSize: 9.5, color: '#8B8BA5' },
  featStatValue: { fontFamily: 'Rajdhani-Bold', fontSize: 11.5, color: '#FFC529' },
  featEntryValue: { fontFamily: 'Rajdhani-Bold', fontSize: 11.5, color: '#F4F4F8' },

  // --- empty state ---
  empty: {
    marginHorizontal: 14,
    marginTop: 14,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
    alignItems: 'center',
  },
  emptyTitle: { fontFamily: 'Rajdhani-Bold', fontSize: 15.5, color: '#F4F4F8', marginTop: 9 },
  emptyBody: { fontFamily: 'Rajdhani-Medium', fontSize: 11.5, color: '#8B8BA5', textAlign: 'center', marginTop: 4, lineHeight: 17 },
  emptyBtn: { marginTop: 13, borderWidth: 1, borderColor: 'rgba(255,197,41,0.6)', borderRadius: 11, paddingHorizontal: 15, paddingVertical: 8 },
  emptyBtnText: { fontFamily: 'Rajdhani-Bold', fontSize: 12, color: '#FFC529' },

  footer: { fontFamily: 'Rajdhani-Medium', fontSize: 10, color: '#3A3A4C', textAlign: 'center', marginTop: 20 },
});
