import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Appearance, Alert } from 'react-native';

// Storage keys
const SETTINGS_STORAGE_KEY = '@dev_showcase_settings';

// Define the Settings interface
interface Settings {
  notifications: boolean;
  darkMode: 'system' | 'dark' | 'light';
  dataSync: boolean;
  compactMode: boolean;
  soundEffects: boolean;
  reminders: boolean;
  biometricAuth: boolean;
  autoSave: boolean;
}

// Default settings
const DEFAULT_SETTINGS: Settings = {
  notifications: true,
  darkMode: 'system',
  dataSync: false,
  compactMode: false,
  soundEffects: true,
  reminders: true,
  biometricAuth: false,
  autoSave: true,
};

// Light theme colors
const lightColors = {
  background: '#F0F4F8',
  card: '#FFFFFF',
  text: '#1A202C',
  subtext: '#4A5568',
  border: '#E2E8F0',
  primary: '#6C5CE7',
  secondary: '#00CECE',
  success: '#00B894',
  warning: '#FDCB6E',
  error: '#FF7675',
  highlight: '#F8F9FA',
  shadow: 'rgba(0, 0, 0, 0.1)',
  gradient: {
    primary: ['#6C5CE7', '#8E73FB'],
    secondary: ['#00CECE', '#4FD1D9'],
    success: ['#00B894', '#20D0B2'],
    warning: ['#FDCB6E', '#FEE58C'],
    error: ['#FF7675', '#FF9F9F'],
  }
};

// Dark theme colors
const darkColors = {
  background: '#10162F',
  card: '#1F2A4A',
  text: '#F8FAFC',
  subtext: '#A0AEC0',
  border: '#2D3748',
  primary: '#7E74FB',
  secondary: '#00E2E2',
  success: '#00D1B2',
  warning: '#FFD579',
  error: '#FF7F79',
  highlight: '#141B33',
  shadow: 'rgba(0, 0, 0, 0.25)',
  gradient: {
    primary: ['#7E74FB', '#A18BFC'],
    secondary: ['#00E2E2', '#7FE9E9'],
    success: ['#00D1B2', '#00F7D0'],
    warning: ['#FFD579', '#FFE7B0'],
    error: ['#FF7F79', '#FFA5A0'],
  }
};

// Common fonts
const fonts = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700',
  },
};

// Theme interface
export interface Theme {
  dark: boolean;
  colors: typeof lightColors;
  fonts: typeof fonts;
  spacing: {
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    s: number;
    m: number;
    l: number;
    xl: number;
  };
}

// Create the themes
const lightTheme: Theme = {
  dark: false,
  colors: lightColors,
  fonts,
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 12,
    xl: 24,
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: darkColors,
  fonts,
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 12,
    xl: 24,
  },
};

// Define the context type
interface ThemeContextType {
  theme: Theme;
  settings: Settings;
  updateSettings: (key: keyof Settings, value: any) => Promise<boolean>;
  authenticate: () => Promise<boolean>;
  clearAllData: () => Promise<boolean>;
  isAuthenticated: boolean;
}

// Create the context
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create a custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Create the provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(deviceColorScheme || 'light');
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load settings from AsyncStorage
  useEffect(() => {
    loadSettings();
  }, []);

  // Listen for color scheme changes and set initial value
  useEffect(() => {
    // Set initial color scheme from device
    setColorScheme(deviceColorScheme || 'light');
    
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) {
        setColorScheme(colorScheme);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [deviceColorScheme]);

  // Load settings from AsyncStorage
  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Failed to load settings', error);
    }
  };

  // Update a single setting
  const updateSettings = useCallback(async (key: keyof Settings, value: any) => {
    try {
      const newSettings = { ...settings, [key]: value };
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      return true;
    } catch (error) {
      console.error('Failed to save settings', error);
      return false;
    }
  }, [settings]);

  // Authenticate using biometrics
  const authenticate = useCallback(async () => {
    if (!settings.biometricAuth) {
      setIsAuthenticated(true);
      return true;
    }

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to Daily Hustle',
          fallbackLabel: 'Use passcode',
          disableDeviceFallback: false,
          cancelLabel: 'Cancel',
        });

        if (result.success) {
          setIsAuthenticated(true);
          return true;
        } else {
          // Authentication failed or was cancelled
          setIsAuthenticated(false);
          return false;
        }
      } else {
        // If biometric auth is not available, still allow access but notify the user
        Alert.alert(
          'Biometric Authentication Unavailable',
          'Your device does not support biometric authentication or you have not set it up. Access granted without authentication.',
          [{ text: 'OK' }]
        );
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Authentication Error', 'An error occurred during authentication. Please try again.');
      setIsAuthenticated(false);
    }

    return false;
  }, [settings.biometricAuth]);

  // Clear all data
  const clearAllData = useCallback(async () => {
    try {
      // Get all keys in AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      
      // Restore default settings
      setSettings(DEFAULT_SETTINGS);
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      
      return true;
    } catch (error) {
      console.error('Failed to clear all data', error);
      return false;
    }
  }, []);

  // Determine which theme to use based on settings
  const getTheme = (): Theme => {
    if (settings.darkMode === 'system') {
      return colorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return settings.darkMode === 'dark' ? darkTheme : lightTheme;
  };

  // The context value
  const contextValue: ThemeContextType = {
    theme: getTheme(),
    settings,
    updateSettings,
    authenticate,
    clearAllData,
    isAuthenticated,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}; 