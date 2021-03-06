import * as React from "react";
import { DeviceEventEmitter, Platform } from "react-native";
import { NavigationBar } from "./NavigationBar";
import { StatusBar } from "./StatusBar";
import { SystemBarsProps, SystemBarStyle } from "./types";
import { NativeModule } from "./module";

export class SystemBars extends React.Component<SystemBarsProps> {

  static init(style: SystemBarStyle): void {
    if (Platform.OS === 'android') {
      NativeModule?.init(style);
      DeviceEventEmitter.addListener('rnBarsNavHeight', data => {
        //FIXME sometimes wrong
        NavigationBar.currentHeight = data.navigationBarHeight;
      })
    } else {
      StatusBar.setBarStyle(style);
    }
  }

  static setBarStyle(style: SystemBarStyle, animated?: boolean): void {
    StatusBar.setBarStyle(style, animated);
    NavigationBar.setBarStyle(style);
  }

  render(): React.ReactNode {
    return (
      <>
        <StatusBar
          animated={this.props.animated}
          barStyle={this.props.barStyle}
        />

        <NavigationBar barStyle={this.props.barStyle} />
      </>
    );
  }
}
