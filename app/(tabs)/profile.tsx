
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import Modal from 'react-native-modal';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';

interface ProfileStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

interface ProfileAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            Alert.alert('Success', 'You have been logged out successfully.');
          }
        }
      ]
    );
  };

  const profileStats: ProfileStat[] = user ? [
    {
      label: 'Total Trips',
      value: user.totalTrips.toString(),
      icon: 'bus.fill',
      color: colors.primary,
    },
    {
      label: 'Member Since',
      value: new Date(user.memberSince).getFullYear().toString(),
      icon: 'calendar',
      color: colors.success,
    },
    {
      label: 'Favorite Routes',
      value: user.favoriteRoutes.length.toString(),
      icon: 'heart.fill',
      color: colors.danger,
    },
    {
      label: 'This Month',
      value: '12',
      icon: 'chart.bar.fill',
      color: colors.warning,
    },
  ] : [];

  const profileActions: ProfileAction[] = user ? [
    {
      id: '1',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: 'person.circle',
      color: colors.primary,
      onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available soon.'),
    },
    {
      id: '2',
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      icon: 'creditcard.fill',
      color: colors.success,
      onPress: () => Alert.alert('Coming Soon', 'Payment management will be available soon.'),
    },
    {
      id: '3',
      title: 'Trip History',
      subtitle: 'View your past journeys',
      icon: 'clock.fill',
      color: colors.warning,
      onPress: () => Alert.alert('Coming Soon', 'Trip history will be available soon.'),
    },
    {
      id: '4',
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      icon: 'bell.fill',
      color: colors.secondary,
      onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon.'),
    },
    {
      id: '5',
      title: 'Help & Support',
      subtitle: 'Get help or contact support',
      icon: 'questionmark.circle.fill',
      color: colors.grey,
      onPress: () => Alert.alert('Help & Support', 'For support, please email: support@tranai.com'),
    },
    {
      id: '6',
      title: 'Logout',
      subtitle: 'Sign out of your account',
      icon: 'rectangle.portrait.and.arrow.right',
      color: colors.danger,
      onPress: handleLogout,
    },
  ] : [
    {
      id: '1',
      title: 'Help & Support',
      subtitle: 'Get help or contact support',
      icon: 'questionmark.circle.fill',
      color: colors.grey,
      onPress: () => Alert.alert('Help & Support', 'For support, please email: support@tranai.com'),
    },
  ];

  const renderAuthenticatedProfile = () => (
    <>
      {/* Profile Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.profileHeader}
      >
        <Animated.View entering={FadeInDown.delay(200)} style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <IconSymbol name="person.fill" size={32} color="white" />
            </View>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userPhone}>{user?.phone}</Text>
        </Animated.View>
      </LinearGradient>

      {/* Stats */}
      <Animated.View entering={FadeInUp.delay(400)} style={styles.statsContainer}>
        {profileStats.map((stat, index) => (
          <Animated.View
            key={stat.label}
            entering={FadeInUp.delay(500 + index * 100)}
            style={[styles.statCard, { backgroundColor: colors.surface }]}
          >
            <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
              <IconSymbol name={stat.icon} size={20} color={stat.color} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
          </Animated.View>
        ))}
      </Animated.View>

      {/* Favorite Routes */}
      {user?.favoriteRoutes && user.favoriteRoutes.length > 0 && (
        <Animated.View entering={FadeInUp.delay(800)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Favorite Routes</Text>
          <View style={[styles.favoritesCard, { backgroundColor: colors.surface }]}>
            {user.favoriteRoutes.map((route, index) => (
              <View key={index} style={styles.favoriteRoute}>
                <IconSymbol name="heart.fill" size={16} color={colors.danger} />
                <Text style={[styles.favoriteRouteText, { color: colors.text }]}>{route}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}
    </>
  );

  const renderUnauthenticatedProfile = () => (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      style={styles.authPrompt}
    >
      <Animated.View entering={FadeInDown.delay(200)} style={styles.authPromptContent}>
        <View style={styles.authIcon}>
          <IconSymbol name="person.badge.plus" size={48} color="white" />
        </View>
        <Text style={styles.authTitle}>Welcome to TRANAI</Text>
        <Text style={styles.authSubtitle}>
          Login or create an account to book tickets, track your journeys, and access personalized features.
        </Text>
        
        <View style={styles.authButtons}>
          <Pressable
            style={[styles.authButton, styles.loginButton]}
            onPress={() => {
              setAuthMode('login');
              setShowAuthModal(true);
            }}
          >
            <Text style={styles.authButtonText}>Login</Text>
          </Pressable>
          <Pressable
            style={[styles.authButton, styles.registerButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            onPress={() => {
              setAuthMode('register');
              setShowAuthModal(true);
            }}
          >
            <Text style={styles.authButtonText}>Create Account</Text>
          </Pressable>
        </View>
      </Animated.View>
    </LinearGradient>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {user ? renderAuthenticatedProfile() : renderUnauthenticatedProfile()}

        {/* Actions */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {user ? 'Account' : 'Quick Actions'}
          </Text>
          {profileActions.map((action, index) => (
            <Animated.View
              key={action.id}
              entering={FadeInUp.delay(700 + index * 100)}
            >
              <Pressable
                style={[styles.actionCard, { backgroundColor: colors.surface }]}
                onPress={action.onPress}
                android_ripple={{ color: action.color + '20' }}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                  <IconSymbol name={action.icon} size={20} color={action.color} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={[styles.actionTitle, { color: colors.text }]}>{action.title}</Text>
                  <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                    {action.subtitle}
                  </Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color={colors.grey} />
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Auth Modal */}
      <Modal
        isVisible={showAuthModal}
        onBackdropPress={() => setShowAuthModal(false)}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          {authMode === 'login' ? (
            <LoginScreen
              onClose={() => setShowAuthModal(false)}
              onSwitchToRegister={() => setAuthMode('register')}
            />
          ) : (
            <RegisterScreen
              onClose={() => setShowAuthModal(false)}
              onSwitchToLogin={() => setAuthMode('login')}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  authPrompt: {
    marginTop: 60,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  authPromptContent: {
    alignItems: 'center',
  },
  authIcon: {
    marginBottom: 20,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  authButtons: {
    width: '100%',
    gap: 12,
  },
  authButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'white',
  },
  registerButton: {
    borderWidth: 2,
    borderColor: 'white',
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  favoritesCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  favoriteRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  favoriteRouteText: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  bottomSpacing: {
    height: 20,
  },
});
