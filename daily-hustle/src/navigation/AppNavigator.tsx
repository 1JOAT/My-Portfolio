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
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from '../utils/GradientWrapper';

const Tab = createBottomTabNavigator<RootStackParamList>();

// Custom header component
const CustomHeader = () => (
  <LinearGradient
    colors={['#121638', '#1E293B']}
    style={styles.headerContainer}
  >
    <Text style={styles.headerTitle}>DevShowcase</Text>
    <Text style={styles.headerSubtitle}>Demo Features & Capabilities</Text>
  </LinearGradient>
);

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#121638" />
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
              } else if (route.name === 'Settings') {
                iconName = 'settings';
              } else {
                iconName = 'help-circle';
              }

              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#FF6B6B',
            tabBarInactiveTintColor: '#94A3B8',
            tabBarStyle: {
              backgroundColor: '#121638',
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
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121638',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
}); 