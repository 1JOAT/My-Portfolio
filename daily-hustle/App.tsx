import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { configurePushNotifications, registerForPushNotificationsAsync } from './src/utils/notifications';
import { ThemeProvider } from './src/utils/ThemeContext';

export default function App() {
  useEffect(() => {
    // Initialize notifications
    configurePushNotifications();
    registerForPushNotificationsAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
