
import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onValueChange,
  label,
  disabled = false,
  size = 'medium',
}) => {
  const { colors } = useTheme();
  const animatedValue = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    animatedValue.value = withSpring(value ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [value]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 24, thumbSize: 18 };
      case 'large':
        return { width: 60, height: 36, thumbSize: 30 };
      default:
        return { width: 50, height: 30, thumbSize: 24 };
    }
  };

  const sizeStyles = getSizeStyles();

  const trackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animatedValue.value,
      [0, 1],
      [colors.border, colors.primary]
    );

    return {
      backgroundColor,
      opacity: disabled ? 0.5 : 1,
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    const translateX = animatedValue.value * (sizeStyles.width - sizeStyles.thumbSize - 6);
    
    return {
      transform: [{ translateX }],
    };
  });

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={[styles.pressable, { opacity: disabled ? 0.5 : 1 }]}
      >
        <Animated.View
          style={[
            styles.track,
            trackStyle,
            {
              width: sizeStyles.width,
              height: sizeStyles.height,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              thumbStyle,
              {
                width: sizeStyles.thumbSize,
                height: sizeStyles.thumbSize,
                backgroundColor: colors.surface,
              },
            ]}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  pressable: {
    padding: 4,
  },
  track: {
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  thumb: {
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
