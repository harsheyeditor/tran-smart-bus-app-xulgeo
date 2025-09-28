
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, TextInput } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { BusStatusIndicator } from '@/components/BusStatusIndicator';
import { ProgressRing } from '@/components/ProgressRing';
import { AnimatedBusIcon } from '@/components/AnimatedBusIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  FadeInUp
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface BusRoute {
  id: string;
  name: string;
  destination: string;
  nextArrival: string;
  status: 'active' | 'delayed' | 'offline';
  occupancy: number;
  speed: number;
  driver: string;
  stops: BusStop[];
  currentStopIndex: number;
  coordinates: { lat: number; lng: number };
}

interface BusStop {
  id: string;
  name: string;
  eta: string;
  passed: boolean;
  coordinates: { lat: number; lng: number };
}

const MOCK_ROUTES: BusRoute[] = [
  {
    id: '1',
    name: 'Route 42',
    destination: 'Downtown Terminal',
    nextArrival: '3 min',
    status: 'active',
    occupancy: 65,
    speed: 35,
    driver: 'John Smith',
    currentStopIndex: 2,
    coordinates: { lat: 40.7128, lng: -74.0060 },
    stops: [
      { id: '1', name: 'Central Station', eta: 'Passed', passed: true, coordinates: { lat: 40.7589, lng: -73.9851 } },
      { id: '2', name: 'City Mall', eta: 'Passed', passed: true, coordinates: { lat: 40.7505, lng: -73.9934 } },
      { id: '3', name: 'University Ave', eta: '3 min', passed: false, coordinates: { lat: 40.7282, lng: -73.9942 } },
      { id: '4', name: 'Hospital District', eta: '8 min', passed: false, coordinates: { lat: 40.7200, lng: -74.0000 } },
      { id: '5', name: 'Downtown Terminal', eta: '15 min', passed: false, coordinates: { lat: 40.7128, lng: -74.0060 } },
    ]
  },
  {
    id: '2',
    name: 'Route 15',
    destination: 'Airport',
    nextArrival: '7 min',
    status: 'delayed',
    occupancy: 80,
    speed: 25,
    driver: 'Sarah Johnson',
    currentStopIndex: 1,
    coordinates: { lat: 40.6892, lng: -74.1745 },
    stops: [
      { id: '1', name: 'Main Street', eta: 'Passed', passed: true, coordinates: { lat: 40.7300, lng: -74.0000 } },
      { id: '2', name: 'Business Park', eta: '7 min', passed: false, coordinates: { lat: 40.7100, lng: -74.0500 } },
      { id: '3', name: 'Tech Campus', eta: '12 min', passed: false, coordinates: { lat: 40.7000, lng: -74.1000 } },
      { id: '4', name: 'Airport', eta: '25 min', passed: false, coordinates: { lat: 40.6892, lng: -74.1745 } },
    ]
  },
  {
    id: '3',
    name: 'Route 8',
    destination: 'Riverside',
    nextArrival: '12 min',
    status: 'active',
    occupancy: 45,
    speed: 40,
    driver: 'Mike Davis',
    currentStopIndex: 0,
    coordinates: { lat: 40.7400, lng: -73.9900 },
    stops: [
      { id: '1', name: 'Metro Center', eta: '12 min', passed: false, coordinates: { lat: 40.7400, lng: -73.9900 } },
      { id: '2', name: 'Park Avenue', eta: '18 min', passed: false, coordinates: { lat: 40.7600, lng: -73.9700 } },
      { id: '3', name: 'Riverside', eta: '28 min', passed: false, coordinates: { lat: 40.7800, lng: -73.9500 } },
    ]
  }
];

export default function TrackingScreen() {
  const { colors } = useTheme();
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(MOCK_ROUTES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gpsStatus, setGpsStatus] = useState<'connected' | 'weak' | 'offline'>('connected');
  const [towerStatus, setTowerStatus] = useState<'strong' | 'weak' | 'offline'>('strong');
  const [currentTime, setCurrentTime] = useState(new Date());

  const pulseAnimation = useSharedValue(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ['connected', 'weak', 'offline'] as const;
      const towerStatuses = ['strong', 'weak', 'offline'] as const;
      setGpsStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      setTowerStatus(towerStatuses[Math.floor(Math.random() * towerStatuses.length)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      false
    );
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'strong':
        return colors.success;
      case 'delayed':
      case 'weak':
        return colors.warning;
      case 'offline':
        return colors.danger;
      default:
        return colors.grey;
    }
  };

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy < 50) return colors.success;
    if (occupancy < 80) return colors.warning;
    return colors.danger;
  };

  const filteredRoutes = MOCK_ROUTES.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnimation.value }],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Live Tracking</Text>
        <Text style={styles.headerSubtitle}>Real-time bus locations</Text>
        <Text style={styles.currentTime}>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <Animated.View entering={FadeInUp.delay(200)} style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.grey} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search routes..."
            placeholderTextColor={colors.grey}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color={colors.grey} />
            </Pressable>
          )}
        </Animated.View>

        {/* Map Area */}
        <Animated.View entering={FadeInUp.delay(400)} style={[styles.mapContainer, { backgroundColor: colors.surface }]}>
          <LinearGradient
            colors={['#f0f9ff', '#e0f2fe', '#bae6fd']}
            style={styles.mapGradient}
          >
            <View style={styles.mapHeader}>
              <IconSymbol name="map.fill" size={24} color={colors.primary} />
              <Text style={[styles.mapTitle, { color: colors.primary }]}>Live Bus Tracking</Text>
            </View>
            
            <Text style={[styles.mapNotice, { color: colors.text }]}>
              Interactive Map View
            </Text>
            <Text style={[styles.mapSubtext, { color: colors.textSecondary }]}>
              Note: react-native-maps is not supported in Natively right now.
              This would show real-time bus positions with route overlays.
            </Text>
            
            {/* Simulated bus positions */}
            <View style={styles.busPositions}>
              {MOCK_ROUTES.map((route, index) => (
                <Animated.View
                  key={route.id}
                  style={[
                    animatedPulseStyle,
                    styles.busMarker,
                    {
                      left: `${20 + index * 25}%`,
                      top: `${30 + index * 15}%`,
                      backgroundColor: getStatusColor(route.status),
                    }
                  ]}
                >
                  <AnimatedBusIcon 
                    size={16} 
                    color="white" 
                    isMoving={route.status === 'active'}
                  />
                  <Text style={[styles.busMarkerLabel, { color: colors.text }]}>{route.name}</Text>
                </Animated.View>
              ))}
            </View>

            <View style={styles.mapLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.legendText, { color: colors.text }]}>Active</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
                <Text style={[styles.legendText, { color: colors.text }]}>Delayed</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
                <Text style={[styles.legendText, { color: colors.text }]}>Offline</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Routes List */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Active Routes ({filteredRoutes.length})
          </Text>
          {filteredRoutes.map((route, index) => (
            <Animated.View
              key={route.id}
              entering={FadeInUp.delay(700 + index * 100)}
            >
              <Pressable
                style={[
                  styles.routeCard,
                  { backgroundColor: colors.surface },
                  selectedRoute?.id === route.id && { borderColor: colors.primary, borderWidth: 2 }
                ]}
                onPress={() => setSelectedRoute(route)}
              >
                <View style={styles.routeHeader}>
                  <View style={styles.routeNameContainer}>
                    <AnimatedBusIcon 
                      size={20} 
                      color={getStatusColor(route.status)}
                      isMoving={route.status === 'active'}
                    />
                    <Text style={[styles.routeName, { color: colors.text }]}>{route.name}</Text>
                  </View>
                  <BusStatusIndicator status={route.status} size="small" />
                </View>
                <Text style={[styles.routeDestination, { color: colors.textSecondary }]}>
                  → {route.destination}
                </Text>
                <View style={styles.routeFooter}>
                  <Text style={[styles.routeEta, { color: colors.primary }]}>
                    Next: {route.nextArrival}
                  </Text>
                  <ProgressRing 
                    progress={route.occupancy} 
                    size={24} 
                    strokeWidth={3}
                    color={getOccupancyColor(route.occupancy)}
                    showText={false}
                  />
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Selected Route Details */}
        {selectedRoute && (
          <Animated.View entering={FadeInUp.delay(800)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Route Details</Text>
            <View style={[styles.detailsCard, { backgroundColor: colors.surface }]}>
              <View style={styles.busInfoHeader}>
                <View style={styles.busInfoTitleContainer}>
                  <AnimatedBusIcon 
                    size={24} 
                    color={getStatusColor(selectedRoute.status)}
                    isMoving={selectedRoute.status === 'active'}
                  />
                  <Text style={[styles.busInfoTitle, { color: colors.text }]}>{selectedRoute.name}</Text>
                </View>
                <BusStatusIndicator status={selectedRoute.status} />
              </View>

              <Text style={[styles.busInfoDestination, { color: colors.textSecondary }]}>
                Destination: {selectedRoute.destination}
              </Text>

              <View style={styles.busMetrics}>
                <View style={styles.metric}>
                  <ProgressRing 
                    progress={selectedRoute.occupancy} 
                    size={50}
                    color={getOccupancyColor(selectedRoute.occupancy)}
                  />
                  <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Occupancy</Text>
                </View>
                <View style={styles.metric}>
                  <View style={[styles.metricIcon, { backgroundColor: colors.background }]}>
                    <IconSymbol name="speedometer" size={24} color={colors.primary} />
                  </View>
                  <Text style={[styles.metricValue, { color: colors.text }]}>{selectedRoute.speed} km/h</Text>
                  <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Speed</Text>
                </View>
                <View style={styles.metric}>
                  <View style={[styles.metricIcon, { backgroundColor: colors.background }]}>
                    <IconSymbol name="person.circle.fill" size={24} color={colors.grey} />
                  </View>
                  <Text style={[styles.metricValue, { color: colors.text }]}>{selectedRoute.driver}</Text>
                  <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Driver</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Network Status */}
        <Animated.View entering={FadeInUp.delay(1000)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Network Status</Text>
          <View style={[styles.networkCard, { backgroundColor: colors.surface }]}>
            <View style={styles.statusItem}>
              <IconSymbol name="location.fill" size={16} color={getStatusColor(gpsStatus)} />
              <Text style={[styles.statusText, { color: getStatusColor(gpsStatus) }]}>
                GPS: {gpsStatus}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <IconSymbol name="antenna.radiowaves.left.and.right" size={16} color={getStatusColor(towerStatus)} />
              <Text style={[styles.statusText, { color: getStatusColor(towerStatus) }]}>
                Tower: {towerStatus}
              </Text>
            </View>
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
    marginBottom: 8,
  },
  currentTime: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  mapContainer: {
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  mapGradient: {
    flex: 1,
    padding: 20,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  mapNotice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  mapSubtext: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 20,
  },
  busPositions: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    bottom: 40,
  },
  busMarker: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  busMarkerLabel: {
    position: 'absolute',
    top: 40,
    fontSize: 10,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 50,
    textAlign: 'center',
  },
  mapLegend: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  routeCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '600',
  },
  routeDestination: {
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 28,
  },
  routeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 28,
  },
  routeEta: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailsCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  busInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  busInfoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  busInfoTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  busInfoDestination: {
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 32,
  },
  busMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metric: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  metricIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  networkCard: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  bottomSpacing: {
    height: 20,
  },
});
