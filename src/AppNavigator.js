import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import ModalScreen from './ModalScreen';
import {MyTabBar} from './MyTabBar';

const Tab = createBottomTabNavigator();
const TabStack = () => {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: 'green',
        },
        // tabBarStyle: {
        //   backgroundColor: 'blue'
        // },
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const Stack = createStackNavigator();
export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      {/* App Screens */}
      <Stack.Group
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={'Tab'} component={TabStack} />
      </Stack.Group>

      {/* Modals */}
      <Stack.Group>
        <Stack.Screen name={'Modal'} component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
