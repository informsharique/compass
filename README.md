# Compass Mobile App 🧭

A premium, high-performance, and beautifully designed mobile compass application built with **React Native**, **Expo SDK 56**, and **HeroUI Native**. It follows clean architecture principles (DDD), complete with custom signal damping, multiple dial designs, Qibla support, and EAS cloud build configurations.

---

## 🌟 Key Features

- **Real-time Heading Readout:** High-precision compass dial with support for true heading and magnetic heading.
- **Multiple Compass Dial Designs:** Swappable high-fidelity dials, including **Standard**, **Classic**, **Modern**, **Minimalist**, **Silver**, **Nautical**, and **Aero** dials.
- **Qibla Direction Support:** Built-in Qibla mode that calculates the Kaaba bearing from your GPS coordinates, complete with a Kaaba indicator on the dial that lights up when aligned.
- **Cardinal & Degree Display:** Instant updates on headings (N, NE, E, SE, S, SW, W, NW) with exact degrees.
- **Location Persistence & Reverse Geocoding:** Saves the last known location and coordinates via **MMKV** storage, displaying current locality and coordinates in settings and details.
- **System-Aware Haptic Feedback:** A custom Expo native module (`system-haptic`) detects system-wide haptic settings to respect the user's OS vibration preferences.
- **Sensor Telemetry & Details:** Complete location coordinates (latitude, longitude, altitude) and heading accuracy details, accessed via an elegant **Information Dialog** overlay.
- **Advanced Signal Filtering:** Exponential Moving Average (EMA) damping filter to eliminate sensor jitter, combined with dynamic screen-down orientation inversion (via Accelerometer) to prevent 180° heading flips.
- **Dynamic Theme Support:** Full light and dark mode styling utilizing HeroUI Native and Tailwind CSS (Uniwind), featuring beautiful colors like Cyber Cyan, Amber Gold, Crimson Red, and Emerald Green.
- **Figure-Eight Calibration:** Interactive calibration UI to assist users when sensor precision is low (earth's magnetic field outside the 25–70 µT range).
- **Modern Navigation:** Tabless flow with clean route-driven dialogs and a detailed settings page using Expo Router.

---

## 🛠️ Tech Stack

- **Framework:** [Expo (v56)](https://expo.dev) with Expo Router (file-based routing).
- **Core UI Library:** [HeroUI Native](https://heroui.com/docs/native) (premium design components).
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) via [Uniwind](https://docs.uniwind.dev) for cross-platform utility classes.
- **State Management & Storage:** [MMKV](https://github.com/mrousavy/react-native-mmkv) for high-performance key-value storage, paired with React Context.
- **Native Modules:** Custom Expo module (`system-haptic`) for Android and iOS system haptic status verification.
- **Environment:** React 19 (with React Compiler enabled) and TypeScript.
- **Package Manager:** Bun (recommended) or npm.

---

## 📐 Architecture & Folder Structure

This project follows **Domain-Driven Design (DDD)** and **Clean Architecture** patterns to decouple business logic from the UI components and native APIs.

```text
compass/
├── .agents/                    # Agent skills & guidelines
├── android/                    # Android native project assets & configs
├── ios/                        # iOS native project assets & configs
├── assets/                     # App icons, splash screens, and images
├── modules/                    # Custom native Expo modules
│   └── system-haptic/          # Checks system-wide haptics preference on Android & iOS
├── src/
│   ├── @types/                 # Global TypeScript type declarations
│   ├── app/                    # Expo Router file-based screens (Entrypoints)
│   │   ├── _layout.tsx         # App wrapper, Providers setup, global styles
│   │   ├── index.tsx           # Home screen (Main Compass display)
│   │   └── settings.tsx        # Settings and configurations screen
│   ├── domain/                 # Core entities, pure logic, and definitions (No UI/React imports)
│   │   ├── compass/            # Heading utilities, interfaces, cardinal calculations
│   │   ├── location/           # Location storage logic & persistence interfaces
│   │   └── settings/           # Global preferences and settings store logic (MMKV)
│   ├── application/            # Application state orchestrators, queries, and React Hooks
│   │   └── compass/            # Hooks connecting domain/location logic to presentation layer
│   └── presentation/           # React Native UI components, styling, and visual elements
│       ├── components/         # Dial, calibration, settings details, and headers
│       │   ├── home/           # Home-related UI (Compass dials, calibration, readout)
│       │   │   └── dial/       # Dial variants (Classic, Modern, Aero, Nautical, Silver, Minimalist, Standard)
│       │   └── settings/       # Settings-related UI (Appearance, colors, controls)
│       └── utils/              # UI-specific helpers (colors, haptics, theme maps)
├── app.config.ts               # Dynamic Expo app configuration (Icon/Theme/Splash config)
├── eas.json                    # EAS Build profiles (Development, Simulator, Production)
├── package.json                # Project dependencies and script definitions
└── tsconfig.json               # TypeScript configuration
```

---

## ⚙️ Configuration & Environment Variables

The application uses `dotenv` to dynamically configure EAS build parameters in `app.config.ts`.

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_ACCOUNT_OWNER=your-expo-username
EXPO_PUBLIC_EAS_PROJECT_ID=your-eas-project-id
```

### EAS Build Profiles (`eas.json`)

We support three build environments configured for cloud building:

1.  **`development`**: Generates an internal development client for testing native modules.
2.  **`simulator`**: Configured for iOS simulator builds (`simulator: true`).
3.  **`production`**: Release build designed for App Store/Google Play.
    - **Android Release Optimization**: Uses `expo-build-properties` to enable resource shrinking and minification (`enableMinifyInReleaseBuilds` & `enableShrinkResourcesInReleaseBuilds`) while skipping redundant linting tasks during building (`-x lint -x lintVitalAnalyzeRelease`).

---

## 📈 Sensor Processing & Damping Logic

To provide a premium and fluid instrument feel, the compass telemetry goes through dual-sensor signal processing inside `useCompass()`:

1.  **Screen-Down Compensation**: Subscribes to the device `Accelerometer`. If the screen faces downwards (`z < 0`), the sensor's X-axis is inverted (`-x`), preventing the compass dial from suddenly flipping 180°.
2.  **Dynamic Exponential Moving Average (EMA)**:
    - **Jitter Reduction**: Small angle variations ($< 2^\circ$) use a low smoothing factor ($\alpha = 0.1$), giving a stable, static dial.
    - **Instant Response**: Quick rotations ($> 10^\circ$) switch dynamically to $\alpha = 0.95$, removing any lag.
    - **Interpolation**: Rotations between $2^\circ$ and $10^\circ$ scale smoothly between the low and high alphas.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) (or Node.js) installed on your system.

### 1. Install Dependencies

```bash
bun install
# or
npm install
```

### 2. Prebuild Native Projects

Prebuild the iOS and Android projects to generate the native code.

```bash
# General
bun run prebuild

# Environment Specific
bun run prebuild:development
bun run prebuild:production
```

### 3. Build with EAS

```bash
# Build Development Client
bun run build:development:ios
bun run build:development:android

# Build Production Release
bun run build:production:ios
bun run build:production:android
```

### 4. Build Locally (Without EAS Cloud)

If you prefer to build binaries locally (saving EAS credits or building offline), you have two options:

#### Option A: EAS Local Builds (Recommended)

This uses EAS CLI but executes the build pipeline locally on your machine using your local CPU/SDKs. Make sure you have the required native toolchains (Xcode, Android SDK/NDK) installed.

```bash
# Install EAS CLI globally if not already
npm install -g eas-cli

# Build locally for a specific platform/profile
eas build --local --profile development --platform ios
eas build --local --profile production --platform android
```

#### Option B: Direct Native Builds (Directly via Gradle/Xcode)

You can compile and run release builds directly using native tools or Expo CLI run commands:

- **Android (Release APK/AAB)**:

    ```bash
    # Generate release APK/AAB using Expo run command
    npx expo run:android --variant release

    # Or directly using Gradle wrapper
    cd android && ./gradlew assembleRelease
    ```

- **iOS (Release IPA/App)**:

    ```bash
    # Generate release build using Expo run command
    npx expo run:ios --configuration Release

    # Or build/archive directly from Xcode by opening the `ios/compass.xcworkspace`
    ```

### 5. Run Locally

#### iOS Simulator / Device

```bash
bun run ios
```

#### Android Emulator / Device

```bash
bun run android
```

#### Start Dev Server

```bash
bun run start
```

---

## 🧹 Code Quality & Scripts

- **Lint Code:** `bun run lint`
- **Auto-fix Lint Issues:** `bun run lint:fix`
- **Format Code:** `bun run format`
- **Type Check:** `bun run typecheck`

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

