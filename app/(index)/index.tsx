
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { BusStatusIndicator } from '@/components/BusStatusIndicator';
import { ProgressRing } from '@/components/ProgressRing';
import { AnimatedBusIcon } from '@/components/AnimatedBusIcon';
import { colors, commonStyles } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence 
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

export default function HomeScreen() {
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(MOCK_ROUTES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gpsStatus, setGpsStatus] = useState<'connected' | 'weak' | 'offline'>('connected');
  const [towerStatus, setTowerStatus] = useState<'strong' | 'weak' | 'offline'>('strong');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const pulseAnimation = useSharedValue(1);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Simulate network status changes
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ['connected', 'weak', 'offline'] as const;
      const towerStatuses = ['strong', 'weak', 'offline'] as const;
      setGpsStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      setTowerStatus(towerStatuses[Math.floor(Math.random() * towerStatuses.length)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Pulse animation for active elements
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

  const renderSidebar = () => (
    <View style={styles.sidebar}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.sidebarHeader}
      >
        <View style={styles.headerContent}>
          <Text style={styles.sidebarTitle}>TRANAI</Text>
          <Text style={styles.sidebarSubtitle}>Smart Bus Tracking</Text>
          <Text style={styles.currentTime}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.grey} />
        <TextInput
          style={styles.searchInput}
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
      </View>

      <ScrollView style={styles.routesList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Active Routes ({filteredRoutes.length})</Text>
        {filteredRoutes.map((route) => (
          <Pressable
            key={route.id}
            style={[
              styles.routeItem,
              selectedRoute?.id === route.id && styles.routeItemActive
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
                <Text style={styles.routeName}>{route.name}</Text>
              </View>
              <BusStatusIndicator status={route.status} size="small" />
            </View>
            <Text style={styles.routeDestination}>→ {route.destination}</Text>
            <View style={styles.routeFooter}>
              <Text style={styles.routeEta}>Next: {route.nextArrival}</Text>
              <ProgressRing 
                progress={route.occupancy} 
                size={24} 
                strokeWidth={3}
                color={getOccupancyColor(route.occupancy)}
                showText={false}
              />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.networkStatus}>
        <Text style={styles.networkTitle}>Network Status</Text>
        <View style={styles.statusGrid}>
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
      </View>
    </View>
  );

  const renderMapArea = () => (
    <View style={styles.mapContainer}>
      <LinearGradient
        colors={['#f0f9ff', '#e0f2fe', '#bae6fd']}
        style={styles.mapGradient}
      >
        <View style={styles.mapHeader}>
          <IconSymbol name="map.fill" size={24} color={colors.primary} />
          <Text style={styles.mapTitle}>Live Bus Tracking</Text>
        </View>
        
        <Text style={styles.mapNotice}>
          Interactive Map View
        </Text>
        <Text style={styles.mapSubtext}>
          Note: react-native-maps is not supported in Natively right now.
          This would show real-time bus positions with route overlays.
        </Text>
        
        {/* Simulated bus positions with animations */}
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
              <Text style={styles.busMarkerLabel}>{route.name}</Text>
            </Animated.View>
          ))}
        </View>

        <View style={styles.mapLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Active</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.legendText}>Delayed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
            <Text style={styles.legendText}>Offline</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderBusInfo = () => {
    if (!selectedRoute) return null;

    return (
      <View style={[styles.busInfoPanel, commonStyles.shadow]}>
        <LinearGradient
          colors={[colors.surface, '#f8fafc']}
          style={styles.busInfoGradient}
        >
          <View style={styles.busInfoHeader}>
            <View style={styles.busInfoTitleContainer}>
              <AnimatedBusIcon 
                size={24} 
                color={getStatusColor(selectedRoute.status)}
                isMoving={selectedRoute.status === 'active'}
              />
              <Text style={styles.busInfoTitle}>{selectedRoute.name}</Text>
            </View>
            <BusStatusIndicator status={selectedRoute.status} />
          </View>

          <Text style={styles.busInfoDestination}>
            Destination: {selectedRoute.destination}
          </Text>

          <View style={styles.busMetrics}>
            <View style={styles.metric}>
              <ProgressRing 
                progress={selectedRoute.occupancy} 
                size={50}
                color={getOccupancyColor(selectedRoute.occupancy)}
              />
              <Text style={styles.metricLabel}>Occupancy</Text>
            </View>
            <View style={styles.metric}>
              <View style={styles.metricIcon}>
                <IconSymbol name="speedometer" size={24} color={colors.primary} />
              </View>
              <Text style={styles.metricValue}>{selectedRoute.speed} km/h</Text>
              <Text style={styles.metricLabel}>Speed</Text>
            </View>
            <View style={styles.metric}>
              <View style={styles.metricIcon}>
                <IconSymbol name="person.circle.fill" size={24} color={colors.grey} />
              </View>
              <Text style={styles.metricValue}>{selectedRoute.driver}</Text>
              <Text style={styles.metricLabel}>Driver</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderETATimeline = () => {
    if (!selectedRoute) return null;

    return (
      <View style={[styles.etaPanel, commonStyles.shadow]}>
        <View style={styles.etaPanelHeader}>
          <IconSymbol name="clock.fill" size={20} color={colors.primary} />
          <Text style={styles.etaPanelTitle}>Route Timeline</Text>
        </View>
        
        <ScrollView style={styles.etaTimeline} showsVerticalScrollIndicator={false}>
          {selectedRoute.stops.map((stop, index) => {
            const isCurrentStop = index === selectedRoute.currentStopIndex;
            const isPassed = stop.passed;
            const isUpcoming = !isPassed && !isCurrentStop;
            
            return (
              <View key={stop.id} style={styles.timelineItem}>
                <View style={styles.timelineIndicator}>
                  <Animated.View 
                    style={[
                      styles.timelineDot,
                      isCurrentStop && animatedPulseStyle,
                      {
                        backgroundColor: isPassed ? colors.success : 
                          isCurrentStop ? colors.primary : colors.border
                      }
                    ]} 
                  >
                    {isPassed && (
                      <IconSymbol name="checkmark" size={8} color="white" />
                    )}
                    {isCurrentStop && (
                      <IconSymbol name="location.fill" size={8} color="white" />
                    )}
                  </Animated.View>
                  {index < selectedRoute.stops.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      { backgroundColor: isPassed ? colors.success : colors.border }
                    ]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[
                    styles.stopName,
                    { 
                      color: isPassed ? colors.textSecondary : 
                        isCurrentStop ? colors.primary : colors.text,
                      fontWeight: isCurrentStop ? '600' : '500'
                    }
                  ]}>
                    {stop.name}
                    {isCurrentStop && ' (Current)'}
                  </Text>
                  <Text style={[
                    styles.stopEta,
                    { 
                      color: isPassed ? colors.textSecondary : 
                        isCurrentStop ? colors.primary : colors.secondary
                    }
                  ]}>
                    {stop.eta}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'TRANAI',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <Pressable
              onPress={() => setSidebarVisible(!sidebarVisible)}
              style={styles.headerButton}
            >
              <IconSymbol 
                name={sidebarVisible ? "sidebar.left" : "sidebar.right"} 
                color="white" 
                size={20} 
              />
            </Pressable>
          ),
        }}
      />
      
      <View style={styles.container}>
        <View style={styles.mainContent}>
          {sidebarVisible && renderSidebar()}
          <View style={styles.rightPanel}>
            {renderMapArea()}
            {renderBusInfo()}
            {renderETATimeline()}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: width > 768 ? 320 : width * 0.85,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sidebarHeader: {
    padding: 20,
    paddingTop: 40,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  sidebarTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  sidebarSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  currentTime: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    marginHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  routesList: {
    flex: 1,
  },
  routeItem: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  routeItemActive: {
    backgroundColor: '#eff6ff',
    borderColor: colors.primary,
    elevation: 2,
    shadowColor: colors.primary,
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
    color: colors.text,
  },
  routeDestination: {
    fontSize: 14,
    color: colors.textSecondary,
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
    color: colors.primary,
  },
  networkStatus: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  networkTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  statusGrid: {
    gap: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  rightPanel: {
    flex: 1,
    gap: 16,
    padding: 16,
  },
  mapContainer: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
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
    color: colors.primary,
  },
  mapNotice: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  mapSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
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
    color: colors.text,
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
    color: colors.text,
    fontWeight: '500',
  },
  busInfoPanel: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  busInfoGradient: {
    padding: 20,
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
    color: colors.text,
  },
  busInfoDestination: {
    fontSize: 14,
    color: colors.textSecondary,
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
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  etaPanel: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  etaPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  etaPanelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  etaTimeline: {
    maxHeight: 250,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    height: 24,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  stopEta: {
    fontSize: 14,
    fontWeight: '500',
  },
  headerButton: {
    padding: 8,
  },
});
