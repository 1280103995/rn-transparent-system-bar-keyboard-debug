import {FlatList, Platform, Text, TextInput, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import keyboardListener from './KeyboardUtil';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {NavigationBar, StatusBar} from './ts';

export default function HomeScreen({navigation}) {
  const tabBarHeight = useBottomTabBarHeight();
  const flatlist = useRef(null);
  const input = useRef(null);

  useEffect(() => {
    navigation.addListener('focus', () => {
      StatusBar.setBarStyle('dark-content');
      NavigationBar.setBarStyle('dark-content');
    });
    const {keyboardShowListener, keyboardHideListener} = keyboardListener(
      frames => {
        setTimeout(() => {
          flatlist.current?.scrollToEnd({animated: false});
        }, 20);
        if (Platform.Version < 23) {
          return;
        }
        if (input.current?.isFocused()) {
          input.current?.measure((x, y, width, height, pageX, pageY) => {
            input.current?.setNativeProps({
              style: {
                transform: [
                  {translateY: frames.endCoordinates.screenY - pageY - 50},
                ],
              },
            });
            flatlist.current?.setNativeProps({
              style: {
                transform: [
                  {translateY: frames.endCoordinates.screenY - pageY - 50},
                ],
              },
            });
          });
        }
      },
      frames => {
        if (Platform.Version < 23) {
          return;
        }
        input.current?.setNativeProps({
          style: {transform: [{translateY: 0}]},
        });
        flatlist.current?.setNativeProps({
          style: {transform: [{translateY: 0}]},
        });
      },
    );
    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [navigation, tabBarHeight]);

  const renderItem = ({item}) => (
    <Text
      onPress={() => navigation.navigate('Modal')}
      style={{
        height: 100,
        textAlign: 'center',
        textAlignVertical: 'center',
      }}>
      {item}
    </Text>
  );

  return (
    <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,.5)'}}>
      {/*<StatusBar barStyle={'light-content'} />*/}
      <FlatList
        ref={flatlist}
        data={[
          'test0',
          'test1',
          'test2',
          'test3',
          'test4',
          'test5',
          'test6',
          'test7',
        ]}
        renderItem={renderItem}
        keyExtractor={item => item}
      />

      <TextInput
        ref={input}
        style={{
          height: 50,
          borderColor: 'blue',
          borderWidth: 1,
          backgroundColor: 'pink',
        }}
      />
    </View>
  );
}
