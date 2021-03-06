import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {NavigationBar} from './ts';

export function MyTabBar({state, descriptors, navigation}) {
  return (
    <View
      style={{
        paddingBottom: NavigationBar.currentHeight,
        borderTopColor: 'gray',
        borderTopWidth: 1,
      }}>
      <View
        style={{
          height: 50,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{flex: 1, alignItems: 'center'}}>
              <Text style={{color: isFocused ? 'blue' : '#222'}}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
