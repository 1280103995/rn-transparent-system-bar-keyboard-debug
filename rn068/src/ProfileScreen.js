import React, {useEffect, useRef} from 'react';
import {Platform, TextInput} from 'react-native';
import KeyboardAwareScrollView from './KeyboardAwareScrollView';
import {NavigationBar, StatusBar} from './ts';

export default function ProfileScreen({navigation}) {
  const bottomInput = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    navigation.addListener('focus', () => {
      StatusBar.setBarStyle('light-content');
      NavigationBar.setBarStyle('light-content');
    });
  }, [navigation]);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        alignItems: 'center',
        // paddingVertical: 10,
        // justifyContent: 'center',
      }}
      onRef={r => {
        scrollRef.current = r;
      }}
      onKeyboardWillShow={frames => {
        if (Platform.Version < 23) {
          return;
        }
        if (bottomInput.current?.isFocused()) {
          bottomInput.current?.measure((x, y, width, height, pageX, pageY) => {
            bottomInput.current?.setNativeProps({
              style: {
                transform: [
                  {translateY: frames.endCoordinates.screenY - pageY - 50},
                ],
              },
            });
          });
        }
      }}
      onKeyboardWillHide={frames => {
        if (Platform.Version < 23) {
          return;
        }
        bottomInput.current?.setNativeProps({
          style: {transform: [{translateY: 0}]},
        });
      }}>
      <TextInput
        style={{width: 200, height: 50, backgroundColor: 'pink'}}
        onFocus={(event: Event) => {
          scrollRef.current?.scrollToFocusedInput(event);
        }}
      />
      <TextInput
        style={{
          width: 200,
          height: 50,
          backgroundColor: 'purple',
          marginTop: 50,
        }}
        onFocus={(event: Event) => {
          scrollRef.current.scrollToFocusedInput(event);
        }}
      />
      <TextInput
        placeholder={'1'}
        style={{
          width: 200,
          height: 50,
          backgroundColor: 'yellow',
          marginTop: 50,
        }}
        onFocus={(event: Event) => {
          scrollRef.current?.scrollToFocusedInput(event);
        }}
      />
      <TextInput
        placeholder={'2'}
        style={{
          width: 200,
          height: 50,
          backgroundColor: 'yellow',
          marginTop: 50,
        }}
        onFocus={(event: Event) => {
          scrollRef.current?.scrollToFocusedInput(event);
        }}
      />
      <TextInput
        placeholder={'3'}
        style={{
          width: 200,
          height: 50,
          backgroundColor: 'yellow',
          marginTop: 50,
        }}
        onFocus={(event: Event) => {
          scrollRef.current?.scrollToFocusedInput(event);
        }}
      />
      <TextInput
        placeholder={'4'}
        style={{
          width: 200,
          height: 50,
          backgroundColor: 'yellow',
          marginTop: 50,
        }}
        onFocus={(event: Event) => {
          scrollRef.current?.scrollToFocusedInput(event);
        }}
      />
      <TextInput
        placeholder={'5'}
        style={{
          width: 200,
          height: 50,
          backgroundColor: 'yellow',
          marginTop: 50,
        }}
        onFocus={(event: Event) => {
          scrollRef.current?.scrollToFocusedInput(event);
        }}
      />
      <TextInput
        placeholder={'6'}
        style={{
          width: 200,
          height: 50,
          backgroundColor: 'yellow',
          marginTop: 50,
        }}
        onFocus={(event: Event) => {
          scrollRef.current?.scrollToFocusedInput(event);
        }}
      />
      <TextInput
        placeholder={'7'}
        style={{
          width: 200,
          height: 50,
          backgroundColor: 'yellow',
          marginTop: 50,
        }}
        onFocus={(event: Event) => {
          scrollRef.current?.scrollToFocusedInput(event, 0);
        }}
      />
    </KeyboardAwareScrollView>
  );
}
