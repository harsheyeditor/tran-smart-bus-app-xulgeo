
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';

interface BusStatusIndicatorProps {
  status: 'active' | 'delayed' | 'offline';
  size?: 'small' | 'medium' | 'large';
}

export function BusStatusIndicator({ status, size = 'medium' }: BusStatusIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return '#22c55e';
      case 'delayed':
        return '#f59e0b';
      case 'offline':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return 'checkmark.circle.fill';
      case 'delayed':
        return 'clock.fill';
      case 'offline':
        return 'xmark.circle.fill';
      default:
        return 'questionmark.circle.fill';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 20;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  return (
    <View style={styles.container}>
      <IconSymbol 
        name={getStatusIcon()} 
        size={getSize()} 
        color={getStatusColor()} 
      />
      <Text style={[styles.statusText, { color: getStatusColor() }]}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
