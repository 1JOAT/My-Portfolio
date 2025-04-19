import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { RootStackParamList } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { NotesScreen } from '../screens/NotesScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ContactScreen } from '../screens/ContactScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from '../utils/GradientWrapper';
import { useTheme } from '../utils/ThemeContext';

const Tab = createBottomTabNavigator<RootStackParamList>();

// Custom header component
const CustomHeader = () => {
  const { theme } = useTheme();
  
  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.card]}
      style={styles.headerContainer}
    >
      <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>DevShowcase</Text>
      <Text style={[styles.headerSubtitle, { color: theme.colors.subtext }]}>Demo Features & Capabilities</Text>
    </LinearGradient>
  );
};

export const AppNavigator = () => {
  const { theme, authenticate } = useTheme();
  
  // Authenticate user when app loads
  React.useEffect(() => {
    authenticate();
  }, [authenticate]);
  
  return (
    <NavigationContainer>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <StatusBar 
          barStyle={theme.dark ? "light-content" : "dark-content"} 
          backgroundColor={theme.colors.background} 
        />
        <CustomHeader />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string;

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Notes') {
                iconName = 'document-text';
              } else if (route.name === 'Tasks') {
                iconName = 'checkmark-circle';
              } else if (route.name === 'Contact') {
                iconName = 'mail';
              } else if (route.name === 'Settings') {
                iconName = 'settings';
              } else {
                iconName = 'help-circle';
              }

              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.subtext,
            tabBarStyle: {
              backgroundColor: theme.colors.background,
              borderTopWidth: 0,
              elevation: 0,
              height: Platform.OS === 'ios' ? 80 : 60,
              paddingBottom: Platform.OS === 'ios' ? 20 : 8,
              paddingTop: 8,
            },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Notes" component={NotesScreen} />
          <Tab.Screen name="Tasks" component={TasksScreen} />
          <Tab.Screen name="Contact" component={ContactScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 