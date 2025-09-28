
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { Toggle } from '@/components/Toggle';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'toggle' | 'action' | 'navigation';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function SettingsScreen() {
  const { colors, themeMode, setThemeMode } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);

  const settingSections: SettingSection[] = [
    {
      title: 'Appearance',
      items: [
        {
          id: 'theme',
          title: 'Theme',
          subtitle: `Current: ${themeMode === 'system' ? 'System' : themeMode === 'dark' ? 'Dark' : 'Light'}`,
          icon: 'paintbrush.fill',
          type: 'action',
          onPress: () => {
            Alert.alert(
              'Select Theme',
              'Choose your preferred theme',
              [
                { text: 'Light', onPress: () => setThemeMode('light') },
                { text: 'Dark', onPress: () => setThemeMode('dark') },
                { text: 'System', onPress: () => setThemeMode('system') },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          },
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Receive alerts about bus arrivals and delays',
          icon: 'bell.fill',
          type: 'toggle',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: 'sound',
          title: 'Sound Effects',
          subtitle: 'Play sounds for notifications and interactions',
          icon: 'speaker.wave.2.fill',
          type: 'toggle',
          value: soundEffects,
          onToggle: setSoundEffects,
        },
      ],
    },
    {
      title: 'Location & Data',
      items: [
        {
          id: 'location',
          title: 'Location Services',
          subtitle: 'Allow app to access your location for better tracking',
          icon: 'location.fill',
          type: 'toggle',
          value: locationServices,
          onToggle: setLocationServices,
        },
        {
          id: 'autoRefresh',
          title: 'Auto Refresh',
          subtitle: 'Automatically update bus locations and times',
          icon: 'arrow.clockwise',
          type: 'toggle',
          value: autoRefresh,
          onToggle: setAutoRefresh,
        },
      ],
    },
    {
      title: 'Account',
      items: user ? [
        {
          id: 'profile',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          icon: 'person.circle',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available soon.'),
        },
        {
          id: 'privacy',
          title: 'Privacy Settings',
          subtitle: 'Manage your privacy preferences',
          icon: 'lock.fill',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Privacy settings will be available soon.'),
        },
      ] : [
        {
          id: 'login',
          title: 'Login / Register',
          subtitle: 'Access your account or create a new one',
          icon: 'person.badge.plus',
          type: 'navigation',
          onPress: () => Alert.alert('Login', 'Please go to the Profile tab to login or register.'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & FAQ',
          subtitle: 'Get answers to common questions',
          icon: 'questionmark.circle.fill',
          type: 'navigation',
          onPress: () => Alert.alert('Help & FAQ', 'For help and frequently asked questions, please visit our website or contact support.'),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          icon: 'envelope.fill',
          type: 'navigation',
          onPress: () => Alert.alert('Send Feedback', 'Thank you for your interest in providing feedback! Please email us at feedback@tranai.com'),
        },
        {
          id: 'about',
          title: 'About TRANAI',
          subtitle: 'Version 1.0.0',
          icon: 'info.circle.fill',
          type: 'navigation',
          onPress: () => Alert.alert(
            'About TRANAI',
            'TRANAI v1.0.0\n\nA comprehensive smart bus tracking system with real-time tracking capabilities.\n\n© 2024 TRANAI. All rights reserved.'
          ),
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem, index: number) => {
    return (
      <Animated.View
        key={item.id}
        entering={FadeInUp.delay(300 + index * 50)}
      >
        <Pressable
          style={[styles.settingItem, { backgroundColor: colors.surface }]}
          onPress={item.onPress}
          disabled={item.type === 'toggle'}
          android_ripple={item.type !== 'toggle' ? { color: colors.primary + '20' } : undefined}
        >
          <View style={[styles.settingIcon, { backgroundColor: colors.primary + '15' }]}>
            <IconSymbol name={item.icon} size={20} color={colors.primary} />
          </View>
          
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
            {item.subtitle && (
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                {item.subtitle}
              </Text>
            )}
          </View>

          <View style={styles.settingAction}>
            {item.type === 'toggle' && item.onToggle && (
              <Toggle
                value={item.value || false}
                onValueChange={item.onToggle}
                size="medium"
              />
            )}
            {item.type === 'navigation' && (
              <IconSymbol name="chevron.right" size={16} color={colors.grey} />
            )}
            {item.type === 'action' && (
              <IconSymbol name="chevron.right" size={16} color={colors.grey} />
            )}
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <Animated.View entering={FadeInDown.delay(200)}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your TRANAI experience</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, sectionIndex) => (
          <Animated.View
            key={section.title}
            entering={FadeInUp.delay(400 + sectionIndex * 100)}
            style={styles.section}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
            </View>
          </Animated.View>
        ))}

        {/* App Info */}
        <Animated.View entering={FadeInUp.delay(800)} style={styles.appInfo}>
          <View style={[styles.appInfoCard, { backgroundColor: colors.surface }]}>
            <View style={styles.appInfoHeader}>
              <View style={[styles.appLogo, { backgroundColor: colors.primary }]}>
                <IconSymbol name="bus.fill" size={24} color="white" />
              </View>
              <View>
                <Text style={[styles.appName, { color: colors.text }]}>TRANAI</Text>
                <Text style={[styles.appVersion, { color: colors.textSecondary }]}>Version 1.0.0</Text>
              </View>
            </View>
            <Text style={[styles.appDescription, { color: colors.textSecondary }]}>
              Smart bus tracking system with real-time location updates, route planning, and ticket booking.
            </Text>
          </View>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    gap: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  settingAction: {
    marginLeft: 12,
  },
  appInfo: {
    marginBottom: 24,
  },
  appInfoCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  appLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  appVersion: {
    fontSize: 14,
  },
  appDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});
