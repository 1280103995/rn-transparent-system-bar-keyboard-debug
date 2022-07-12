# react-native-transparent-system-bars
Modified based on https://github.com/zoontek/react-native-bars

## Setup

### Android

1. As this project only support Android 6+, you probably have to edit your `android/build.gradle` file:

```gradle
buildscript {
  ext {
    buildToolsVersion = "31.0.0"
    minSdkVersion = 23 // <- set at least 23
    compileSdkVersion = 31 // <- set at least 31
    targetSdkVersion = 31 // <- set at least 31

    // …
```

2. To setup initial bar styles on Android < 8.1, edit your `android/app/src/main/res/values/styles.xml` file:<br>
   _👉 Dont forget to edit `android:windowLightStatusBar` to match your initial styles._

```xml
<resources>

  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    <!-- … -->

    <!-- Allow drawing under the system bars background -->
    <item name="android:windowDrawsSystemBarBackgrounds">true</item>
    <item name="android:fitsSystemWindows">false</item>

    <!-- Set status bar background transparent -->
    <item name="android:statusBarColor">@android:color/transparent</item>

    <!-- Navigation bar will stay translucent on Android < 8.1 -->
    <item name="android:windowTranslucentNavigation">true</item>
  </style>

</resources>
```

3. Then for Android >= 8.1, create (or edit) your `android/app/src/main/res/values-v27/styles.xml` file:<br>
   _👉 Dont forget to edit `android:{windowLightStatusBar,windowLightNavigationBar}` to match your initial styles._

```xml
<resources xmlns:tools="http://schemas.android.com/tools">

  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    <!-- … -->

    <!-- Allow drawing under the system bars background -->
    <item name="android:windowDrawsSystemBarBackgrounds">true</item>
    <item name="android:fitsSystemWindows">false</item>

    <!-- Set system bars background transparent -->
    <item name="android:statusBarColor">@android:color/transparent</item>
    <item name="android:navigationBarColor">@android:color/transparent</item>

    <!-- Disable auto contrasted system bars background (on Android 10+) -->
    <item name="android:enforceStatusBarContrast" tools:targetApi="q">false</item>
    <item name="android:enforceNavigationBarContrast" tools:targetApi="q">false</item>
  </style>

</resources>
```

### iOS

You can setup your initial status bar style in **Xcode > General > Deployment Info**:

![Xcode setup](https://raw.githubusercontent.com/zoontek/react-native-bars/HEAD/docs/xcode_setup.png?raw=true)

## Usage

```js
import * as React from "react";
import { NavigationBar, StatusBar, SystemBars } from "./ts";

export default function App() {
  useEffect(() => {
    SystemBars.init('dark-content'); //This line is required
    
    const doSomeThing = () => {
       //......
       StatusBar.setBarStyle('light-content');
       NavigationBar.setBarStyle('light-content');
       //......
    };
    
  }, []);

  //......
}
```

## API

### `<StatusBar />`

#### StatusBar.setBarStyle

```js
StatusBar.setBarStyle(style: SystemBarStyle, animated?: boolean);
```

#### StatusBar.setHidden

```js
StatusBar.setHidden(hidden: boolean, animation?: StatusBarAnimation);
```

#### StatusBar.currentHeight

```js
StatusBar.currentHeight;
```

---

### `<NavigationBar />`

#### NavigationBar.setBarStyle

```js
NavigationBar.setBarStyle(style: SystemBarStyle);
```

---

### `<SystemBars />`

#### SystemBars.init

```js
SystemBars.init(style: SystemBarStyle);
```

#### SystemBars.setBarStyle

```js
SystemBars.setBarStyle(style: SystemBarStyle, animated?: boolean);
```
