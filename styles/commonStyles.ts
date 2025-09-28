
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Light theme colors
export const colors = {
  // Transportation-focused color palette
  primary: '#1e40af',      // Deep blue for primary elements
  secondary: '#3b82f6',    // Bright blue for accents
  success: '#22c55e',      // Green for active/success states
  warning: '#f59e0b',      // Orange for warnings/delays
  danger: '#ef4444',       // Red for errors/offline states
  background: '#f8fafc',   // Light blue-grey background
  backgroundAlt: '#ffffff', // White for cards/surfaces
  surface: '#ffffff',      // White for cards/surfaces
  text: '#1f2937',         // Dark grey for text
  textSecondary: '#6b7280', // Medium grey for secondary text
  border: '#e5e7eb',       // Light grey for borders
  grey: '#9ca3af',         // Medium grey
  card: '#ffffff',         // White for cards
};

// Dark theme colors
export const darkColors = {
  primary: '#3b82f6',
  secondary: '#60a5fa',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  background: '#111827',
  backgroundAlt: '#1f2937',
  surface: '#1f2937',
  text: '#f9fafb',
  textSecondary: '#d1d5db',
  border: '#374151',
  grey: '#6b7280',
  card: '#1f2937',
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
  // Transportation-specific styles
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  gradient: {
    borderRadius: 12,
  },
  shadow: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
