# Compass Mobile App 🧭

A premium, high-performance, and beautifully designed mobile compass application built with **React Native**, **Expo SDK 56**, and **HeroUI Native**. It follows clean architecture principles (DDD) and leverages a custom local Expo module for native sensor access.

---

## 🌟 Key Features

*   **Real-time Heading Readout:** High-precision compass dial with support for true heading and magnetic heading.
*   **Cardinal & Degree Display:** Instant updates on headings (N, NE, E, SE, S, SW, W, NW) with exact degrees.
*   **Sensor Telemetry:** Complete location coordinates (latitude, longitude, altitude) and heading accuracy details.
*   **Dynamic Theme Support:** Full light and dark mode styling utilizing HeroUI Native and Tailwind CSS (Uniwind).
*   **Figure-Eight Calibration:** Interactive calibration UI to assist users when sensor precision is low.
*   **Haptic Feedback:** Native haptics integration for smooth interactive feedback.
*   **Modern Navigation:** Tabless flow with clean modal dialogs and settings page using Expo Router.

---

## 🛠️ Tech Stack

*   **Framework:** [Expo (v56)](https://expo.dev) with Expo Router (file-based routing).
*   **Core UI Library:** [HeroUI Native](https://heroui.com/docs/native) (premium design components).
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) via [Uniwind](https://docs.uniwind.dev) for cross-platform utility classes.
*   **State Management:** React Context & Custom Hooks.
*   **Environment:** React 19 (with React Compiler enabled) and TypeScript.
*   **Package Manager:** Bun (recommended) or npm.

---

## 📐 Architecture & Folder Structure

This project follows **Domain-Driven Design (DDD)** and **Clean Architecture** patterns to decouple business logic from the UI components and native APIs.

```text
compass/
├── .agents/                    # Agent skills & guidelines
├── android/                    # Android native project assets & configs
├── ios/                        # iOS native project assets & configs
├── assets/                     # App icons, splash screens, and images
├── modules/
│   └── expo-compass/          # Local Expo Native Module for compass sensors
├── src/
│   ├── @types/                 # Global TypeScript type declarations
│   ├── app/                    # Expo Router file-based screens (Entrypoints)
│   │   ├── _layout.tsx         # App wrapper, Providers setup, global styles
│   │   ├── index.tsx           # Home screen (Main Compass display)
│   │   └── settings.tsx        # Settings and configurations screen
│   ├── domain/                 # Core entities, pure logic, and definitions (No UI/React imports)
│   │   ├── compass/            # Heading utilities, interfaces, cardinal calculations
│   │   └── settings/           # Global preferences and settings store logic
│   ├── application/            # Application state orchestrators, queries, and React Hooks
│   │   └── compass/            # Hooks connecting domain logic to presentation layer
│   ├── infrastructure/         # External service implementations, native adapters & listeners
│   │   └── compass/            # Native sensor adapter for expo-compass
│   └── presentation/           # React Native UI components, styling, and visual elements
│       └── components/         # Dial, calibration, telemetry, headers, and UI elements
├── app.config.ts               # Dynamic Expo app configuration (Icon/Theme/Splash config)
├── package.json                # Project dependencies and script definitions
└── tsconfig.json               # TypeScript configuration
```

### Clean Architecture Layers
1.  **Domain (`src/domain/`)**: Holds the enterprise/business rules (e.g. calculating cardinal direction from degrees). It has zero external dependencies on React or React Native.
2.  **Application (`src/application/`)**: Contains hooks and state providers like `useCompass()` and `useCompassLocation()`. It orchestrates data flow between domain logic and presentation.
3.  **Infrastructure (`src/infrastructure/`)**: Implements low-level APIs and bridges them to the app. For example, `native-adapter.ts` listens to the local `expo-compass` module.
4.  **Presentation (`src/presentation/`)**: The visual layer. Utilizes Uniwind utility classes and HeroUI Native components to render the user interface.

---

## 🔌 Local Custom Native Module: `expo-compass`

To ensure optimal performance and avoid outdated community library issues, this project implements a custom Expo Native Module under `modules/expo-compass` using the Expo Modules API.

*   **iOS**: Written in Swift, wraps `CLLocationManager` to receive heading events.
*   **Android**: Written in Kotlin, wraps `SensorManager` using rotation vector/magnetic field sensors.
*   **API**:
    *   `ExpoCompass.start()`: Starts monitoring device heading sensors.
    *   `ExpoCompass.stop()`: Stops monitoring sensors to save battery.
    *   `onHeadingChange` event: Broadcasts `magneticHeading`, `trueHeading`, and `headingAccuracy`.

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

Since this project uses a custom local Native Module, you must prebuild the iOS and Android projects to generate the native code.

```bash
bun run prebuild
```

### 3. Run the App

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

*   **Lint Code:** `bun run lint`
*   **Auto-fix Lint Issues:** `bun run lint:fix`
*   **Format Code:** `bun run format`
*   **Type Check:** `bun run typecheck`

---

## 📄 License

This project is private and proprietary. All rights reserved.
