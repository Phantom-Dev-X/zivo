/**
 * ============================================================
 *  _layout.js  —  THIS IS YOUR "App.js"
 * ============================================================
 *  In your old app you had one App.js that wrapped everything:
 *
 *      <NavigationContainer>
 *        <Stack.Navigator>
 *          <Stack.Screen name="Home" component={Home} />
 *        </Stack.Navigator>
 *      </NavigationContainer>
 *
 *  Expo Router does the same job, but the navigator is a FILE
 *  called _layout.js instead of being inside App.js.
 *  That is ALL this file is. It is not extra work, it is the
 *  container that makes router.push() actually able to push.
 *
 *  You almost never touch this file again.
 *  Only two things live in here:
 *    1. loading our two fonts (Bebas Neue + Rajdhani)
 *    2. the <Stack /> which is the navigator
 * ============================================================
 */

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  // Load the two font families we use in the design.
  // The names on the left ('BebasNeue', 'Rajdhani-Bold') are the names
  // you then use inside your screens with fontFamily.
  const [fontsLoaded] = useFonts({
    BebasNeue: require('../../assets/fonts/BebasNeue-Regular.ttf'),
    'Rajdhani-Medium': require('../../assets/fonts/Rajdhani-Medium.ttf'),
    'Rajdhani-SemiBold': require('../../assets/fonts/Rajdhani-SemiBold.ttf'),
    'Rajdhani-Bold': require('../../assets/fonts/Rajdhani-Bold.ttf'),
  });

  // Paint the screen dark while the fonts are still loading,
  // so you never see a white flash.
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#08080F' }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
