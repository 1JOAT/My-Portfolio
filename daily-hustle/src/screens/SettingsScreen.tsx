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

// Storage keys
const NOTES_STORAGE_KEY = '@dev_showcase_notes';
const TASKS_STORAGE_KEY = '@dev_showcase_tasks';
const SETTINGS_STORAGE_KEY = '@dev_showcase_settings';

// Default settings
const DEFAULT_SETTINGS = {
  notifications: true,
  darkMode: true,
  dataSync: false,
  compactMode: false,
  soundEffects: true,
};

export const SettingsScreen = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
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

  // Load settings from AsyncStorage
  useEffect(() => {
    loadSettings();
    loadStorageInfo();
    loadDeviceInfo();
  }, []);

  // Load settings from AsyncStorage
  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Failed to load settings', error);
    } finally {
      setLoading(false);
    }
  };

  // Save settings to AsyncStorage
  const saveSettings = async (newSettings: typeof DEFAULT_SETTINGS) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings', error);
      Alert.alert('Error', 'Failed to save settings');
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
      const appVersion = Application.nativeApplicationVersion || '1.0.0';
      
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
  const handleToggleSetting = (key: keyof typeof DEFAULT_SETTINGS) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  // Handle clear data
  const handleClearData = () => {
    setConfirmMessage('This will permanently delete all your notes and tasks. This action cannot be undone.');
    setConfirmAction(() => clearAllData);
    setShowConfirmModal(true);
  };

  // Clear all data
  const clearAllData = async () => {
    try {
      await AsyncStorage.multiRemove([NOTES_STORAGE_KEY, TASKS_STORAGE_KEY]);
      setStorageInfo({ notes: 0, tasks: 0 });
      Alert.alert('Success', 'All data has been cleared');
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

  if (loading) {
    return (
      <LinearGradient
        colors={['#121638', '#2C3E50']}
        style={[styles.container, styles.loadingContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#121638', '#2C3E50']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Ionicons name="settings" size={28} color="#FF6B6B" />
        <Text style={styles.headerText}>Settings</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={22} color="#FF6B6B" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={() => handleToggleSetting('notifications')}
              trackColor={{ false: '#3E4C5E', true: '#FF8E53' }}
              thumbColor={settings.notifications ? '#FF6B6B' : '#f4f3f4'}
              ios_backgroundColor="#3E4C5E"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={22} color="#FF6B6B" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={() => handleToggleSetting('darkMode')}
              trackColor={{ false: '#3E4C5E', true: '#FF8E53' }}
              thumbColor={settings.darkMode ? '#FF6B6B' : '#f4f3f4'}
              ios_backgroundColor="#3E4C5E"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="sync" size={22} color="#FF6B6B" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Data Sync</Text>
            </View>
            <Switch
              value={settings.dataSync}
              onValueChange={() => handleToggleSetting('dataSync')}
              trackColor={{ false: '#3E4C5E', true: '#FF8E53' }}
              thumbColor={settings.dataSync ? '#FF6B6B' : '#f4f3f4'}
              ios_backgroundColor="#3E4C5E"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="contract" size={22} color="#FF6B6B" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Compact Mode</Text>
            </View>
            <Switch
              value={settings.compactMode}
              onValueChange={() => handleToggleSetting('compactMode')}
              trackColor={{ false: '#3E4C5E', true: '#FF8E53' }}
              thumbColor={settings.compactMode ? '#FF6B6B' : '#f4f3f4'}
              ios_backgroundColor="#3E4C5E"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high" size={22} color="#FF6B6B" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Sound Effects</Text>
            </View>
            <Switch
              value={settings.soundEffects}
              onValueChange={() => handleToggleSetting('soundEffects')}
              trackColor={{ false: '#3E4C5E', true: '#FF8E53' }}
              thumbColor={settings.soundEffects ? '#FF6B6B' : '#f4f3f4'}
              ios_backgroundColor="#3E4C5E"
            />
          </View>
        </View>
        
        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <View style={styles.dataInfoContainer}>
            <View style={styles.dataInfoItem}>
              <Text style={styles.dataInfoLabel}>Notes</Text>
              <Text style={styles.dataInfoValue}>{storageInfo.notes}</Text>
            </View>
            <View style={styles.dataInfoItem}>
              <Text style={styles.dataInfoLabel}>Tasks</Text>
              <Text style={styles.dataInfoValue}>{storageInfo.tasks}</Text>
            </View>
            <View style={styles.dataInfoItem}>
              <Text style={styles.dataInfoLabel}>Total</Text>
              <Text style={styles.dataInfoValue}>{storageInfo.notes + storageInfo.tasks}</Text>
            </View>
          </View>
          
          <View style={styles.dataButtons}>
            <TouchableOpacity style={styles.dataButton} onPress={handleExportData}>
              <Ionicons name="download" size={20} color="#F9FAFB" />
              <Text style={styles.dataButtonText}>Export Data</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.dataButton, styles.dangerButton]} onPress={handleClearData}>
              <Ionicons name="trash" size={20} color="#F9FAFB" />
              <Text style={styles.dataButtonText}>Clear All Data</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Notification Testing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Testing</Text>
          
          <TouchableOpacity 
            style={styles.notificationButton} 
            onPress={handleTestNotification}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.notificationButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="notifications" size={20} color="white" />
              <Text style={styles.notificationButtonText}>Send Test Notification</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={styles.helpText}>
            Test push notifications to ensure they're working correctly on your device.
          </Text>
        </View>
        
        {/* Device Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Information</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Device</Text>
            <Text style={styles.infoValue}>{deviceInfo.deviceName}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Model</Text>
            <Text style={styles.infoValue}>{deviceInfo.brand} {deviceInfo.modelName}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>OS Version</Text>
            <Text style={styles.infoValue}>{deviceInfo.osVersion}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>{deviceInfo.appVersion}</Text>
          </View>
        </View>
        
        {/* About & Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About & Links</Text>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => handleOpenUrl('https://github.com/yourusername/DevShowcase')}
          >
            <Ionicons name="logo-github" size={22} color="#FF6B6B" style={styles.linkIcon} />
            <Text style={styles.linkText}>GitHub Repository</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => handleOpenUrl('https://yourportfolio.com')}
          >
            <Ionicons name="globe" size={22} color="#FF6B6B" style={styles.linkIcon} />
            <Text style={styles.linkText}>Developer Website</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => handleOpenUrl('mailto:your.email@example.com')}
          >
            <Ionicons name="mail" size={22} color="#FF6B6B" style={styles.linkIcon} />
            <Text style={styles.linkText}>Contact Developer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => Alert.alert('About DevShowcase', 'This app showcases various mobile app development features including AsyncStorage persistence, push notifications, and beautiful UI components. It was built with React Native and Expo.')}
          >
            <Ionicons name="information-circle" size={22} color="#FF6B6B" style={styles.linkIcon} />
            <Text style={styles.linkText}>About This App</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>DevShowcase v1.0.0</Text>
          <Text style={styles.footerSubText}>Built with React Native & Expo</Text>
        </View>
      </ScrollView>
      
      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="warning" size={50} color="#FF6B6B" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Warning</Text>
            <Text style={styles.modalMessage}>{confirmMessage}</Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={confirmAction}
              >
                <Text style={styles.modalConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#CBD5E1',
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#F9FAFB',
  },
  dataInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dataInfoItem: {
    alignItems: 'center',
  },
  dataInfoLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  dataInfoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  dataButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    flex: 0.48,
  },
  dangerButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  dataButtonText: {
    color: '#F9FAFB',
    fontWeight: '600',
    marginLeft: 8,
  },
  notificationButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  notificationButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  notificationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  helpText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  infoValue: {
    fontSize: 14,
    color: '#F9FAFB',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  linkIcon: {
    marginRight: 12,
  },
  linkText: {
    fontSize: 16,
    color: '#F9FAFB',
  },
  footer: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CBD5E1',
  },
  footerSubText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalCancelButtonText: {
    color: '#CBD5E1',
    fontWeight: '600',
  },
  modalConfirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#FF6B6B',
  },
  modalConfirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
}); 