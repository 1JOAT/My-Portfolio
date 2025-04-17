import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../utils/GradientWrapper';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { sendTestNotification } from '../utils/notifications';

export const ContactScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    // Simulate sending a message
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Message Sent!',
        'Thank you for your message. I will get back to you soon.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              setName('');
              setEmail('');
              setMessage('');
            }
          }
        ]
      );
    }, 1500);
  };

  const handleSocialLink = (platform: string) => {
    let url = '';
    
    switch (platform) {
      case 'github':
        url = 'https://github.com/yourusername';
        break;
      case 'linkedin':
        url = 'https://linkedin.com/in/yourusername';
        break;
      case 'twitter':
        url = 'https://twitter.com/yourusername';
        break;
      case 'instagram':
        url = 'https://instagram.com/yourusername';
        break;
    }
    
    if (url) {
      Linking.openURL(url);
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification('Test Notification', 'This is a test notification from the Contact screen!');
      Alert.alert('Notification Sent!', 'Check your notification panel to see the test message.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:your.email@example.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+1234567890');
  };

  return (
    <LinearGradient
      colors={['#121638', '#2C3E50']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="light" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Ionicons name="mail" size={30} color="#FF6B6B" />
          <Text style={styles.headerText}>Get In Touch</Text>
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => handleSocialLink('github')}
          >
            <Ionicons name="logo-github" size={28} color="#F9FAFB" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => handleSocialLink('linkedin')}
          >
            <Ionicons name="logo-linkedin" size={28} color="#F9FAFB" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => handleSocialLink('twitter')}
          >
            <Ionicons name="logo-twitter" size={28} color="#F9FAFB" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => handleSocialLink('instagram')}
          >
            <Ionicons name="logo-instagram" size={28} color="#F9FAFB" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.contactInfoContainer}>
          <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
            <Ionicons name="mail" size={22} color="#FF6B6B" style={styles.contactIcon} />
            <Text style={styles.contactText}>your.email@example.com</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
            <Ionicons name="call" size={22} color="#FF6B6B" style={styles.contactIcon} />
            <Text style={styles.contactText}>+1 (234) 567-890</Text>
          </TouchableOpacity>
          
          <View style={styles.contactItem}>
            <Ionicons name="location" size={22} color="#FF6B6B" style={styles.contactIcon} />
            <Text style={styles.contactText}>New York, NY, USA</Text>
          </View>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Send a Message</Text>
          
          <View style={styles.inputWithIcon}>
            <Ionicons name="person" size={20} color="#94A3B8" style={styles.inputIcon} />
            <Input
              label="Your Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              containerStyle={styles.input}
            />
          </View>
          
          <View style={styles.inputWithIcon}>
            <Ionicons name="mail" size={20} color="#94A3B8" style={styles.inputIcon} />
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              containerStyle={styles.input}
            />
          </View>
          
          <View style={styles.inputWithIcon}>
            <Ionicons name="chatbubble" size={20} color="#94A3B8" style={styles.inputIcon} />
            <Input
              label="Message"
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message here"
              multiline
              numberOfLines={5}
              containerStyle={styles.textArea}
              inputStyle={styles.textAreaInput}
            />
          </View>
          
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.submitButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Button
              title="Send Message"
              onPress={handleSendMessage}
              loading={loading}
              style={styles.submitButton}
              textStyle={styles.submitButtonText}
            />
          </LinearGradient>
        </View>
        
        <View style={styles.notificationDemo}>
          <Text style={styles.demoTitle}>Try Notification Demo</Text>
          <Text style={styles.demoText}>
            Click the button below to send a test notification to your device.
          </Text>
          <View style={styles.demoButtonWrapper}>
            <Ionicons name="notifications" size={20} color="#FF6B6B" style={styles.demoButtonIcon} />
            <Button
              title="Send Test Notification"
              onPress={handleTestNotification}
              type="secondary"
              style={styles.demoButton}
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginLeft: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  contactInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  contactIcon: {
    marginRight: 12,
  },
  contactText: {
    color: '#F9FAFB',
    fontSize: 16,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  inputIcon: {
    marginTop: 38,
    marginRight: 10,
  },
  input: {
    flex: 1,
    marginBottom: 16,
  },
  textArea: {
    flex: 1,
    marginBottom: 20,
  },
  textAreaInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButtonGradient: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  submitButton: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  submitButtonText: {
    fontWeight: 'bold',
  },
  notificationDemo: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  demoText: {
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 16,
  },
  demoButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  demoButtonIcon: {
    marginRight: 10,
  },
  demoButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
}); 