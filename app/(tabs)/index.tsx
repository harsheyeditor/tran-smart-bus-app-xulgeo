
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, Alert } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  FadeInUp,
  FadeInDown
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface LiveUpdate {
  id: string;
  type: 'arrival' | 'delay' | 'route';
  message: string;
  time: string;
  route?: string;
}

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([]);
  
  const pulseAnimation = useSharedValue(1);
  const fadeAnimation = useSharedValue(0);

  useEffect(() => {
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Simulate live updates
    const updatesInterval = setInterval(() => {
      const updates: LiveUpdate[] = [
        {
          id: '1',
          type: 'arrival',
          message: 'Route 42 arriving in 2 minutes',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          route: 'Route 42'
        },
        {
          id: '2',
          type: 'delay',
          message: 'Route 15 delayed by 5 minutes',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          route: 'Route 15'
        },
        {
          id: '3',
          type: 'route',
          message: 'New express route available',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ];
      setLiveUpdates(updates.slice(0, Math.floor(Math.random() * 3) + 1));
    }, 10000);

    // Animations
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      false
    );

    fadeAnimation.value = withTiming(1, { duration: 1000 });

    return () => {
      clearInterval(timeInterval);
      clearInterval(updatesInterval);
    };
  }, []);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Track Bus',
      subtitle: 'Real-time location',
      icon: 'location.fill',
      color: colors.primary,
      onPress: () => router.push('/(tabs)/tracking'),
    },
    {
      id: '2',
      title: 'Book Ticket',
      subtitle: 'Quick booking',
      icon: 'ticket.fill',
      color: colors.success,
      onPress: () => router.push('/(tabs)/booking'),
    },
    {
      id: '3',
      title: 'Route Info',
      subtitle: 'Schedules & stops',
      icon: 'map.fill',
      color: colors.warning,
      onPress: () => router.push('/(tabs)/tracking'),
    },
    {
      id: '4',
      title: 'Notifications',
      subtitle: 'Service alerts',
      icon: 'bell.fill',
      color: colors.danger,
      onPress: () => Alert.alert('Notifications', 'All caught up! No new notifications.'),
    },
  ];

  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnimation.value }],
    };
  });

  const animatedFadeStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnimation.value,
    };
  });

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'arrival': return 'clock.fill';
      case 'delay': return 'exclamationmark.triangle.fill';
      case 'route': return 'map.fill';
      default: return 'info.circle.fill';
    }
  };

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'arrival': return colors.success;
      case 'delay': return colors.warning;
      case 'route': return colors.primary;
      default: return colors.grey;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <LinearGradient
        colors={isDark ? [colors.surface, colors.background] : [colors.primary, colors.secondary]}
        style={styles.header}
      >
        <Animated.View entering={FadeInDown.delay(200)} style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: isDark ? colors.text : 'white' }]}>
                {getGreeting()}{user ? `, ${user.name.split(' ')[0]}` : ''}
              </Text>
              <Text style={[styles.appTitle, { color: isDark ? colors.primary : 'white' }]}>
                TRANAI
              </Text>
            </View>
            <Pressable 
              style={[styles.profileButton, { backgroundColor: isDark ? colors.primary : 'rgba(255,255,255,0.2)' }]}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <IconSymbol 
                name={user ? 'person.fill' : 'person.badge.plus'} 
                size={24} 
                color={isDark ? 'white' : 'white'} 
              />
            </Pressable>
          </View>
          
          <Text style={[styles.currentTime, { color: isDark ? colors.textSecondary : 'rgba(255,255,255,0.9)' }]}>
            {currentTime.toLocaleString([], { 
              weekday: 'long',
              month: 'short', 
              day: 'numeric',
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* Quick Actions */}
      <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <Animated.View
              key={action.id}
              entering={FadeInUp.delay(500 + index * 100)}
              style={[styles.quickActionCard, { backgroundColor: colors.surface }]}
            >
              <Pressable
                style={styles.quickActionButton}
                onPress={action.onPress}
                android_ripple={{ color: action.color + '20' }}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                  <IconSymbol name={action.icon} size={28} color={action.color} />
                </View>
                <Text style={[styles.quickActionTitle, { color: colors.text }]}>
                  {action.title}
                </Text>
                <Text style={[styles.quickActionSubtitle, { color: colors.textSecondary }]}>
                  {action.subtitle}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Live Updates */}
      {liveUpdates.length > 0 && (
        <Animated.View entering={FadeInUp.delay(800)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Live Updates</Text>
            <Animated.View style={animatedPulseStyle}>
              <View style={[styles.liveIndicator, { backgroundColor: colors.success }]} />
            </Animated.View>
          </View>
          
          {liveUpdates.map((update, index) => (
            <Animated.View
              key={update.id}
              entering={FadeInUp.delay(900 + index * 100)}
              style={[styles.updateCard, { backgroundColor: colors.surface, borderLeftColor: getUpdateColor(update.type) }]}
            >
              <View style={styles.updateHeader}>
                <IconSymbol 
                  name={getUpdateIcon(update.type)} 
                  size={20} 
                  color={getUpdateColor(update.type)} 
                />
                <Text style={[styles.updateTime, { color: colors.textSecondary }]}>
                  {update.time}
                </Text>
              </View>
              <Text style={[styles.updateMessage, { color: colors.text }]}>
                {update.message}
              </Text>
              {update.route && (
                <Text style={[styles.updateRoute, { color: colors.primary }]}>
                  {update.route}
                </Text>
              )}
            </Animated.View>
          ))}
        </Animated.View>
      )}

      {/* Service Status */}
      <Animated.View entering={FadeInUp.delay(1000)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Service Status</Text>
        <View style={[styles.statusCard, { backgroundColor: colors.surface }]}>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.statusText, { color: colors.text }]}>All Systems Operational</Text>
            </View>
            <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
          </View>
          
          <View style={styles.statusDetails}>
            <View style={styles.statusDetailItem}>
              <IconSymbol name="location.fill" size={16} color={colors.success} />
              <Text style={[styles.statusDetailText, { color: colors.textSecondary }]}>GPS Tracking: Active</Text>
            </View>
            <View style={styles.statusDetailItem}>
              <IconSymbol name="antenna.radiowaves.left.and.right" size={16} color={colors.success} />
              <Text style={[styles.statusDetailText, { color: colors.textSecondary }]}>Network: Strong</Text>
            </View>
            <View style={styles.statusDetailItem}>
              <IconSymbol name="bus.fill" size={16} color={colors.success} />
              <Text style={[styles.statusDetailText, { color: colors.textSecondary }]}>Fleet Status: 98% Active</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    gap: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  currentTime: {
    fontSize: 14,
    fontWeight: '500',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickActionCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionButton: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  updateCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  updateTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  updateMessage: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 4,
  },
  updateRoute: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusDetails: {
    gap: 8,
  },
  statusDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDetailText: {
    fontSize: 14,
  },
  bottomSpacing: {
    height: 20,
  },
});
