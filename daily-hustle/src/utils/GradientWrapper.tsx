import React from 'react';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { ViewStyle } from 'react-native';
import { useTheme } from './ThemeContext';

type GradientProps = {
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'background' | 'custom';
};

export const LinearGradient: React.FC<GradientProps> = ({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  children,
  variant = 'background',
}) => {
  const { theme } = useTheme();
  
  // Get colors based on variant
  const getGradientColors = () => {
    if (colors) return colors;
    
    switch (variant) {
      case 'primary':
        return [theme.colors.primary, theme.dark ? '#993D3D' : '#FF8F8F'];
      case 'secondary':
        return [theme.colors.secondary, theme.dark ? '#3B357A' : '#6C63FF'];
      case 'background':
      default:
        return [theme.colors.background, theme.colors.card];
    }
  };
  
  // Convert colors array to the required type for ExpoLinearGradient
  const gradientColors = getGradientColors() as unknown as readonly [string, string, ...string[]];
  
  return (
    <ExpoLinearGradient colors={gradientColors} start={start} end={end} style={style}>
      {children}
    </ExpoLinearGradient>
  );
}; 