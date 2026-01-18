import Constants from "expo-constants";

// Environment variables with fallbacks and production safety
const Environment = {
  // Firebase Configuration with multiple fallback layers
  FIREBASE_API_KEY: (() => {
    if (process.env.EXPO_PUBLIC_FIREBASE_API_KEY) {
      return process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
    }
    if (Constants.expoConfig?.extra?.firebaseApiKey) {
      return Constants.expoConfig.extra.firebaseApiKey;
    }
    return "AIzaSyB93KOfIlW9IQ-BHNSE9cUbyWDMvPp9TRc";
  })(),
  IS_DEV: __DEV__,
  IS_PRODUCTION: !__DEV__,
  APP_NAME: "PetAdopt",
  APP_VERSION: "1.0.0",
  API_BASE_URL: __DEV__
    ? "http://localhost:3000/api"
    : "https://your-production-api.com/api",
  FEATURES: {
    ENABLE_ANALYTICS: !__DEV__,
    ENABLE_CRASH_REPORTING: !__DEV__,
    ENABLE_DEBUG_LOGS: __DEV__,
  },
  CLOUDINARY: {
    CLOUD_NAME: "dlnxkger6",
    UPLOAD_PRESET: "pet_adopt",
    API_URL: "https://api.cloudinary.com/v1_1/dlnxkger6/image/upload",
  },
  OAUTH: {
    REDIRECT_URL: __DEV__
      ? "exp://192.168.220.34:8081"
      : "petadopt://oauth-redirect",
    SCHEME: "petadopt",
  },
};

// Validation function to check if required environment variables are present
export const validateEnvironment = () => {
  const errors = [];
  if (!Environment.FIREBASE_API_KEY) {
    errors.push("FIREBASE_API_KEY is missing");
  }
  if (errors.length > 0 && __DEV__) {
    console.warn("⚠️ Environment validation warnings:", errors);
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Log environment status in development only
if (__DEV__) {
  console.log("🌍 Environment Configuration:", {
    isDev: Environment.IS_DEV,
    hasFirebaseKey: !!Environment.FIREBASE_API_KEY,
    appName: Environment.APP_NAME,
    version: Environment.APP_VERSION,
  });
}

export default Environment;
