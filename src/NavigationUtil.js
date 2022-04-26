import * as React from 'react';
import {StackActions} from '@react-navigation/native';

export const isReadyRef = React.createRef();
export const navigationRef = React.createRef();

export default class NavigationUtil {
  static getRouteInfo() {
    return navigationRef && navigationRef.current;
  }

  /**
   * 全局js可调用的方法
   * @param name
   * @param params
   */
  static navigate(name, params?) {
    // if (isReadyRef.current && navigationRef.current) {
    if (navigationRef.current) {
      navigationRef.current.navigate({
        name: 'Tab',
        params: {
          screen: name,
          params,
        },
      });
      // navigationRef.current.navigate(name, params);
    }
  }

  static goBack() {
    // if (isReadyRef.current && navigationRef.current) {
    if (navigationRef.current) {
      // Perform navigation if the app has mounted
      navigationRef.current.goBack();
    } else {
      // You can decide what to do if the app hasn't mounted
      // You can ignore this, or add these actions to a queue you can call later
    }
  }

  static reset(name, params?) {
    if (this.getRouteInfo()?.getCurrentRoute()?.name === name) {
      return;
    }
    navigationRef.current?.reset({
      index: 0,
      routes: [{name, params}],
    });
  }

  static replace(name) {
    navigationRef.current.dispatch(StackActions.replace(name));
  }

  static resetToStatus(params?) {
    navigationRef.current?.reset({
      index: 0,
      routes: [{name: 'MainTab', params: {screen: 'Status', params}}],
    });
  }

  static navigateToStatus(params?) {
    navigationRef.current?.navigate('MainTab', {
      screen: 'Status',
      params,
    });
  }
}
