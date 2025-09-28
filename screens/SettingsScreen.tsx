
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { Toggle } from '@/components/Toggle';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsScreenProps {
  onClose: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose }) => {
  const { colors, themeMode, setThemeMode } = useTheme();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            onClose();
          }
        },
      ]
    );
  };

  const SettingItem: React.FC<{
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showArrow?: boolean;
  }> = ({ icon, title, subtitle, onPress, rightElement, showArrow = false }) => (
    <Pressable
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <IconSymbol name={icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightElement}
        {showArrow && (
          <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
        )}
      </View>
    </Pressable>
  );

  const ThemeSelector = () => (
    <View style={styles.themeSelector}>
      {(['light', 'dark', 'system'] as const).map((mode) => (
        <Pressable
          key={mode}
          style={[
            styles.themeOption,
            {
              backgroundColor: themeMode === mode ? colors.primary : colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setThemeMode(mode)}
        >
          <Text
            style={[
              styles.themeOptionText,
              {
                color: themeMode === mode ? 'white' : colors.text,
                color: themeMode === mode ? 'dark' : colors.text, 
              },
            ]}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {user && (
        <View style={[styles.profileSection, { backgroundColor: colors.surface }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>{user.name}</Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
              {user.email}
            </Text>
            <Text style={[styles.profileStats, { color: colors.textSecondary }]}>
              {user.totalTrips} trips • Member since {new Date(user.memberSince).getFullYear()}
            </Text>
          </View>
        </View>
      )}

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        
        <SettingItem
          icon="paintbrush"
          title="Theme"
          subtitle="Choose your preferred theme"
          rightElement={<ThemeSelector />}
        />
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        
        <SettingItem
          icon="bell"
          title="Push Notifications"
          subtitle="Get notified about bus arrivals and delays"
          rightElement={
            <Toggle
              value={notifications}
              onValueChange={setNotifications}
            />
          }
        />
        
        <SettingItem
          icon="speaker.wave.2"
          title="Sound Alerts"
          subtitle="Play sounds for important notifications"
          rightElement={
            <Toggle
              value={soundEnabled}
              onValueChange={setSoundEnabled}
            />
          }
        />
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tracking</Text>
        
        <SettingItem
          icon="location"
          title="Location Services"
          subtitle="Allow location access for better route suggestions"
          rightElement={
            <Toggle
              value={locationTracking}
              onValueChange={setLocationTracking}
            />
          }
        />
        
        <SettingItem
          icon="arrow.clockwise"
          title="Auto Refresh"
          subtitle="Automatically update bus positions"
          rightElement={
            <Toggle
              value={autoRefresh}
              onValueChange={setAutoRefresh}
            />
          }
        />
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
        
        <SettingItem
          icon="questionmark.circle"
          title="Help & FAQ"
          subtitle="Get help and find answers"
          showArrow
          onPress={() => Alert.alert('Help', 'Help section coming soon!')}
        />
        
        <SettingItem
          icon="envelope"
          title="Contact Support"
          subtitle="Get in touch with our team"
          showArrow
          onPress={() => Alert.alert('Contact', 'Support contact coming soon!')}
        />
        
        <SettingItem
          icon="star"
          title="Rate TRANAI"
          subtitle="Share your feedback"
          showArrow
          onPress={() => Alert.alert('Rate App', 'Rating feature coming soon!')}
        />
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Legal</Text>
        
        <SettingItem
          icon="doc.text"
          title="Privacy Policy"
          showArrow
          onPress={() => Alert.alert('Privacy', 'Privacy policy coming soon!')}
        />
        
        <SettingItem
          icon="doc.text"
          title="Terms of Service"
          showArrow
          onPress={() => Alert.alert('Terms', 'Terms of service coming soon!')}
        />
      </View>

      {user && (
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <SettingItem
            icon="rectangle.portrait.and.arrow.right"
            title="Sign Out"
            onPress={handleLogout}
            rightElement={
              <Text style={[styles.signOutText, { color: colors.danger }]}>
                Sign Out
              </Text>
            }
          />
        </View>
      )}

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          TRANAI v1.0.0
        </Text>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Smart Bus Tracking System
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  profileStats: {
    fontSize: 12,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 20,
    paddingBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  themeOptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
  },
});
