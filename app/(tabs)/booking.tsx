
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

interface Ticket {
  id: string;
  route: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  status: 'active' | 'used' | 'expired';
}

interface BookingForm {
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    route: 'Route 42',
    from: 'Central Station',
    to: 'Downtown Terminal',
    date: '2024-01-15',
    time: '09:30',
    price: 2.50,
    status: 'active'
  },
  {
    id: '2',
    route: 'Route 15',
    from: 'Main Street',
    to: 'Airport',
    date: '2024-01-14',
    time: '14:15',
    price: 5.00,
    status: 'used'
  },
  {
    id: '3',
    route: 'Route 8',
    from: 'Metro Center',
    to: 'Riverside',
    date: '2024-01-10',
    time: '18:45',
    price: 3.25,
    status: 'expired'
  }
];

const POPULAR_ROUTES = [
  { from: 'Central Station', to: 'Downtown Terminal', price: 2.50, duration: '15 min' },
  { from: 'Main Street', to: 'Airport', price: 5.00, duration: '25 min' },
  { from: 'Metro Center', to: 'Riverside', price: 3.25, duration: '20 min' },
  { from: 'University Ave', to: 'Hospital District', price: 2.00, duration: '12 min' },
];

export default function BookingScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'book' | 'tickets'>('book');
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    passengers: 1,
  });

  const handleBookTicket = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to book tickets.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/(tabs)/profile') }
      ]);
      return;
    }

    if (!bookingForm.from || !bookingForm.to) {
      Alert.alert('Missing Information', 'Please select both departure and destination stops.');
      return;
    }

    const newTicket: Ticket = {
      id: Date.now().toString(),
      route: 'Route 42', // This would be determined by the route
      from: bookingForm.from,
      to: bookingForm.to,
      date: bookingForm.date,
      time: bookingForm.time,
      price: 2.50 * bookingForm.passengers,
      status: 'active'
    };

    setTickets([newTicket, ...tickets]);
    setActiveTab('tickets');
    
    Alert.alert(
      'Booking Confirmed!', 
      `Your ticket for ${bookingForm.from} to ${bookingForm.to} has been booked successfully.`,
      [{ text: 'OK' }]
    );

    // Reset form
    setBookingForm({
      from: '',
      to: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      passengers: 1,
    });
  };

  const getTicketStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'used': return colors.grey;
      case 'expired': return colors.danger;
      default: return colors.grey;
    }
  };

  const getTicketStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'checkmark.circle.fill';
      case 'used': return 'checkmark.circle';
      case 'expired': return 'xmark.circle.fill';
      default: return 'circle';
    }
  };

  const renderBookingTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Quick Book Section */}
      <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Book Your Journey</Text>
        
        <View style={[styles.bookingCard, { backgroundColor: colors.surface }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>From</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Select departure stop"
              placeholderTextColor={colors.grey}
              value={bookingForm.from}
              onChangeText={(text) => setBookingForm({ ...bookingForm, from: text })}
            />
          </View>

          <View style={styles.swapContainer}>
            <Pressable style={[styles.swapButton, { backgroundColor: colors.primary }]}>
              <IconSymbol name="arrow.up.arrow.down" size={16} color="white" />
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>To</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Select destination stop"
              placeholderTextColor={colors.grey}
              value={bookingForm.to}
              onChangeText={(text) => setBookingForm({ ...bookingForm, to: text })}
            />
          </View>

          <View style={styles.dateTimeRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Date</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={bookingForm.date}
                onChangeText={(text) => setBookingForm({ ...bookingForm, date: text })}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Time</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={bookingForm.time}
                onChangeText={(text) => setBookingForm({ ...bookingForm, time: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Passengers</Text>
            <View style={styles.passengerSelector}>
              <Pressable
                style={[styles.passengerButton, { backgroundColor: colors.background }]}
                onPress={() => setBookingForm({ ...bookingForm, passengers: Math.max(1, bookingForm.passengers - 1) })}
              >
                <IconSymbol name="minus" size={16} color={colors.text} />
              </Pressable>
              <Text style={[styles.passengerCount, { color: colors.text }]}>{bookingForm.passengers}</Text>
              <Pressable
                style={[styles.passengerButton, { backgroundColor: colors.background }]}
                onPress={() => setBookingForm({ ...bookingForm, passengers: Math.min(10, bookingForm.passengers + 1) })}
              >
                <IconSymbol name="plus" size={16} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={[styles.bookButton, { backgroundColor: colors.primary }]}
            onPress={handleBookTicket}
          >
            <IconSymbol name="ticket.fill" size={20} color="white" />
            <Text style={styles.bookButtonText}>Book Ticket</Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Popular Routes */}
      <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Routes</Text>
        {POPULAR_ROUTES.map((route, index) => (
          <Animated.View
            key={index}
            entering={FadeInUp.delay(500 + index * 100)}
          >
            <Pressable
              style={[styles.routeCard, { backgroundColor: colors.surface }]}
              onPress={() => setBookingForm({ 
                ...bookingForm, 
                from: route.from, 
                to: route.to 
              })}
            >
              <View style={styles.routeInfo}>
                <View style={styles.routeStops}>
                  <Text style={[styles.routeStop, { color: colors.text }]}>{route.from}</Text>
                  <IconSymbol name="arrow.right" size={16} color={colors.grey} />
                  <Text style={[styles.routeStop, { color: colors.text }]}>{route.to}</Text>
                </View>
                <View style={styles.routeDetails}>
                  <Text style={[styles.routePrice, { color: colors.primary }]}>${route.price}</Text>
                  <Text style={[styles.routeDuration, { color: colors.textSecondary }]}>{route.duration}</Text>
                </View>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.grey} />
            </Pressable>
          </Animated.View>
        ))}
      </Animated.View>
    </ScrollView>
  );

  const renderTicketsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>My Tickets</Text>
        
        {tickets.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
            <IconSymbol name="ticket" size={48} color={colors.grey} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Tickets Yet</Text>
            <Text style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
              Book your first ticket to get started
            </Text>
            <Pressable
              style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
              onPress={() => setActiveTab('book')}
            >
              <Text style={styles.emptyStateButtonText}>Book Now</Text>
            </Pressable>
          </View>
        ) : (
          tickets.map((ticket, index) => (
            <Animated.View
              key={ticket.id}
              entering={FadeInUp.delay(300 + index * 100)}
            >
              <View style={[styles.ticketCard, { backgroundColor: colors.surface }]}>
                <View style={styles.ticketHeader}>
                  <View style={styles.ticketRoute}>
                    <Text style={[styles.ticketRouteText, { color: colors.primary }]}>{ticket.route}</Text>
                    <View style={[styles.ticketStatus, { backgroundColor: getTicketStatusColor(ticket.status) + '20' }]}>
                      <IconSymbol 
                        name={getTicketStatusIcon(ticket.status)} 
                        size={12} 
                        color={getTicketStatusColor(ticket.status)} 
                      />
                      <Text style={[styles.ticketStatusText, { color: getTicketStatusColor(ticket.status) }]}>
                        {ticket.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.ticketJourney}>
                  <View style={styles.ticketStop}>
                    <View style={[styles.ticketStopDot, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.ticketStopText, { color: colors.text }]}>{ticket.from}</Text>
                  </View>
                  <View style={[styles.ticketLine, { backgroundColor: colors.border }]} />
                  <View style={styles.ticketStop}>
                    <View style={[styles.ticketStopDot, { backgroundColor: colors.success }]} />
                    <Text style={[styles.ticketStopText, { color: colors.text }]}>{ticket.to}</Text>
                  </View>
                </View>

                <View style={styles.ticketFooter}>
                  <View style={styles.ticketDateTime}>
                    <IconSymbol name="calendar" size={14} color={colors.textSecondary} />
                    <Text style={[styles.ticketDateTimeText, { color: colors.textSecondary }]}>
                      {ticket.date} at {ticket.time}
                    </Text>
                  </View>
                  <Text style={[styles.ticketPrice, { color: colors.primary }]}>
                    ${ticket.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))
        )}
      </Animated.View>
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <Animated.View entering={FadeInDown.delay(200)}>
          <Text style={styles.headerTitle}>Booking</Text>
          <Text style={styles.headerSubtitle}>Book tickets & manage journeys</Text>
        </Animated.View>
      </LinearGradient>

      {/* Tab Selector */}
      <Animated.View entering={FadeInUp.delay(300)} style={[styles.tabSelector, { backgroundColor: colors.surface }]}>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'book' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('book')}
        >
          <IconSymbol 
            name="plus.circle.fill" 
            size={20} 
            color={activeTab === 'book' ? 'white' : colors.grey} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'book' ? 'white' : colors.grey }
          ]}>
            Book Ticket
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'tickets' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('tickets')}
        >
          <IconSymbol 
            name="ticket.fill" 
            size={20} 
            color={activeTab === 'tickets' ? 'white' : colors.grey} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'tickets' ? 'white' : colors.grey }
          ]}>
            My Tickets
          </Text>
        </Pressable>
      </Animated.View>

      {/* Tab Content */}
      {activeTab === 'book' ? renderBookingTab() : renderTicketsTab()}
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
  tabSelector: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  bookingCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  swapContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  swapButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTimeRow: {
    flexDirection: 'row',
  },
  passengerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  passengerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passengerCount: {
    fontSize: 18,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  routeInfo: {
    flex: 1,
  },
  routeStops: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  routeStop: {
    fontSize: 16,
    fontWeight: '500',
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  routePrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  routeDuration: {
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  ticketCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ticketHeader: {
    marginBottom: 16,
  },
  ticketRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketRouteText: {
    fontSize: 18,
    fontWeight: '700',
  },
  ticketStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ticketStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  ticketJourney: {
    marginBottom: 16,
  },
  ticketStop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
  },
  ticketStopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ticketStopText: {
    fontSize: 16,
    fontWeight: '500',
  },
  ticketLine: {
    width: 2,
    height: 20,
    marginLeft: 4,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketDateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticketDateTimeText: {
    fontSize: 14,
  },
  ticketPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
});
