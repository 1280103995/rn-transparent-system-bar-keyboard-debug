import {Keyboard, Platform} from 'react-native';

const keyboardListener = (show, hide) => {
  const showEventType =
    Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
  const hideEventType =
    Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
  const keyboardShowListener = Keyboard.addListener(showEventType, frames => {
    show && show(frames);
  });
  const keyboardHideListener = Keyboard.addListener(hideEventType, frames => {
    hide && hide(frames);
  });
  return {keyboardShowListener, keyboardHideListener};
};

export default keyboardListener;
