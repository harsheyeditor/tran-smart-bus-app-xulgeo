
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { IconSymbol } from './IconSymbol';

interface AnimatedBusIconProps {
  color?: string;
  size?: number;
  isMoving?: boolean;
}

export function AnimatedBusIcon({ 
  color = '#3b82f6', 
  size = 24, 
  isMoving = true 
}: AnimatedBusIconProps) {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isMoving) {
      // Subtle movement animation
      translateX.value = withRepeat(
        withSequence(
          withTiming(2, { duration: 1500 }),
          withTiming(-2, { duration: 1500 }),
          withTiming(0, { duration: 1500 })
        ),
        -1,
        false
      );

      // Subtle scale animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        false
      );
    } else {
      translateX.value = withTiming(0);
      scale.value = withTiming(1);
    }
  }, [isMoving]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scale: scale.value }
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <IconSymbol name="bus" size={size} color={color} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
