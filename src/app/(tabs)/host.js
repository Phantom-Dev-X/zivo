/**
 * ============================================================
 *  ZIVO — HOST A ROOM  (the wizard)
 * ============================================================
 *  This is the green orb / "Custom Room" / "Host Room" button.
 *  It walks the host through 6 steps, one question at a time:
 *
 *     1  MODE       Battle Royale or Clash Squad
 *     2  FORMAT     Solo / Duo / Squad  (or 4v4 / 2v2)
 *     3  ENTRY      free or coins, and the prize you put up
 *     4  RULES      the settings every ZIVO room must keep
 *     5  TIME       which day, which hour
 *     6  REVIEW     read it, agree, publish
 *
 *  Then it gives you a ROOM CODE and a share link.
 *
 *  Read the file in 4 parts:
 *     1. the imports
 *     2. the DATA (the choices shown on each step)
 *     3. the screen (the wizard itself)
 *     4. the styles
 *
 *  THE RULES ON STEP 4 COME FROM THE ROOM RESEARCH:
 *  Character Skills OFF, password on, own-team spectator view,
 *  mobile only, min level, and a referee for cash rooms.
 *  They are locked ON for a reason — read the notes on the page.
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
  Share,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============================================================
//  1. THE DATA — every choice the wizard shows
// ============================================================

/** the 6 steps, used for the title at the top */
const STEPS = ['MODE', 'FORMAT', 'ENTRY', 'RULES', 'TIME', 'REVIEW'];

/** step 1 — the two game modes */
const MODES = [
  {
    key: 'br',
    label: 'Battle Royale',
    sub: '48 players drop, one survives',
    icon: 'earth',
    art: require('../../../assets/zivo/tour/v3-hero.jpg'),
  },
  {
    key: 'cs',
    label: 'Clash Squad',
    sub: '4v4 rounds, first to 4 wins',
    icon: 'people',
    art: require('../../../assets/zivo/tour/v2-squad.jpg'),
  },
];

/** step 2 — how many players per team */
const FORMATS = {
  br: [
    { key: 'solo', label: 'Solo', sub: 'every man for himself' },
    { key: 'duo', label: 'Duo', sub: 'two players, one slot' },
    { key: 'squad', label: 'Squad', sub: 'four players, one slot' },
  ],
  cs: [
    { key: '4v4', label: '4 v 4', sub: 'the standard ZIVO clash' },
    { key: '2v2', label: '2 v 2', sub: 'small and fast' },
  ],
};

/** step 3 — entry fee choices, in coins */
const ENTRY_COINS = [100, 250, 500];

/** step 3 — prize choices, in naira. 0 means "coin pot". */
const PRIZES = [
  { value: 2000, label: '₦2,000' },
  { value: 5000, label: '₦5,000' },
  { value: 10000, label: '₦10,000' },
  { value: 25000, label: '₦25,000' },
  { value: 0, label: 'Coin pot' },
];

/** step 5 — when the room runs */
const DAYS = ['Today', 'Tomorrow', 'Sat 20', 'Sun 21'];
const TIMES = ['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'];

/** the minimum level a player must reach before joining */
const LEVELS = ['Any', '20', '30', '40'];

/** what hosting costs you, in coins */
const HOSTING_FEE = 100;

// ============================================================
//  2. THE SCREEN
// ============================================================
export default function Host() {
  const insets = useSafeAreaInsets();

  // ---- which step we are on ----
  const [step, setStep] = useState(0);

  // ---- everything the host has chosen so far ----
  const [mode, setMode] = useState('br');
  const [format, setFormat] = useState('squad');
  const [slots, setSlots] = useState(48);
  const [bestOf, setBestOf] = useState('Best of 3');

  const [roomName, setRoomName] = useState('');
  const [entry, setEntry] = useState('free'); // 'free' or 'coins'
  const [entryCoins, setEntryCoins] = useState(100);
  const [prize, setPrize] = useState(5000); // 0 = coin pot

  const [referee, setReferee] = useState(true);
  const [minLevel, setMinLevel] = useState('30');

  const [day, setDay] = useState('Today');
  const [time, setTime] = useState('7:00 PM');

  const [agree, setAgree] = useState(false);

  // ---- the room code we hand over after publishing ----
  const [published, setPublished] = useState('');

  const isCS = mode === 'cs';
  const stepColour = '#FFC529';

  /** move forward one step (or backwards, with -1) */
  function go(by) {
    const next = step + by;
    if (next < 0) return router.replace('/(tabs)'); // leaving from step 1 = go home
    if (next > STEPS.length - 1) return;
    setStep(next);
  }

  /** step 1: picking a mode also fixes a sensible default format + slots */
  function pickMode(key) {
    setMode(key);
    setFormat(key === 'br' ? 'squad' : '4v4');
    setSlots(key === 'br' ? 48 : 8);
  }

  /** the publish button on the last step */
  function publish() {
    if (!agree) {
      return Alert.alert('One more thing', 'Tick the box to confirm you will pay the winner yourself.');
    }
    // make a short room code, like ZIVO-4F9K
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i += 1) {
      code += letters[Math.floor(Math.random() * letters.length)];
    }
    setPublished(code);
  }

  /** share the room link on WhatsApp or anywhere else */
  async function shareRoom() {
    try {
      await Share.share({
        message:
          'ZIVO room ' +
          roomLabel +
          ' — ' +
          formatLabel +
          ' ' +
          (isCS ? 'Clash Squad' : 'Battle Royale') +
          ', ' +
          day +
          ' ' +
          time +
          '.\nRoom code: ZIVO-' +
          published +
          '\nPrize: ' +
          prizeLabel +
          '\nJoin here: https://zivo.gg/r/' +
          published,
      });
    } catch (e) {
      // they closed the share sheet — no wahala
    }
  }

  // ---- little bits of text we reuse below ----
  const roomLabel = roomName.trim() === '' ? 'My Room' : roomName.trim();
  const formatLabel = isCS ? format : format.charAt(0).toUpperCase() + format.slice(1);
  const prizeLabel = prize === 0 ? 'Coin pot' : '₦' + prize.toLocaleString();

  // ============================================================
  //  THE SUCCESS SCREEN (after publishing)
  // ============================================================
  if (published !== '') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 40, paddingHorizontal: 20 }]}>
        <View style={styles.doneCircle}>
          <Ionicons name="checkmark" size={34} color="#0B0B12" />
        </View>

        <Text style={styles.doneTitle}>ROOM DON READY</Text>
        <Text style={styles.doneSub}>Share this code with the players you want in the room.</Text>

        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>ROOM CODE</Text>
          <Text style={styles.codeText}>ZIVO-{published}</Text>
          <View style={styles.codeRule} />
          <Text style={styles.codeBit}>{roomLabel} · {formatLabel}</Text>
          <Text style={styles.codeBit}>{day} · {time}</Text>
          <Text style={styles.codeBit}>Prize: {prizeLabel}</Text>
        </View>

        <Pressable onPress={shareRoom} style={({ pressed }) => [styles.goldWrap, pressed && { opacity: 0.88 }]}>
          <LinearGradient
            colors={['#FFC529', '#FF6A00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.goldInner}
          >
            <Ionicons name="logo-whatsapp" size={17} color="#171000" />
            <Text style={styles.goldText}>Share the link</Text>
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={() => router.push('/(tabs)/tournaments')}
          style={({ pressed }) => [styles.ghostWrap, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.ghostText}>See it on the Tournaments page</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setPublished('');
            setStep(0);
            setRoomName('');
            setAgree(false);
          }}
          hitSlop={8}
          style={{ marginTop: 18 }}
        >
          <Text style={styles.linkText}>Host another room</Text>
        </Pressable>
      </View>
    );
  }

  // ============================================================
  //  THE WIZARD
  // ============================================================
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollBody, { paddingTop: insets.top + 10 }]}
      >
        {/* ---------- top: back arrow + step counter ---------- */}
        <View style={styles.topBar}>
          <Pressable onPress={() => go(-1)} hitSlop={10} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#F4F4F8" />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={styles.topTitle}>HOST A ROOM</Text>
            <Text style={styles.topStep}>
              STEP {step + 1} OF {STEPS.length} · {STEPS[step]}
            </Text>
          </View>

          <Pressable
            onPress={() => router.push('/(tabs)/tournaments')}
            hitSlop={8}
          >
            <Ionicons name="close" size={20} color="#8B8BA5" />
          </Pressable>
        </View>

        {/* ---------- the progress bar ---------- */}
        <View style={styles.progressRow}>
          {STEPS.map((s, i) => (
            <View
              key={s}
              style={[styles.progressBit, i <= step && { backgroundColor: stepColour }]}
            />
          ))}
        </View>

        {/* ============================================================
            STEP 1 — MODE
        ============================================================ */}
        {step === 0 ? (
          <View>
            <Text style={styles.q}>Which game mode?</Text>
            <Text style={styles.qSub}>This decides the room settings we lock for you later.</Text>

            {MODES.map((m) => (
              <Pressable
                key={m.key}
                onPress={() => pickMode(m.key)}
                style={({ pressed }) => [
                  styles.modeCard,
                  mode === m.key && styles.modeCardOn,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Image source={m.art} style={StyleSheet.absoluteFill} contentFit="cover" />
                <LinearGradient
                  colors={['rgba(6,6,14,0.92)', 'rgba(6,6,14,0.55)']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
                />

                <View style={styles.modeInner}>
                  <View style={[styles.modeIcon, mode === m.key && { backgroundColor: 'rgba(255,197,41,0.2)' }]}>
                    <Ionicons name={m.icon} size={20} color={mode === m.key ? '#FFC529' : '#C9C9DC'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modeLabel}>{m.label}</Text>
                    <Text style={styles.modeSub}>{m.sub}</Text>
                  </View>
                  {mode === m.key ? (
                    <Ionicons name="checkmark-circle" size={22} color="#FFC529" />
                  ) : (
                    <View style={styles.emptyCircle} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        ) : null}

        {/* ============================================================
            STEP 2 — FORMAT + SLOTS
        ============================================================ */}
        {step === 1 ? (
          <View>
            <Text style={styles.q}>How will you play?</Text>
            <Text style={styles.qSub}>
              {isCS ? 'Clash Squad rounds.' : 'How many players share one slot.'}
            </Text>

            <View style={styles.pillRow}>
              {FORMATS[mode].map((f) => (
                <Pressable
                  key={f.key}
                  onPress={() => {
                    setFormat(f.key);
                    setSlots(mode === 'br' ? (f.key === 'solo' ? 48 : 48) : f.key === '4v4' ? 8 : 4);
                  }}
                  style={({ pressed }) => [styles.bigPill, format === f.key && styles.bigPillOn, pressed && { opacity: 0.9 }]}
                >
                  <Text style={[styles.bigPillLabel, format === f.key && { color: '#FFC529' }]}>{f.label}</Text>
                  <Text style={styles.bigPillSub}>{f.sub}</Text>
                </Pressable>
              ))}
            </View>

            {/* Clash Squad also needs a round count */}
            {isCS ? (
              <>
                <Text style={styles.qSmall}>Rounds</Text>
                <View style={styles.pillRow}>
                  {['Best of 3', 'Best of 5'].map((b) => (
                    <Pressable
                      key={b}
                      onPress={() => setBestOf(b)}
                      style={({ pressed }) => [styles.smallPill, bestOf === b && styles.smallPillOn, pressed && { opacity: 0.9 }]}
                    >
                      <Text style={[styles.smallPillText, bestOf === b && { color: '#FFC529' }]}>{b}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            ) : null}

            {/* the slots stepper */}
            <Text style={styles.qSmall}>
              {isCS ? 'Players per side' : 'Room slots'}
            </Text>
            <View style={styles.stepperCard}>
              <Pressable
                onPress={() => setSlots((s) => Math.max(4, s - 4))}
                style={({ pressed }) => [styles.stepBtn, pressed && { opacity: 0.8 }]}
                hitSlop={6}
              >
                <Ionicons name="remove" size={20} color="#F4F4F8" />
              </Pressable>

              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={styles.stepperValue}>{slots}</Text>
                <Text style={styles.stepperLabel}>{isCS ? 'each side' : 'players'}</Text>
              </View>

              <Pressable
                onPress={() => setSlots((s) => Math.min(48, s + 4))}
                style={({ pressed }) => [styles.stepBtn, pressed && { opacity: 0.8 }]}
                hitSlop={6}
              >
                <Ionicons name="add" size={20} color="#F4F4F8" />
              </Pressable>
            </View>

            <Text style={styles.help}>
              ZIVO custom rooms are capped at 48 players — that is the highest Free Fire allows.
            </Text>
          </View>
        ) : null}

        {/* ============================================================
            STEP 3 — ENTRY FEE + PRIZE
        ============================================================ */}
        {step === 2 ? (
          <View>
            <Text style={styles.q}>Name your room</Text>
            <TextInput
              value={roomName}
              onChangeText={setRoomName}
              placeholder="e.g. 9JA Friday Clash"
              placeholderTextColor="#5C5C76"
              maxLength={26}
              style={styles.input}
            />

            <Text style={styles.q}>Entry fee</Text>
            <View style={styles.pillRow}>
              <Pressable
                onPress={() => setEntry('free')}
                style={({ pressed }) => [styles.smallPill, entry === 'free' && styles.smallPillOn, pressed && { opacity: 0.9 }]}
              >
                <Text style={[styles.smallPillText, entry === 'free' && { color: '#FFC529' }]}>Free entry</Text>
              </Pressable>
              <Pressable
                onPress={() => setEntry('coins')}
                style={({ pressed }) => [styles.smallPill, entry === 'coins' && styles.smallPillOn, pressed && { opacity: 0.9 }]}
              >
                <Text style={[styles.smallPillText, entry === 'coins' && { color: '#FFC529' }]}>Coins</Text>
              </Pressable>
            </View>

            {entry === 'coins' ? (
              <View style={styles.pillRow}>
                {ENTRY_COINS.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setEntryCoins(c)}
                    style={({ pressed }) => [styles.smallPill, entryCoins === c && styles.smallPillOn, pressed && { opacity: 0.9 }]}
                  >
                    <Text style={[styles.smallPillText, entryCoins === c && { color: '#FFC529' }]}>{c} coins</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            <Text style={styles.q}>Prize you are putting up</Text>
            <Text style={styles.qSub}>
              You pay the winner yourself. ZIVO never holds the prize money.
            </Text>
            <View style={styles.pillRow}>
              {PRIZES.map((p) => (
                <Pressable
                  key={p.label}
                  onPress={() => setPrize(p.value)}
                  style={({ pressed }) => [styles.smallPill, prize === p.value && styles.smallPillOn, pressed && { opacity: 0.9 }]}
                >
                  <Text style={[styles.smallPillText, prize === p.value && { color: '#FFC529' }]}>{p.label}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.feeCard}>
              <Ionicons name="logo-bitcoin" size={16} color="#FFC529" />
              <Text style={styles.feeText}>
                Hosting fee: <Text style={{ color: '#FFC529' }}>{HOSTING_FEE} coins</Text>
              </Text>
              <Text style={styles.feeRight}>Balance: 2,450</Text>
            </View>
          </View>
        ) : null}

        {/* ============================================================
            STEP 4 — THE RULES
        ============================================================ */}
        {step === 3 ? (
          <View>
            <Text style={styles.q}>Room rules</Text>
            <Text style={styles.qSub}>
              These keep every ZIVO room fair, so the better player wins — not the
              richer one, and not the one with the strongest character.
            </Text>

            <LockedRule
              icon="flash-off"
              title="Character Skills OFF"
              note="Free Fire custom rooms switch character skills off. Everybody plays with pure gun skill."
            />
            <LockedRule
              icon="lock-closed"
              title="Password required"
              note="Only players with your room code can enter. No gate-crashers."
            />
            <LockedRule
              icon="eye"
              title="Spectators see their own team only"
              note="Anti-cheat: nobody can watch the whole map and feed info to a friend."
            />
            <LockedRule
              icon="phone-portrait"
              title="Mobile only"
              note="No emulator players. Phone against phone."
            />

            {/* the one rule the host controls */}
            <View style={styles.ruleCard}>
              <View style={styles.ruleTop}>
                <View style={[styles.ruleIcon, { backgroundColor: 'rgba(124,92,255,0.18)' }]}>
                  <Ionicons name="videocam" size={16} color="#7C5CFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ruleTitle}>Referee records the match</Text>
                  <Text style={styles.ruleNote}>
                    A referee watches from the spectator slot and records everything.
                    Mandatory when the prize is cash.
                  </Text>
                </View>
                <Switch
                  value={referee}
                  onValueChange={setReferee}
                  trackColor={{ false: '#2A2A3E', true: 'rgba(124,92,255,0.6)' }}
                  thumbColor={referee ? '#7C5CFF' : '#5C5C76'}
                />
              </View>
            </View>

            {/* minimum level */}
            <Text style={styles.qSmall}>Minimum level to join</Text>
            <View style={styles.pillRow}>
              {LEVELS.map((l) => (
                <Pressable
                  key={l}
                  onPress={() => setMinLevel(l)}
                  style={({ pressed }) => [styles.smallPill, minLevel === l && styles.smallPillOn, pressed && { opacity: 0.9 }]}
                >
                  <Text style={[styles.smallPillText, minLevel === l && { color: '#FFC529' }]}>
                    {l === 'Any' ? 'Any level' : 'Lv. ' + l + '+'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.help}>
              Beginners get eaten alive in high-level rooms. If you are hosting
              for new players, set Lv. 20 or below.
            </Text>
          </View>
        ) : null}

        {/* ============================================================
            STEP 5 — WHEN
        ============================================================ */}
        {step === 4 ? (
          <View>
            <Text style={styles.q}>When does it start?</Text>
            <Text style={styles.qSub}>
              Check-in opens 15 minutes before this time. Players who no check in lose their slot.
            </Text>

            <Text style={styles.qSmall}>Day</Text>
            <View style={styles.pillRow}>
              {DAYS.map((d) => (
                <Pressable
                  key={d}
                  onPress={() => setDay(d)}
                  style={({ pressed }) => [styles.smallPill, day === d && styles.smallPillOn, pressed && { opacity: 0.9 }]}
                >
                  <Text style={[styles.smallPillText, day === d && { color: '#FFC529' }]}>{d}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.qSmall}>Kick-off time</Text>
            <View style={styles.pillRow}>
              {TIMES.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setTime(t)}
                  style={({ pressed }) => [styles.smallPill, time === t && styles.smallPillOn, pressed && { opacity: 0.9 }]}
                >
                  <Text style={[styles.smallPillText, time === t && { color: '#FFC529' }]}>{t}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.tipCard}>
              <Ionicons name="bulb" size={16} color="#F59E0B" />
              <Text style={styles.tipText}>
                Evening rooms (7 PM – 9 PM) fill up fastest in Lagos. Give players at
                least 3 hours from now so they can see the room and join.
              </Text>
            </View>
          </View>
        ) : null}

        {/* ============================================================
            STEP 6 — REVIEW + PUBLISH
        ============================================================ */}
        {step === 5 ? (
          <View>
            <Text style={styles.q}>Check am well</Text>
            <Text style={styles.qSub}>This is exactly what players will see.</Text>

            <View style={styles.reviewCard}>
              <View style={styles.reviewHead}>
                <Image source={require('../../../assets/zivo/tour/v3-hero.jpg')} style={styles.reviewArt} contentFit="cover" />
                <LinearGradient
                  colors={['rgba(6,6,14,0.85)', 'rgba(6,6,14,0.2)']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.reviewHeadInner}>
                  <Text style={styles.reviewName}>{roomLabel}</Text>
                  <Text style={styles.reviewMeta}>
                    {isCS ? 'Clash Squad' : 'Battle Royale'} · {formatLabel} · {slots}{isCS ? 'v' + slots : ''}
                  </Text>
                </View>
              </View>

              <ReviewRow label="Prize" value={prizeLabel} strong />
              <ReviewRow label="Entry" value={entry === 'free' ? 'Free entry' : entryCoins + ' coins'} />
              <ReviewRow label="Starts" value={day + ' · ' + time} />
              <ReviewRow label="Check-in" value="Opens 15 minutes before" />
              <ReviewRow label="Skills" value="OFF (locked)" />
              <ReviewRow label="Spectators" value="Own team only" />
              <ReviewRow label="Referee" value={referee ? (prize === 0 ? 'Yes' : 'Yes (required for cash)') : 'No'} />
              <ReviewRow label="Min level" value={minLevel === 'Any' ? 'Any level' : 'Lv. ' + minLevel + '+'} />
              <ReviewRow label="Hosting fee" value={HOSTING_FEE + ' coins'} />
            </View>

            {/* the money promise, in plain words */}
            <View style={styles.warnCard}>
              <Ionicons name="alert-circle" size={17} color="#F59E0B" />
              <Text style={styles.warnText}>
                ZIVO does not hold prize money. You pay the winner yourself within 24
                hours after the results lock, and you publish the payout receipt in the room.
              </Text>
            </View>

            <Pressable
              onPress={() => setAgree(!agree)}
              style={({ pressed }) => [styles.agreeRow, pressed && { opacity: 0.9 }]}
            >
              <View style={[styles.tickBox, agree && styles.tickBoxOn]}>
                {agree ? <Ionicons name="checkmark" size={14} color="#0B0B12" /> : null}
              </View>
              <Text style={styles.agreeText}>
                I understand I am paying the winner myself.
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* ---------- the gold button at the bottom ---------- */}
        <Pressable
          onPress={() => (step === STEPS.length - 1 ? publish() : go(1))}
          style={({ pressed }) => [styles.goldWrap, pressed && { opacity: 0.88 }]}
        >
          <LinearGradient
            colors={['#FFC529', '#FF6A00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.goldInner}
          >
            <Text style={styles.goldText}>
              {step === STEPS.length - 1 ? 'Publish room' : 'Continue'}
            </Text>
            <Ionicons name="arrow-forward" size={15} color="#171000" />
          </LinearGradient>
        </Pressable>

        <Text style={styles.footer}>
          ZIVO · Independent platform · Not affiliated with Garena
        </Text>
      </ScrollView>
    </View>
  );
}

// ============================================================
//  3. SMALL PIECES USED ABOVE
// ============================================================

/** a rule that is switched ON and cannot be changed, with the reason */
function LockedRule({ icon, title, note }) {
  return (
    <View style={styles.ruleCard}>
      <View style={styles.ruleTop}>
        <View style={[styles.ruleIcon, { backgroundColor: 'rgba(34,197,94,0.18)' }]}>
          <Ionicons name={icon} size={16} color="#22C55E" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.ruleTitle}>{title}</Text>
          <Text style={styles.ruleNote}>{note}</Text>
        </View>
        <View style={styles.lockChip}>
          <Text style={styles.lockChipText}>ON</Text>
        </View>
      </View>
    </View>
  );
}

/** one line of the review card */
function ReviewRow({ label, value, strong }) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={[styles.reviewValue, strong && { color: '#FFC529' }]}>{value}</Text>
    </View>
  );
}

// ============================================================
//  4. THE STYLES
// ============================================================
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#08080F' },
  scrollBody: { paddingHorizontal: 16, paddingBottom: 30 },

  // --- top bar ---
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { fontFamily: 'BebasNeue', fontSize: 20, letterSpacing: 1.5, color: '#F4F4F8' },
  topStep: { fontFamily: 'Rajdhani-Bold', fontSize: 9, letterSpacing: 1.2, color: '#5C5C76', marginTop: -1 },

  progressRow: { flexDirection: 'row', gap: 5, marginBottom: 20 },
  progressBit: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#23233A' },

  // --- the question ---
  q: { fontFamily: 'BebasNeue', fontSize: 23, letterSpacing: 0.8, color: '#F4F4F8', marginBottom: 2 },
  qSub: { fontFamily: 'Rajdhani-Medium', fontSize: 11.5, color: '#8B8BA5', marginBottom: 12, lineHeight: 16 },
  qSmall: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 10.5,
    letterSpacing: 1.2,
    color: '#8B8BA5',
    marginTop: 20,
    marginBottom: 8,
  },
  help: { fontFamily: 'Rajdhani-Medium', fontSize: 11, color: '#5C5C76', marginTop: 10, lineHeight: 16 },

  // --- step 1: mode cards ---
  modeCard: {
    height: 92,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
    marginBottom: 10,
  },
  modeCardOn: { borderColor: '#FFC529' },
  modeInner: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 13 },
  modeIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#1D1D2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeLabel: { fontFamily: 'Rajdhani-Bold', fontSize: 16, color: '#F4F4F8' },
  modeSub: { fontFamily: 'Rajdhani-Medium', fontSize: 11, color: '#8B8BA5', marginTop: 1 },
  emptyCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#3A3A4C' },

  // --- pills ---
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bigPill: {
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  bigPillOn: { borderColor: '#FFC529', backgroundColor: 'rgba(255,197,41,0.10)' },
  bigPillLabel: { fontFamily: 'Rajdhani-Bold', fontSize: 15, color: '#F4F4F8' },
  bigPillSub: { fontFamily: 'Rajdhani-Medium', fontSize: 9.5, color: '#8B8BA5', marginTop: 1 },

  smallPill: {
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
    borderRadius: 100,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  smallPillOn: { borderColor: '#FFC529', backgroundColor: 'rgba(255,197,41,0.10)' },
  smallPillText: { fontFamily: 'Rajdhani-SemiBold', fontSize: 12, color: '#C9C9DC' },

  // --- stepper ---
  stepperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
    borderRadius: 16,
    padding: 12,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#1D1D2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: { fontFamily: 'BebasNeue', fontSize: 30, color: '#FFC529' },
  stepperLabel: { fontFamily: 'Rajdhani-Medium', fontSize: 10, color: '#8B8BA5', marginTop: -4 },

  // --- text input ---
  input: {
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 15,
    color: '#F4F4F8',
    marginBottom: 6,
  },

  // --- the hosting fee line ---
  feeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,197,41,0.35)',
    backgroundColor: 'rgba(255,197,41,0.08)',
    borderRadius: 13,
    padding: 11,
    marginTop: 20,
  },
  feeText: { fontFamily: 'Rajdhani-SemiBold', fontSize: 12.5, color: '#F4F4F8' },
  feeRight: { fontFamily: 'Rajdhani-Medium', fontSize: 11, color: '#8B8BA5', marginLeft: 'auto' },

  // --- rule cards ---
  ruleCard: {
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
    borderRadius: 15,
    padding: 12,
    marginBottom: 9,
  },
  ruleTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ruleIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  ruleTitle: { fontFamily: 'Rajdhani-Bold', fontSize: 13.5, color: '#F4F4F8' },
  ruleNote: { fontFamily: 'Rajdhani-Medium', fontSize: 10.5, color: '#8B8BA5', marginTop: 2, lineHeight: 15 },
  lockChip: {
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.5)',
    backgroundColor: 'rgba(34,197,94,0.14)',
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  lockChipText: { fontFamily: 'Rajdhani-Bold', fontSize: 9, letterSpacing: 0.8, color: '#22C55E' },

  // --- tip card ---
  tipCard: {
    flexDirection: 'row',
    gap: 9,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.35)',
    backgroundColor: 'rgba(245,158,11,0.08)',
    borderRadius: 14,
    padding: 12,
    marginTop: 20,
  },
  tipText: { flex: 1, fontFamily: 'Rajdhani-Medium', fontSize: 11.5, color: '#E6E6F0', lineHeight: 17 },

  // --- review ---
  reviewCard: {
    borderWidth: 1,
    borderColor: '#2A2A3E',
    backgroundColor: '#13131E',
    borderRadius: 16,
    overflow: 'hidden',
  },
  reviewHead: { height: 88, justifyContent: 'flex-end' },
  reviewArt: { ...StyleSheet.absoluteFillObject },
  reviewHeadInner: { padding: 12 },
  reviewName: { fontFamily: 'Rajdhani-Bold', fontSize: 17, color: '#F4F4F8' },
  reviewMeta: { fontFamily: 'Rajdhani-Medium', fontSize: 11, color: '#C9C9DC', marginTop: 1 },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: '#23233A',
  },
  reviewLabel: { fontFamily: 'Rajdhani-Medium', fontSize: 12, color: '#8B8BA5' },
  reviewValue: { fontFamily: 'Rajdhani-Bold', fontSize: 12.5, color: '#F4F4F8' },

  warnCard: {
    flexDirection: 'row',
    gap: 9,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.35)',
    backgroundColor: 'rgba(245,158,11,0.08)',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
  },
  warnText: { flex: 1, fontFamily: 'Rajdhani-Medium', fontSize: 11.5, color: '#E6E6F0', lineHeight: 17 },

  agreeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  tickBox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#3A3A4C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickBoxOn: { backgroundColor: '#FFC529', borderColor: '#FFC529' },
  agreeText: { flex: 1, fontFamily: 'Rajdhani-SemiBold', fontSize: 12.5, color: '#E6E6F0' },

  // --- buttons ---
  goldWrap: { borderRadius: 14, overflow: 'hidden', marginTop: 24 },
  goldInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 14,
  },
  goldText: { fontFamily: 'Rajdhani-Bold', fontSize: 15, color: '#171000' },
  ghostWrap: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
  },
  ghostText: { fontFamily: 'Rajdhani-Bold', fontSize: 13.5, color: '#C9C9DC' },
  linkText: { fontFamily: 'Rajdhani-Bold', fontSize: 13, color: '#FFC529', textAlign: 'center' },

  footer: {
    fontFamily: 'Rajdhani-Medium',
    fontSize: 10,
    color: '#3A3A4C',
    textAlign: 'center',
    marginTop: 18,
  },

  // --- the success screen ---
  doneCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  doneTitle: {
    fontFamily: 'BebasNeue',
    fontSize: 30,
    letterSpacing: 1,
    color: '#F4F4F8',
    textAlign: 'center',
    marginTop: 16,
  },
  doneSub: {
    fontFamily: 'Rajdhani-Medium',
    fontSize: 12.5,
    color: '#8B8BA5',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  codeBox: {
    borderWidth: 1,
    borderColor: 'rgba(255,197,41,0.4)',
    backgroundColor: 'rgba(255,197,41,0.07)',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  codeLabel: { fontFamily: 'Rajdhani-Bold', fontSize: 9.5, letterSpacing: 1.6, color: '#8B8BA5' },
  codeText: { fontFamily: 'BebasNeue', fontSize: 34, letterSpacing: 2, color: '#FFC529', marginTop: 2 },
  codeRule: { height: 1, backgroundColor: 'rgba(255,197,41,0.25)', alignSelf: 'stretch', marginVertical: 12 },
  codeBit: { fontFamily: 'Rajdhani-SemiBold', fontSize: 12.5, color: '#E6E6F0', marginTop: 2 },
});
