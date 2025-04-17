import React from 'react';
import { LinearGradient as ExpoLinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import { ViewStyle } from 'react-native';

type GradientProps = {
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
};

export const LinearGradient: React.FC<GradientProps> = ({
  colors = ['#121638', '#2C3E50'],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  children,
}) => {
  // Convert colors array to the required type for ExpoLinearGradient
  const gradientColors = colors as unknown as readonly [string, string, ...string[]];
  
  return (
    <ExpoLinearGradient colors={gradientColors} start={start} end={end} style={style}>
      {children}
    </ExpoLinearGradient>
  );
}; 