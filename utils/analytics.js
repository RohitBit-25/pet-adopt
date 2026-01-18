import * as Analytics from "expo-firebase-analytics";

export async function logEvent(name, params) {
  try {
    // Only log analytics in production
    if (!__DEV__) {
      await Analytics.logEvent(name, params);
    } else if (__DEV__) {
      console.log("Analytics event:", name, params);
    }
  } catch (e) {
    if (__DEV__) {
      console.warn("Analytics error:", e);
    }
  }
}

/**
 * Logs an error to a remote service for monitoring.
 * In a real app, this would integrate with Sentry, Firebase Crashlytics, etc.
 * @param {Error} error The error object.
 * @param {object} [errorInfo] The component stack trace from React.
 */
export const logError = (error, errorInfo) => {
  // For now, we'll just log to the console.
  // In a production environment, this should send data to a service like Sentry.
  console.group("ERROR BOUNDARY CAUGHT");
  console.error("Error:", error);
  console.error("Component Stack:", errorInfo ? errorInfo.componentStack : "N/A");
  console.groupEnd();
};
