import React, {Fragment, useEffect, useLayoutEffect} from 'react';
import {
  Animated,
  Button,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import keyboardListener from './KeyboardUtil';

export default function ModalScreen({navigation}) {
  const keyboardSpace = new Animated.Value(0);

  useLayoutEffect(() => {
    const modalOptions = {
      presentation: 'transparentModal',
      cardStyle: {backgroundColor: 'transparent'},
      cardOverlayEnabled: true,
      headerShown: false,
      gestureEnabled: false,
      cardStyleInterpolator: ({current: {progress}}) => ({
        cardStyle: {
          opacity: progress.interpolate({
            inputRange: [0, 0.5, 0.7, 1],
            outputRange: [0, 0.25, 0.7, 1],
          }),
        },
        overlayStyle: {
          opacity: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
            extrapolate: 'clamp',
          }),
        },
      }),
    };
    navigation.setOptions(modalOptions);
  }, [navigation]);

  useEffect(() => {
    const {keyboardShowListener, keyboardHideListener} = keyboardListener(
      frames => {
        if (Platform.Version < 23) {
          return;
        }
        _run(-100);
      },
      frames => {
        if (Platform.Version < 23) {
          return;
        }
        _run(-0);
      },
    );
    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  const _run = value => {
    Animated.timing(keyboardSpace, {
      toValue: value,
      duration: 50,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Fragment>
      <Pressable style={StyleSheet.absoluteFill} onPress={navigation.goBack} />
      <View style={styles.contentView}>
        <Animated.View
          style={{
            transform: [{translateY: keyboardSpace}],
            justifyContent: 'space-between',
            backgroundColor: 'white',
            borderRadius: 10,
            paddingVertical: 20,
            alignItems: 'center',
            alignSelf: 'center',
            width: '86%',
            height: 300,
          }}>
          <Text>Do you agree with me to upload data?</Text>
          <TextInput
            style={{
              width: 200,
              height: 50,
              borderWidth: 1,
              borderColor: 'grey',
            }}
          />
          <Button title="Agree" onPress={navigation.goBack} />
        </Animated.View>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  contentView: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
