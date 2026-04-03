# OLX Demo

A React Native / Expo demo app built with file-based routing, i18n (English & Arabic), dark/light theme, and a classified ads UI.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [pnpm](https://pnpm.io/installation)
- [Android Studio](https://developer.android.com/studio) with an AVD (emulator) configured **or** a physical Android device connected via USB with USB debugging enabled

## Running on Android

### 1. Install dependencies

```bash
pnpm install
```

### 2. Generate native project files

```bash
pnpm prebuild
```

> This runs `expo prebuild` and generates the `android/` directory. Re-run whenever you add or change a native dependency.

### 3. Build and launch

```bash
pnpm android
```

This compiles the native Android app and installs it on the running emulator or the first connected USB device.

## Running on a physical device via USB

1. Enable **Developer Options** on the device (tap *Build Number* 7 times in *About Phone*)
2. Enable **USB Debugging** in Developer Options
3. Connect the device via USB and accept the authorization prompt
4. Verify the device is visible:
   ```bash
   adb devices
   ```
5. Run `pnpm android` — it will automatically target the connected device

## Other commands

| Command | Description |
|---|---|
| `pnpm start` | Start Metro bundler (Expo Go / dev client) |
| `pnpm prebuild` | Regenerate native `android/` folder |
| `pnpm android` | Build and run on Android |
| `pnpm lint` | Run Biome linter |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm types` | TypeScript type check |
