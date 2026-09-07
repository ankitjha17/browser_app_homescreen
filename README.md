# Browser

A Safari-inspired mobile browser built with Expo and React Native — favorites grid, a tab switcher with private browsing, an in-app web view with a live loading progress bar, and gesture navigation.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm (comes with Node)
- The [Expo Go](https://expo.dev/go) app on your phone (easiest way to run it), **or** Xcode (iOS Simulator) / Android Studio (Android Emulator) if you want to run it on a simulator instead

## Setup

```bash
npm install
```

## Running the app

```bash
npx expo start
```

This starts the Metro bundler and prints a QR code in the terminal.

- **On your phone**: open the Expo Go app and scan the QR code (iOS: use the Camera app instead, which will open Expo Go automatically).
- **iOS Simulator**: press `i` in the terminal (requires Xcode installed on macOS).
- **Android Emulator**: press `a` in the terminal (requires an emulator set up in Android Studio).

Shortcuts once it's running: `r` reloads the app, `m` opens the dev menu.

## Notes

- This project does **not** use Expo Router — `App.tsx` at the project root is the entry point, and the app itself is a single screen (`src/screens/home-screen.tsx`).
- Web isn't a supported target for this app.
