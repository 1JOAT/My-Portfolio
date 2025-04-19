import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../utils/GradientWrapper';
import { useTheme } from '../utils/ThemeContext';

export const ContactScreen = () => {
  const { theme, settings } = useTheme();

  // Calculate spacing based on compact mode
  const getSpacing = (size: number) => {
    return settings.compactMode ? size * 0.8 : size;
  };

  const handleSocialLink = (platform: string) => {
    let url = '';
    
    switch (platform) {
      case 'github':
        url = 'https://github.com/1JOAT';
        break;
      case 'twitter':
        url = 'https://x.com/1J0AT';
        break;
      case 'linkedin':
        url = 'https://www.linkedin.com/in/praise-oke-673a7823a/';
        break;
      case 'instagram':
        url = 'https://instagram.com/uniquejoat';
        break;
    }
    
    if (url) {
      Linking.openURL(url);
    }
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:praiseoke215@gmail.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+2348125556472');
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.card]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style={theme.dark ? "light" : "dark"} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { padding: getSpacing(16) }]}
      >
        <View style={styles.header}>
          <Ionicons name="person-circle" size={32} color={theme.colors.primary} />
          <Text style={[styles.headerText, { color: theme.colors.primary }]}>Contact Me</Text>
        </View>

        {/* Profile Section */}
        <View style={[
          styles.profileContainer, 
          { 
            backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
            shadowColor: theme.colors.shadow,
            borderColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        ]}>
          <View style={styles.profileHeader}>
            <View style={[styles.profileAvatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.profileInitials}>PO</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.colors.text }]}>Praise Oke</Text>
              <Text style={[styles.profileTitle, { color: theme.colors.subtext }]}>Software Developer</Text>
            </View>
          </View>
          
          <View style={[styles.profileDivider, { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]} />
          
          <Text style={[styles.profileBio, { color: theme.colors.text }]}>
            Passionate Software developer. Creating beautiful, functional apps and websites for startups and enterprise clients.
          </Text>
        </View>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: getSpacing(24) }]}>Connect With Me</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity 
            style={[
              styles.socialButton, 
              { 
                backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                shadowColor: theme.colors.shadow
              }
            ]}
            onPress={() => handleSocialLink('github')}
          >
            <Ionicons name="logo-github" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.socialButton, 
              { 
                backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                shadowColor: theme.colors.shadow
              }
            ]}
            onPress={() => handleSocialLink('linkedin')}
          >
            <Ionicons name="logo-linkedin" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.socialButton, 
              { 
                backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                shadowColor: theme.colors.shadow
              }
            ]}
            onPress={() => handleSocialLink('twitter')}
          >
            <Ionicons name="logo-twitter" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.socialButton, 
              { 
                backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                shadowColor: theme.colors.shadow
              }
            ]}
            onPress={() => handleSocialLink('instagram')}
          >
            <Ionicons name="logo-instagram" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: getSpacing(16) }]}>Contact Details</Text>
        
        <View style={[
          styles.contactInfoContainer, 
          { 
            backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
            shadowColor: theme.colors.shadow,
            borderColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        ]}>
          <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
            <View style={[styles.contactIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="mail" size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={[styles.contactLabel, { color: theme.colors.subtext }]}>Email</Text>
              <Text style={[styles.contactText, { color: theme.colors.text }]}>praiseoke215@gmail.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
          
          <View style={[styles.itemDivider, { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]} />
          
          <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
            <View style={[styles.contactIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="call" size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={[styles.contactLabel, { color: theme.colors.subtext }]}>Phone</Text>
              <Text style={[styles.contactText, { color: theme.colors.text }]}>+234 8125556472</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
          
          <View style={[styles.itemDivider, { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]} />
          
          <TouchableOpacity style={styles.contactItem} onPress={() => handleSocialLink('github')}>
            <View style={[styles.contactIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="logo-github" size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={[styles.contactLabel, { color: theme.colors.subtext }]}>GitHub</Text>
              <Text style={[styles.contactText, { color: theme.colors.text }]}>@1JOAT</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
          
          <View style={[styles.itemDivider, { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]} />

          <TouchableOpacity style={styles.contactItem} onPress={() => handleSocialLink('linkedin')}>
            <View style={[styles.contactIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="logo-linkedin" size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={[styles.contactLabel, { color: theme.colors.subtext }]}>LinkedIn</Text>
              <Text style={[styles.contactText, { color: theme.colors.text }]}>Praise Oke</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>

          <View style={[styles.itemDivider, { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]} />


          
          <TouchableOpacity style={styles.contactItem} onPress={() => handleSocialLink('twitter')}>
            <View style={[styles.contactIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="logo-twitter" size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={[styles.contactLabel, { color: theme.colors.subtext }]}>Twitter</Text>
              <Text style={[styles.contactText, { color: theme.colors.text }]}>@1J0AT</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>

        </View>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: getSpacing(16) }]}>Location</Text>
        
        <View style={[
          styles.locationContainer, 
          { 
            backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
            shadowColor: theme.colors.shadow,
            borderColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        ]}>
          <View style={styles.locationHeader}>
            <Ionicons name="location" size={24} color={theme.colors.primary} style={styles.locationIcon} />
            <Text style={[styles.locationText, { color: theme.colors.text }]}>Nigeria</Text>
          </View>
          <Text style={[styles.locationDetails, { color: theme.colors.subtext }]}>Available for remote work worldwide</Text>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  profileContainer: {
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileTitle: {
    fontSize: 14,
    marginTop: 4,
  },
  profileDivider: {
    height: 1,
    marginVertical: 16,
  },
  profileBio: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactInfoContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
  },
  contactText: {
    fontSize: 16,
    marginTop: 2,
  },
  itemDivider: {
    height: 1,
    width: '100%',
  },
  locationContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    marginRight: 10,
  },
  locationText: {
    fontSize: 17,
    fontWeight: '600',
  },
  locationDetails: {
    fontSize: 14,
    marginTop: 6,
    marginLeft: 34,
  },
}); 