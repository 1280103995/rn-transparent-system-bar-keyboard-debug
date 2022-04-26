import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SystemBars} from './ts';
import {AppNavigator} from './AppNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export default function App() {
  useEffect(() => {
    SystemBars.init('dark-content');
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
