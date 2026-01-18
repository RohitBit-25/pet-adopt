import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Updates from 'expo-updates';
import { logError } from '../utils/analytics';
import { COLORS } from '../theme/colors';
import { typography } from '../theme/typography';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    logError(error, errorInfo);
  }

  handleReload = async () => {
    try {
      await Updates.reloadAsync();
    } catch (e) {
      console.error('Failed to reload app via Updates module:', e);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something Went Wrong</Text>
          <Text style={styles.message}>
            A critical error occurred. We have been notified and are working on a
            fix. Please restart the application to continue.
          </Text>
          <Pressable style={styles.button} onPress={this.handleReload}>
            <Text style={styles.buttonText}>Restart App</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background || '#FFFFFF',
  },
  title: {
    fontSize: 22,
    color: COLORS.primary || '#E53935',
    textAlign: 'center',
    marginBottom: 16,
    ...(typography.primaryBold || { fontWeight: 'bold' }),
  },
  message: {
    fontSize: 16,
    color: COLORS.text || '#333333',
    textAlign: 'center',
    marginBottom: 24,
    ...(typography.primary || {}),
  },
  button: {
    backgroundColor: COLORS.primary || '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.white || '#FFFFFF',
    fontSize: 16,
    ...(typography.primaryBold || { fontWeight: 'bold' }),
  },
});

export default ErrorBoundary;
