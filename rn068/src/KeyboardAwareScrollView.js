import React, {PureComponent} from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';

const showEventType =
  Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
const hideEventType =
  Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

export default class KeyboardAwareScrollView extends PureComponent {
  reactNode = null;
  extraHeight = -1;
  keyboardScreenY = 0;
  contentOffsetY = 0;

  state = {
    keyboardSpace: 0,
  };

  componentDidMount() {
    const {onRef, onKeyboardWillShow, onKeyboardWillHide} = this.props;
    onRef && onRef(this);
    this.showListener = Keyboard.addListener(showEventType, async frames => {
      onKeyboardWillShow(frames);
      if (Platform.Version < 23) {
        return;
      }
      if (!this.reactNode) {
        this.reactNode = TextInput.State.currentlyFocusedInput();
      }
      if (this.keyboardScreenY > 0 || !this.reactNode?.isFocused()) {
        return;
      }

      const inputScreenY = await this._measureElement();
      this.keyboardScreenY = frames.endCoordinates.screenY;
      const elementScreenY = inputScreenY + this._getExtraOffsetY();

      this.setState(
        {
          keyboardSpace:
            frames.endCoordinates.height - this.scrollViewBottomHeight,
        },
        () => {
          if (this.keyboardScreenY >= elementScreenY) {
            return;
          }
          const y = elementScreenY - this.keyboardScreenY;
          setTimeout(() => {
            this.scrollRef.scrollTo({
              x: 0,
              y: this.contentOffsetY + y,
              animated: false,
            });
          }, 0);
        },
      );
    });
    this.hideListener = Keyboard.addListener(hideEventType, frames => {
      onKeyboardWillHide(frames);
      if (Platform.Version < 23 || !this.reactNode) {
        return;
      }

      this.reactNode = null;
      this.extraHeight = -1;
      this.keyboardScreenY = 0;
      this.setState({
        keyboardSpace: 0,
      });
    });
    if (Platform.Version < 23) {
      return;
    }
    setTimeout(() => {
      this.scrollRef?.measure((x, y, width, height, pageX, pageY) => {
        const deviceHeight = Dimensions.get('screen').height;
        this.scrollViewBottomHeight =
          deviceHeight - (height + pageY) - this._getSystemBarHeight();
      });
    }, 0);
  }

  componentWillUnmount() {
    Keyboard.dismiss();
    this.showListener?.remove();
    this.hideListener?.remove();
  }

  _getExtraOffsetY() {
    const {extraHeight} = this.props;
    return this.extraHeight > -1 ? this.extraHeight : extraHeight;
  }

  _getSystemBarHeight = () => {
    const statusBarHeight = StatusBar.currentHeight;
    const navBarHeight =
      Dimensions.get('screen').height -
      Dimensions.get('window').height -
      statusBarHeight;
    return statusBarHeight + navBarHeight;
  };

  _measureElement = () => {
    return new Promise(resolve => {
      if (!this.reactNode) {
        resolve(0);
        return;
      }
      this.reactNode.measure((x, y, width, height, pageX, pageY) => {
        resolve(height + pageY);
      });
    });
  };

  _processingOffset = async () => {
    const inputScreenY = await this._measureElement();
    const elementScreenY = inputScreenY + this._getExtraOffsetY();
    if (this.keyboardScreenY >= elementScreenY) {
      return;
    }
    const y = elementScreenY - this.keyboardScreenY;
    setTimeout(() => {
      this.scrollRef.scrollTo({
        x: 0,
        y: this.contentOffsetY + y,
        animated: false,
      });
    }, 0);
  };

  _onRef = r => {
    this.scrollRef = r;
    const {innerRef} = this.props;
    innerRef && innerRef(r);
  };

  _handleScroll = event => {
    this.contentOffsetY = event.nativeEvent.contentOffset.y;
    const {onScroll} = this.props;
    onScroll && onScroll(event);
  };

  render() {
    const {keyboardSpace} = this.state;
    const {children, contentContainerStyle, ...otherProps} = this.props;
    let contentInsetBottom = keyboardSpace;
    if (contentContainerStyle?.paddingVertical) {
      contentInsetBottom =
        contentContainerStyle?.paddingVertical + keyboardSpace;
    } else if (contentContainerStyle?.paddingBottom) {
      contentInsetBottom = contentContainerStyle?.paddingBottom + keyboardSpace;
    }
    return (
      <ScrollView
        contentContainerStyle={{
          ...contentContainerStyle,
          paddingBottom: contentInsetBottom,
        }}
        ref={this._onRef}
        onScroll={this._handleScroll}
        {...otherProps}>
        {children}
      </ScrollView>
    );
  }

  scrollToFocusedInput = (event: Event | null, extraHeight?: number) => {
    this.reactNode = event?.target;
    this.extraHeight = extraHeight;
    if (this.keyboardScreenY > 0) {
      this._processingOffset();
    }
  };
}

KeyboardAwareScrollView.defaultProps = {
  ...ScrollView.defaultProps,
  onRef: () => null,
  innerRef: () => null,
  extraHeight: 10,
  bounces: false,
  scrollEventThrottle: 16,
  automaticallyAdjustContentInsets: false,
  keyboardShouldPersistTaps: 'handled',
  onKeyboardWillShow: () => null,
  onKeyboardWillHide: () => null,
};

// Usage
// <Fragment>
//   <KeyboardAwareScrollView
//     onRef={r => (this.scrollRef = r)}
//   >
//     <TextInput
//       onFocus={(event: Event) => {
//         this.scrollRef.scrollToFocusedInput(event);
//       }}/>
//   </KeyboardAwareScrollView>
// </Fragment>
