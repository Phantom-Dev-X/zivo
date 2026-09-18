/**
 * ZIVO — HOST A ROOM (placeholder)
 * ---------------------------------------------------------------
 * A stand-in so the bottom bar has something to show. The green orb in the middle of the bar opens this.
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Host() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 24 }]}>
      <Ionicons name="add-circle" size={34} color="#FFC529" />
      <Text style={styles.title}>HOST A ROOM</Text>
      <Text style={styles.sub}>The green button</Text>
      <Text style={styles.body}>The host wizard lands here: pick the mode, the slots and the prize, then share the link.</Text>

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
