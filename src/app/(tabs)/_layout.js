/**
 * ============================================================
 *  ZIVO — the bottom bar (tabs)
 * ============================================================
 *  This file builds the bar at the bottom of the app:
 *
 *      HOME · TOURNAMENTS · LEADERBOARD · REWARDS · PROFILE
 *
 *  It works exactly like the outer _layout.js, but for tabs.
 *  Every <Tabs.Screen> below needs a matching FILE in this folder:
 *
 *     name="index"        ->  src/app/(tabs)/index.js        (HOME)
 *     name="tournaments"  ->  src/app/(tabs)/tournaments.js
 *     name="leaderboard"  ->  src/app/(tabs)/leaderboard.js
 *     name="rewards"      ->  src/app/(tabs)/rewards.js
 *     name="profile"      ->  src/app/(tabs)/profile.js
 *
 *  The last two <Tabs.Screen> entries are HIDDEN screens
 *  (href: null). They are real pages you can navigate to, but
 *  no bar button:
 *     host       = the host / custom-room wizard
 *     community  = the community page
 *  We still need them because buttons on Home and Tournaments
 *  push to them.
 * ============================================================
 */

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

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

      {/* LEADERBOARD */}
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'podium' : 'podium-outline'} size={20} color={color} />
          ),
        }}
      />

      {/* REWARDS */}
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'gift' : 'gift-outline'} size={19} color={color} />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={20} color={color} />
          ),
        }}
      />

      {/* ---- hidden pages (no bar button) ---- */}
      <Tabs.Screen name="host" options={{ href: null }} />
      <Tabs.Screen name="community" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#0A0A11',
    borderTopWidth: 1,
    borderTopColor: '#2A2A3E',
    height: 72,
    paddingTop: 6,
    paddingBottom: 10,
    elevation: 0,
  },
  label: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 9,
    letterSpacing: 0.5,
  },
});
