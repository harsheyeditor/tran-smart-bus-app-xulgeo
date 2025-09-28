
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface BookingScreenProps {
  onClose: () => void;
}

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

const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    route: 'Route 42',
    from: 'Central Station',
    to: 'Downtown Terminal',
    date: '2024-01-15',
    time: '14:30',
    price: 2.50,
    status: 'active',
  },
  {
    id: '2',
    route: 'Route 15',
    from: 'Main Street',
    to: 'Airport',
    date: '2024-01-14',
    time: '09:15',
    price: 5.00,
    status: 'used',
  },
];

export const BookingScreen: React.FC<BookingScreenProps> = ({ onClose }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [selectedTab, setSelectedTab] = useState<'book' | 'tickets'>('book');

  const handleBookTicket = (route: string, from: string, to: string, price: number) => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to book tickets');
      return;
    }

    const newTicket: Ticket = {
      id: Date.now().toString(),
      route,
      from,
      to,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price,
      status: 'active',
    };

    setTickets(prev => [newTicket, ...prev]);
    Alert.alert('Success', 'Ticket booked successfully!');
    setSelectedTab('tickets');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'used':
        return colors.textSecondary;
      case 'expired':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  const RouteCard: React.FC<{
    route: string;
    from: string;
    to: string;
    duration: string;
    price: number;
    nextDeparture: string;
  }> = ({ route, from, to, duration, price, nextDeparture }) => (
    <View style={[styles.routeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.routeHeader}>
        <Text style={[styles.routeName, { color: colors.text }]}>{route}</Text>
        <Text style={[styles.routePrice, { color: colors.primary }]}>${price.toFixed(2)}</Text>
      </View>
      
      <View style={styles.routeDetails}>
        <View style={styles.routeStops}>
          <View style={styles.stopInfo}>
            <View style={[styles.stopDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.stopName, { color: colors.text }]}>{from}</Text>
          </View>
          <View style={[styles.routeLine, { backgroundColor: colors.border }]} />
          <View style={styles.stopInfo}>
            <View style={[styles.stopDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.stopName, { color: colors.text }]}>{to}</Text>
          </View>
        </View>
        
        <View style={styles.routeMeta}>
          <View style={styles.metaItem}>
            <IconSymbol name="clock" size={16} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <IconSymbol name="calendar" size={16} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>Next: {nextDeparture}</Text>
          </View>
        </View>
      </View>
      
      <Pressable
        style={[styles.bookButton, { backgroundColor: colors.primary }]}
        onPress={() => handleBookTicket(route, from, to, price)}
      >
        <Text style={styles.bookButtonText}>Book Ticket</Text>
      </Pressable>
    </View>
  );

  const TicketCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => (
    <View style={[styles.ticketCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.ticketHeader}
      >
        <View style={styles.ticketHeaderContent}>
          <Text style={styles.ticketRoute}>{ticket.route}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
            <Text style={styles.statusText}>{ticket.status.toUpperCase()}</Text>
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.ticketBody}>
        <View style={styles.ticketJourney}>
          <View style={styles.journeyStop}>
            <Text style={[styles.journeyLabel, { color: colors.textSecondary }]}>FROM</Text>
            <Text style={[styles.journeyLocation, { color: colors.text }]}>{ticket.from}</Text>
          </View>
          <IconSymbol name="arrow.right" size={20} color={colors.primary} />
          <View style={styles.journeyStop}>
            <Text style={[styles.journeyLabel, { color: colors.textSecondary }]}>TO</Text>
            <Text style={[styles.journeyLocation, { color: colors.text }]}>{ticket.to}</Text>
          </View>
        </View>
        
        <View style={styles.ticketDetails}>
          <View style={styles.detailItem}>
            <IconSymbol name="calendar" size={16} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.text }]}>{ticket.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <IconSymbol name="clock" size={16} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.text }]}>{ticket.time}</Text>
          </View>
          <View style={styles.detailItem}>
            <IconSymbol name="dollarsign.circle" size={16} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.text }]}>${ticket.price.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.tabContainer}>
        <Pressable
          style={[
            styles.tab,
            selectedTab === 'book' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedTab('book')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: selectedTab === 'book' ? 'white' : colors.textSecondary,
              },
            ]}
          >
            Book Ticket
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            selectedTab === 'tickets' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedTab('tickets')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: selectedTab === 'tickets' ? 'white' : colors.textSecondary,
              },
            ]}
          >
            My Tickets
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'book' ? (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Available Routes
            </Text>
            <RouteCard
              route="Route 42"
              from="Central Station"
              to="Downtown Terminal"
              duration="25 min"
              price={2.50}
              nextDeparture="3 min"
            />
            <RouteCard
              route="Route 15"
              from="Main Street"
              to="Airport"
              duration="45 min"
              price={5.00}
              nextDeparture="7 min"
            />
            <RouteCard
              route="Route 8"
              from="Metro Center"
              to="Riverside"
              duration="35 min"
              price={3.75}
              nextDeparture="12 min"
            />
          </View>
        ) : (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Your Tickets ({tickets.length})
            </Text>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <IconSymbol name="ticket" size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                  No tickets found
                </Text>
                <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                  Book your first ticket to get started
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  routeCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '600',
  },
  routePrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  routeDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  routeStops: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  stopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stopName: {
    fontSize: 14,
    fontWeight: '500',
  },
  routeLine: {
    height: 2,
    flex: 1,
    marginHorizontal: 8,
  },
  routeMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  bookButton: {
    margin: 16,
    marginTop: 0,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  ticketCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  ticketHeader: {
    padding: 16,
  },
  ticketHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketRoute: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  ticketBody: {
    padding: 16,
  },
  ticketJourney: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  journeyStop: {
    alignItems: 'center',
    flex: 1,
  },
  journeyLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  journeyLocation: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  ticketDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
