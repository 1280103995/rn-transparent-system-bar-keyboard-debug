import { NativeModules, StatusBarAnimation } from "react-native";
import { SystemBarStyle } from "./types";

export const NativeModule:
  | {
      getConstants: () => {navigationBarHeight: number};
      init: (style: SystemBarStyle) => void;
      setStatusBarStyle: (style: SystemBarStyle) => void;
      setNavigationBarStyle: (style: SystemBarStyle) => void;
      setHidden: (hidden: boolean, animation?: StatusBarAnimation) => void;
    }
  | undefined = NativeModules.RNBars;


