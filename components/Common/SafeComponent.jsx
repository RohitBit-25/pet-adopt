import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ErrorBoundary from '../ErrorBoundary';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import { spacing, borderRadius, shadow, responsivePadding } from '../../utils/responsive';

// Custom Fallback Component for the Error Boundary
const ErrorFallback = (props) => (
  <View style={styles.errorContainer}>
    <LinearGradient
      colors={[colors.error, '#ee5a52']}
      style={styles.errorIconContainer}
    >
      <MaterialIcons name="error-outline" size={40} color={colors.textLight} />
    </LinearGradient>

    <Text style={styles.errorTitle}>Oops, Something Went Wrong</Text>
    <Text style={styles.errorMessage}>
      The component failed to load. Please try again.
    </Text>

    {props.error && (
      <Text style={styles.errorDetails} numberOfLines={2}>
        {props.error.toString()}
      </Text>
    )}

    <TouchableOpacity
      style={styles.retryButton}
      onPress={props.resetError}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.retryButtonGradient}
      >
        <MaterialIcons name="refresh" size={20} color={colors.textLight} />
        <Text style={styles.retryButtonText}>Try Again</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);

// Higher-order component using our custom ErrorBoundary
export const withSafeComponent = (WrappedComponent) => {
  return (props) => (
    <ErrorBoundary>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
};

// Safe loading component
export const SafeLoadingFallback = ({ message = 'Loading...', size = 'large' }) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={size} color="#667eea" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

// Safe empty state component
export const SafeEmptyState = ({
  title = 'No Data',
  message = 'No items to display',
  icon = 'inbox',
  onAction,
  actionText = 'Refresh'
}) => {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MaterialIcons name={icon} size={60} color="#999" />
      </View>

      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>

      {onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionButtonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsivePadding.large,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    margin: spacing.md,
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadow.medium,
    shadowColor: colors.error,
  },
  errorTitle: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontFamily: typography.fontFamily.heading,
  },
  errorMessage: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontFamily: typography.fontFamily.regular,
  },
  errorDetails: {
    fontSize: typography.fontSize.small,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontFamily: typography.fontFamily.mono,
  },
  retryButton: {
    borderRadius: borderRadius.lg,
    ...shadow.medium,
    shadowColor: colors.primary,
  },
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  retryButtonText: {
    color: colors.textLight,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.heading,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsivePadding.large,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.body,
    color: colors.primary,
    fontFamily: typography.fontFamily.regular,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsivePadding.large,
  },
  emptyIconContainer: {
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontFamily: typography.fontFamily.heading,
  },
  emptyMessage: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontFamily: typography.fontFamily.regular,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  actionButtonText: {
    color: colors.textLight,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.heading,
  },
});

export default withSafeComponent;
