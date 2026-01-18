# Pet Adopt App 🐾

A cross-platform mobile application built with **React Native** and **Expo** that connects pet lovers with pets available for adoption. This app provides a seamless experience for browsing, matching, and connecting with pet owners or shelters.

## 📱 Features

- **Authentication**: Secure user login and registration.
- **Home Feed**: Browse a wide variety of pets available for adoption.
- **Pet Details**: specialized views for each pet with detailed information.
- **Favorites**: specific tab to save and track pets you are interested in.
- **Matching System**: specific functionality to help find the perfect pet match.
- **Inbox & Chat**: Real-time chat functionality using `react-native-gifted-chat` to communicate with pet owners.
- **Add New Pet**: Easy-to-use form for listing pets for adoption, complete with image uploads.
- **Events**: Discover pet-related events.
- **Admin Dashboard**: focused area for administrative tasks.
- **Internationalization**: Support for multiple languages via `i18next`.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Backend / Auth**: [Supabase](https://supabase.com/) & [Firebase](https://firebase.google.com/)
- **State Management**: React Context API
- **UI Components & Styling**:
  - `react-native-reanimated` for animations
  - `lottie-react-native` for vector animations
  - `expo-linear-gradient`
  - `react-native-gifted-chat`
- **Forms**: `react-hook-form` with `yup` validation
- **Date Handling**: `moment`, `date-fns`
- **Testing**: `jest`, `detox`

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo Go](https://expo.dev/client) app on your mobile device OR Android Studio / Xcode for emulators.

### Installation

1.  **Clone the repository** (if applicable):
    ```bash
    git clone https://github.com/your-username/pet-adopt.git
    cd pet-adopt
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    - Create a `.env` file in the root directory if it doesn't exist.
    - Configure your Supabase/Firebase credentials and other API keys here.
    *(Note: Refer to `app.json` or existing `.env.example` if available for required keys)*

### Running the App

Start the development server:

```bash
npx expo start
```

- **Run on Android**: Press `a` in the terminal (requires Android Studio / Emulator).
- **Run on iOS**: Press `i` in the terminal (requires Xcode / Simulator - macOS only).
- **Run on specific device**: Scan the QR code with the **Expo Go** app (Android) or Camera app (iOS).

To run specifically for a platform:

```bash
npm run android
# or
npm run ios
```

### Reset Project

If you need to clear the project cache/state:

```bash
npm run reset-project
```

## 📂 Project Structure

```text
pet-adopt/
├── app/                 # Main application source (Expo Router pages)
│   ├── (tabs)/          # Main tab navigation (Home, Favorite, Inbox, etc.)
│   ├── _layout.jsx      # Root layout configuration
│   └── ...              # Other screens (login, pet-details, etc.)
├── assets/              # Images, fonts, and static assets
├── components/          # Reusable UI components
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── utils/               # Helper functions
├── e2e/                 # End-to-end tests (Detox)
├── app.json             # Expo configuration
└── package.json         # Dependencies and scripts
```

## 🧪 Testing

Run unit tests with Jest:

```bash
npm test
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.
