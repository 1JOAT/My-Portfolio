import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { configurePushNotifications, registerForPushNotificationsAsync } from './src/utils/notifications';

export default function App() {
  useEffect(() => {
    // Initialize notifications
    configurePushNotifications();
    registerForPushNotificationsAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
