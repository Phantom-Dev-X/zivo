/**
 * ZIVO — REWARDS (placeholder)
 * ---------------------------------------------------------------
 * One of the 5 tabs. Everything you can earn lives here:
 * daily bonus, challenges, coin packs, referral and your streak.
 *
 * A stand-in for now, so the bar has something to show.
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Rewards() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 24 }]}>
      <Ionicons name="gift-outline" size={38} color="#FFC529" />
      <Text style={styles.title}>REWARDS</Text>
      <Text style={styles.sub}>Coins · Bonus · Challenges</Text>
      <Text style={styles.body}>
        Daily bonus, streak rewards, referral coins and everything else wey you fit chop for playing.
      </Text>

      <Pressable style={styles.back} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.backText}>← Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#08080F', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34 },
  title: { fontFamily: 'BebasNeue', fontSize: 34, letterSpacing: 1.5, color: '#F4F4F8', marginTop: 12 },
  sub: { fontFamily: 'Rajdhani-Bold', fontSize: 11, letterSpacing: 1.4, color: '#FFC529', textTransform: 'uppercase', marginTop: 4 },
  body: { fontFamily: 'Rajdhani-SemiBold', fontSize: 13, lineHeight: 21, color: '#8B8BA5', textAlign: 'center', marginTop: 14 },
  back: { marginTop: 24, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1, borderColor: '#2A2A3E', backgroundColor: '#13131E' },
  backText: { fontFamily: 'Rajdhani-Bold', fontSize: 13, color: '#F4F4F8' },
});
