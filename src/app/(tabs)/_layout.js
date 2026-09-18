/**
 * ============================================================
 *  ZIVO — PAGE 3: the bottom bar (tabs)
 * ============================================================
 *  This is the file that creates the bar at the bottom of the
 *  app:  HOME · TOURNAMENTS · (green orb) · COMMUNITY · MORE
 *
 *  It works exactly like the outer _layout.js but for tabs.
 *  Each <Tabs.Screen> below must have a matching file in this
 *  folder:
 *
 *     name="index"        ->  src/app/(tabs)/index.js       (HOME)
 *     name="tournaments"  ->  src/app/(tabs)/tournaments.js
 *     name="host"         ->  src/app/(tabs)/host.js
 *     name="community"    ->  src/app/(tabs)/community.js
 *     name="more"         ->  src/app/(tabs)/more.js
 *
 *  The middle one is not a real tab — it is a green button that
 *  will open the "host a tournament" wizard.
 * ============================================================
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

// ---------- the green circle in the middle ----------
function HostOrb() {
  return (
    <Pressable
      onPress={() =>
        Alert.alert('Host a tournament', 'The host wizard is the next thing we build.')
      }
      style={({ pressed }) => [styles.orb, pressed && { opacity: 0.85 }]}
      hitSlop={8}
    >
      <Image
        source={require('../../../assets/zivo/mark.png')}
        style={styles.orbMark}
        tintColor="#22C55E"
        contentFit="contain"
      />
    </Pressable>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // we draw our own headers
        tabBarActiveTintColor: '#FFC529', // the tab you are on = gold
        tabBarInactiveTintColor: '#5C5C76', // the others = grey
        tabBarStyle: styles.bar,
        tabBarLabelStyle: styles.label,
        sceneStyle: { backgroundColor: '#08080F' },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={20} color={color} />
          ),
        }}
      />

      {/* TOURNAMENTS */}
      <Tabs.Screen
        name="tournaments"
        options={{
          title: 'Tournaments',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={19} color={color} />
          ),
        }}
      />

      {/* THE GREEN ORB — not a tab, a button */}
      <Tabs.Screen
        name="host"
        options={{
          title: '',
          tabBarButton: () => <HostOrb />,
        }}
      />

      {/* COMMUNITY */}
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={20} color={color} />
          ),
        }}
      />

      {/* MORE (the "..." ) */}
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => (
            <Ionicons name="ellipsis-horizontal" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#0A0A11',
    borderTopWidth: 1,
    borderTopColor: '#2A2A3E',
    height: 76,
    paddingTop: 6,
    paddingBottom: 12,
    elevation: 0,
  },
  label: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 9,
    letterSpacing: 0.6,
  },
  orb: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E0E16',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.5)',
    boxShadow: '0 8px 14px rgba(34,197,94,0.75)', // the green glow
  },
  orbMark: { width: 22, height: 22 },
});
