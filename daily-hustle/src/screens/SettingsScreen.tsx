import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
  Modal,
  Share
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { LinearGradient } from '../utils/GradientWrapper';
import { sendTestNotification } from '../utils/notifications';
import { useTheme } from '../utils/ThemeContext';
import * as LocalAuthentication from 'expo-local-authentication';

// Storage keys
const NOTES_STORAGE_KEY = '@dev_showcase_notes';
const TASKS_STORAGE_KEY = '@dev_showcase_tasks';

export const SettingsScreen = () => {
  const { theme, settings, updateSettings, clearAllData } = useTheme();
  const [loading, setLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState({ notes: 0, tasks: 0 });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState('');
  const [deviceInfo, setDeviceInfo] = useState<{
    deviceName: string;
    brand: string;
    modelName: string;
    osVersion: string;
    appVersion: string;
  }>({
    deviceName: '',
    brand: '',
    modelName: '',
    osVersion: '',
    appVersion: '',
  });
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Load info on mount
  useEffect(() => {
    loadStorageInfo();
    loadDeviceInfo();
    checkBiometricAvailability();
    setLoading(false);
  }, []);

  // Update storage info when settings change
  useEffect(() => {
    loadStorageInfo();
  }, [settings]);

  // Check biometric availability
  const checkBiometricAvailability = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(hasHardware && isEnrolled);
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setBiometricAvailable(false);
    }
  };

  // Load storage info
  const loadStorageInfo = async () => {
    try {
      const notesData = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      const tasksData = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      
      const notesCount = notesData ? JSON.parse(notesData).length : 0;
      const tasksCount = tasksData ? JSON.parse(tasksData).length : 0;
      
      setStorageInfo({ notes: notesCount, tasks: tasksCount });
    } catch (error) {
      console.error('Failed to load storage info', error);
    }
  };

  // Load device info
  const loadDeviceInfo = async () => {
    try {
      const deviceName = Device.deviceName || 'Unknown Device';
      const brand = Device.brand || 'Unknown Brand';
      const modelName = Device.modelName || 'Unknown Model';
      const osVersion = `${Platform.OS} ${Platform.Version}`;
      const appVersion =  '1.0.0';
      
      setDeviceInfo({
        deviceName,
        brand,
        modelName,
        osVersion,
        appVersion,
      });
    } catch (error) {
      console.error('Failed to load device info', error);
    }
  };

  // Handle settings toggle
  const handleToggleSetting = (key: keyof typeof settings) => {
    if (key === 'darkMode') {
      setShowThemeModal(true);
      return;
    }
    
    if (key === 'biometricAuth' && !biometricAvailable) {
      Alert.alert(
        'Biometric Authentication Not Available',
        'Your device does not support biometric authentication or you have not set it up.'
      );
      return;
    }
    
    updateSettings(key, !settings[key]);
  };

  // Set theme
  const setTheme = (mode: 'system' | 'dark' | 'light') => {
    updateSettings('darkMode', mode);
    setShowThemeModal(false);
  };

  // Handle clear data
  const handleClearData = () => {
    setConfirmMessage('This will permanently delete all your data including notes, tasks, and settings. This action cannot be undone.');
    setConfirmAction(() => clearDataAndSettings);
    setShowConfirmModal(true);
  };

  // Clear data and settings
  const clearDataAndSettings = async () => {
    try {
      await clearAllData();
      setStorageInfo({ notes: 0, tasks: 0 });
      Alert.alert('Success', 'All data has been cleared');
    } catch (error) {
      console.error('Failed to clear data', error);
      Alert.alert('Error', 'Failed to clear data');
    } finally {
      setShowConfirmModal(false);
    }
  };

  // Clear only notes and tasks
  const handleClearOnlyData = () => {
    setConfirmMessage('This will permanently delete all your notes and tasks. This action cannot be undone.');
    setConfirmAction(() => clearOnlyData);
    setShowConfirmModal(true);
  };

  // Clear only notes and tasks
  const clearOnlyData = async () => {
    try {
      await AsyncStorage.multiRemove([NOTES_STORAGE_KEY, TASKS_STORAGE_KEY]);
      setStorageInfo({ notes: 0, tasks: 0 });
      Alert.alert('Success', 'All notes and tasks have been cleared');
    } catch (error) {
      console.error('Failed to clear data', error);
      Alert.alert('Error', 'Failed to clear data');
    } finally {
      setShowConfirmModal(false);
    }
  };

  // Export data
  const handleExportData = async () => {
    try {
      const notesData = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      const tasksData = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      
      const exportData = {
        notes: notesData ? JSON.parse(notesData) : [],
        tasks: tasksData ? JSON.parse(tasksData) : [],
        exportDate: new Date().toISOString(),
      };
      
      const exportString = JSON.stringify(exportData, null, 2);
      
      await Share.share({
        message: exportString,
        title: 'DevShowcase Data Export',
      });
    } catch (error) {
      console.error('Failed to export data', error);
      Alert.alert('Error', 'Failed to export data');
    }
  };

  // Test notification
  const handleTestNotification = async () => {
    try {
      await sendTestNotification('Test Notification', 'This is a test notification from the Settings screen!');
      Alert.alert('Success', 'Test notification sent');
    } catch (error) {
      console.error('Failed to send test notification', error);
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  // Open URL
  const handleOpenUrl = (url: string) => {
    Linking.openURL(url).catch((err) => {
      console.error('Failed to open URL:', err);
      Alert.alert('Error', 'Could not open the URL');
    });
  };
  
  // Theme Modal
  const renderThemeModal = () => {
    return (
      <Modal
        visible={showThemeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowThemeModal(false)}
        >
          <View style={[styles.themeModalContainer, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.themeModalTitle, { color: theme.colors.text }]}>Choose Theme</Text>
            
            <TouchableOpacity
              style={[
                styles.themeOption,
                { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
                settings.darkMode === 'system' && [styles.selectedThemeOption, { borderColor: theme.colors.primary }]
              ]}
              onPress={() => setTheme('system')}
            >
              <Ionicons name="phone-portrait" size={24} color={theme.colors.primary} />
              <View style={styles.themeOptionTextContainer}>
                <Text style={[styles.themeOptionTitle, { color: theme.colors.text }]}>System Default</Text>
                <Text style={[styles.themeOptionDescription, { color: theme.colors.subtext }]}>Follow your device theme settings</Text>
              </View>
              {settings.darkMode === 'system' && (
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.themeOption,
                { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
                settings.darkMode === 'dark' && [styles.selectedThemeOption, { borderColor: theme.colors.primary }]
              ]}
              onPress={() => setTheme('dark')}
            >
              <Ionicons name="moon" size={24} color={theme.colors.primary} />
              <View style={styles.themeOptionTextContainer}>
                <Text style={[styles.themeOptionTitle, { color: theme.colors.text }]}>Dark Mode</Text>
                <Text style={[styles.themeOptionDescription, { color: theme.colors.subtext }]}>Easy on the eyes in low light</Text>
              </View>
              {settings.darkMode === 'dark' && (
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.themeOption,
                { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
                settings.darkMode === 'light' && [styles.selectedThemeOption, { borderColor: theme.colors.primary }]
              ]}
              onPress={() => setTheme('light')}
            >
              <Ionicons name="sunny" size={24} color={theme.colors.primary} />
              <View style={styles.themeOptionTextContainer}>
                <Text style={[styles.themeOptionTitle, { color: theme.colors.text }]}>Light Mode</Text>
                <Text style={[styles.themeOptionDescription, { color: theme.colors.subtext }]}>Classic bright appearance</Text>
              </View>
              {settings.darkMode === 'light' && (
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowThemeModal(false)}
            >
              <Text style={[styles.cancelButtonText, { color: theme.colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[theme.colors.background, theme.colors.card]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.card]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style={theme.dark ? "light" : "dark"} />
      
      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowConfirmModal(false)}
        >
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Confirm Action</Text>
            <Text style={[styles.modalText, { color: theme.colors.subtext }]}>{confirmMessage}</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton, { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmModalButton, { backgroundColor: theme.colors.primary }]}
                onPress={confirmAction}
              >
                <Text style={[styles.modalButtonText, styles.confirmModalButtonText]}>Confirm</Text>
              </TouchableOpacity>
            </View>
      </View>
        </TouchableOpacity>
      </Modal>

      {/* Theme Selection Modal */}
      {renderThemeModal()}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="settings" size={28} color={theme.colors.primary} />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Appearance</Text>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => handleToggleSetting('darkMode')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Theme</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>
                  {settings.darkMode === 'system' 
                    ? 'System Default' 
                    : settings.darkMode === 'dark'
                      ? 'Dark Mode'
                      : 'Light Mode'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
          
          {/* <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="contract" size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Compact Mode</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>Reduce visual spacing in the UI</Text>
              </View>
            </View>
            <Switch
              value={settings.compactMode}
              onValueChange={() => handleToggleSetting('compactMode')}
              trackColor={{ false: theme.dark ? '#4A5568' : '#CBD5E0', true: theme.colors.primary }}
              thumbColor="#F9FAFB"
              ios_backgroundColor={theme.dark ? '#4A5568' : '#CBD5E0'}
            />
          </View> */}
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notifications</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Push Notifications</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>Receive app notifications</Text>
              </View>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={() => handleToggleSetting('notifications')}
              trackColor={{ false: theme.dark ? '#4A5568' : '#CBD5E0', true: theme.colors.primary }}
              thumbColor="#F9FAFB"
              ios_backgroundColor={theme.dark ? '#4A5568' : '#CBD5E0'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="alarm" size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Reminders</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>Get reminders for tasks</Text>
              </View>
            </View>
            <Switch
              value={settings.reminders}
              onValueChange={() => handleToggleSetting('reminders')}
              trackColor={{ false: theme.dark ? '#4A5568' : '#CBD5E0', true: theme.colors.primary }}
              thumbColor="#F9FAFB"
              ios_backgroundColor={theme.dark ? '#4A5568' : '#CBD5E0'}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={handleTestNotification}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="paper-plane" size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Test Notification</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>Send a test notification</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Data & Security</Text>
          
          {/* <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="cloud-upload" size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Data Synchronization</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>Sync data across devices</Text>
              </View>
            </View>
            <Switch
              value={settings.dataSync}
              onValueChange={() => handleToggleSetting('dataSync')}
              trackColor={{ false: theme.dark ? '#4A5568' : '#CBD5E0', true: theme.colors.primary }}
              thumbColor="#F9FAFB"
              ios_backgroundColor={theme.dark ? '#4A5568' : '#CBD5E0'}
            />
          </View> */}
          
          {/* <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="save" size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Auto-Save</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>Save changes automatically</Text>
              </View>
            </View>
            <Switch
              value={settings.autoSave}
              onValueChange={() => handleToggleSetting('autoSave')}
              trackColor={{ false: theme.dark ? '#4A5568' : '#CBD5E0', true: theme.colors.primary }}
              thumbColor="#F9FAFB"
              ios_backgroundColor={theme.dark ? '#4A5568' : '#CBD5E0'}
            />
          </View> */}
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="finger-print" size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Biometric Authentication</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>
                  {biometricAvailable
                    ? 'Secure app with biometrics'
                    : 'Not available on this device'}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.biometricAuth}
              onValueChange={() => handleToggleSetting('biometricAuth')}
              trackColor={{ false: theme.dark ? '#4A5568' : '#CBD5E0', true: theme.colors.primary }}
              thumbColor="#F9FAFB"
              ios_backgroundColor={theme.dark ? '#4A5568' : '#CBD5E0'}
              disabled={!biometricAvailable}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={handleExportData}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="download" size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Export Data</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>Export all notes and tasks</Text>
            </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
          </View>
          
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Storage</Text>
          
          <View style={[styles.infoBox, { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.text }]}>Notes</Text>
              <Text style={[styles.infoValue, { color: theme.colors.primary }]}>{storageInfo.notes} items</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.text }]}>Tasks</Text>
              <Text style={[styles.infoValue, { color: theme.colors.primary }]}>{storageInfo.tasks} items</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.text }]}>Total Items</Text>
              <Text style={[styles.infoValue, { color: theme.colors.primary }]}>{storageInfo.notes + storageInfo.tasks} items</Text>
            </View>
          </View>
          
            <TouchableOpacity 
            style={styles.settingRow}
            onPress={handleClearOnlyData}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="trash-bin" size={24} color={theme.colors.error} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Clear Data</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>Delete all notes and tasks</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
            </TouchableOpacity>
            
            <TouchableOpacity 
            style={styles.settingRow}
              onPress={handleClearData}
            >
            <View style={styles.settingInfo}>
              <Ionicons name="warning" size={24} color={theme.colors.error} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Reset All</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>Clear data and reset settings</Text>
          </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Device Information</Text>
          
          <View style={[styles.infoBox, { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.text }]}>Device</Text>
              <Text style={[styles.infoValue, { color: theme.colors.subtext }]}>{deviceInfo.brand} {deviceInfo.modelName}</Text>
        </View>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.text }]}>OS</Text>
              <Text style={[styles.infoValue, { color: theme.colors.subtext }]}>{deviceInfo.osVersion}</Text>
          </View>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.text }]}>App Version</Text>
              <Text style={[styles.infoValue, { color: theme.colors.subtext }]}>{deviceInfo.appVersion}</Text>
          </View>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Feedback</Text>
          
          {/* <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => handleOpenUrl('https://example.com/privacy')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Privacy Policy</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>Read our privacy policy</Text>
              </View>
            </View>
            <Ionicons name="open-outline" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => handleOpenUrl('https://example.com/terms')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="document-text" size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Terms of Service</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>Read our terms of service</Text>
              </View>
            </View>
            <Ionicons name="open-outline" size={20} color={theme.colors.subtext} />
          </TouchableOpacity> */}
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => handleOpenUrl('https://simplyjoat.site#contact')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="chatbubble" size={24} color={theme.colors.primary} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Send Feedback</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>Help us improve the app</Text>
              </View>
            </View>
            <Ionicons name="open-outline" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.subtext }]}>
            © {new Date().getFullYear()} Joat
          </Text>
          <Text style={[styles.footerVersion, { color: theme.colors.subtext }]}>
            Version {deviceInfo.appVersion}
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
  },
  infoBox: {
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  modalContainer: {
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    margin: 4,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelModalButton: {
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  confirmModalButton: {
    backgroundColor: '#FF6B6B',
  },
  confirmModalButtonText: {
    color: 'white',
  },
  themeModalContainer: {
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  themeModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedThemeOption: {
    borderWidth: 1,
  },
  themeOptionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  themeOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  themeOptionDescription: {
    fontSize: 12,
  },
  cancelButton: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 