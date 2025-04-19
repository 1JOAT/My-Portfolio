import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../utils/GradientWrapper';
import { Skill } from '../types';
import { sendTestNotification } from '../utils/notifications';
import { useTheme } from '../utils/ThemeContext';

// Sample skills data
const SKILLS: Skill[] = [
  { name: 'HTML', level: 5, icon: 'code-slash', category: 'frontend' },
  { name: 'CSS', level: 5, icon: 'color-palette', category: 'frontend' },
  { name: 'JavaScript', level: 5, icon: 'logo-javascript', category: 'frontend' },
  { name: 'React', level: 4, icon: 'logo-react', category: 'frontend' },
  { name: 'React Native', level: 4, icon: 'phone-portrait', category: 'mobile' },
  { name: 'Node.js', level: 4, icon: 'server', category: 'backend' },
  { name: 'Express', level: 5, icon: 'flash', category: 'backend' },
  { name: 'SCSS', level: 4, icon: 'color-filter', category: 'frontend' },
  { name: 'TypeScript', level: 4, icon: 'code-slash', category: 'frontend' },
  { name: 'Bootstrap', level: 4, icon: 'grid', category: 'frontend' },
  { name: 'Material UI', level: 4, icon: 'albums', category: 'frontend' },
  { name: 'Claude', level: 5, icon: 'diamond-outline', category: 'other' },
  { name: 'Cursor', level: 5, icon: 'code', category: 'other' },
  { name: 'Tailwind CSS', level: 4, icon: 'color-wand', category: 'frontend' },
  { name: 'Git', level: 4, icon: 'git-branch', category: 'other' },
  { name: 'GitHub', level: 4, icon: 'logo-github', category: 'other' },
  { name: 'PHP', level: 3, icon: 'code', category: 'backend' },
  { name: 'Laravel', level: 3, icon: 'layers', category: 'backend' },
  { name: 'Redis', level: 3, icon: 'cube', category: 'database' },
  { name: 'MySQL', level: 4, icon: 'server', category: 'database' },
  { name: 'PostgreSQL', level: 4, icon: 'server', category: 'database' },
  { name: 'MongoDB', level: 5, icon: 'leaf', category: 'database' },
  { name: 'Supabase', level: 5, icon: 'cube', category: 'database' },
  { name: 'Socket.IO', level: 5, icon: 'flash', category: 'backend' },
  { name: 'AWS', level: 3, icon: 'cloud', category: 'other' },

  { name: 'Redux', level: 4, icon: 'flash', category: 'frontend' },
];

// SkillCard component
const SkillCard = ({ skill }: { skill: Skill }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.skillCard, { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }]}>
      <Ionicons name={skill.icon as any} size={24} color={theme.colors.primary} style={styles.skillIcon} />
      <Text style={[styles.skillName, { color: theme.colors.text }]}>{skill.name}</Text>
      <View style={styles.levelContainer}>
        {[1, 2, 3, 4, 5].map((level) => (
          <View 
            key={level}
            style={[
              styles.levelDot,
              level <= skill.level ? 
                [styles.activeLevelDot, { backgroundColor: theme.colors.primary }] : 
                [styles.inactiveLevelDot, { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)' }]
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme, settings } = useTheme();
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend' | 'database' | 'mobile' | 'other'>('all');

  const filteredSkills = activeCategory === 'all' 
    ? SKILLS 
    : SKILLS.filter(skill => skill.category === activeCategory);

  const handleNotificationDemo = async () => {
    try {
      await sendTestNotification('Test Notifications', 'This is a test notification from the Home screen!');
      Alert.alert('Success', 'Test notification sent! Check your notification panel.');
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  // Calculate spacing based on compact mode
  const getSpacing = (size: number) => {
    return settings.compactMode ? size * 0.8 : size;
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
        contentContainerStyle={[
          styles.contentContainer, 
          { padding: getSpacing(16) }
        ]}
      >
        <View style={[styles.profileSection, { marginBottom: getSpacing(24) }]}>
          <LinearGradient
            colors={[theme.colors.primary, theme.dark ? '#993D3D' : '#FF8F8F']}
            style={styles.avatarGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.avatarText}>PO</Text>
          </LinearGradient>
          
          <Text style={[styles.name, { color: theme.colors.text }]}>Praise Oke</Text>
          <Text style={[styles.title, { color: theme.colors.subtext }]}>Software Developer</Text>
          
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.badgeText}>Available for work</Text>
            </View>
          </View>
        </View>
        
        <View style={[
          styles.statsContainer, 
          { 
            backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            marginBottom: getSpacing(24),
            padding: getSpacing(16)
          }
        ]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>3+</Text>
            <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>Years Exp.</Text>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)' }]} />
          
            <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>12+</Text>
            <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>Projects</Text>
            </View>
            
          <View style={[styles.statDivider, { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)' }]} />
            
            <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>5+</Text>
            <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>Clients</Text>
          </View>
        </View>
        
        <View style={[
          styles.skillsSection, 
          { 
            backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
            marginBottom: getSpacing(24),
            padding: getSpacing(16)
          }
        ]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="code-slash" size={22} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Skills</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContainer}
          >
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
                activeCategory === 'all' && [styles.activeCategory, { backgroundColor: theme.colors.primary }]
              ]}
              onPress={() => setActiveCategory('all')}
            >
              <Text 
                style={[
                  styles.categoryText,
                  { color: theme.colors.subtext },
                  activeCategory === 'all' && styles.activeCategoryText
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
                activeCategory === 'frontend' && [styles.activeCategory, { backgroundColor: theme.colors.primary }]
              ]}
              onPress={() => setActiveCategory('frontend')}
            >
              <Text 
                style={[
                  styles.categoryText,
                  { color: theme.colors.subtext },
                  activeCategory === 'frontend' && styles.activeCategoryText
                ]}
              >
                Frontend
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
                activeCategory === 'backend' && [styles.activeCategory, { backgroundColor: theme.colors.primary }]
              ]}
              onPress={() => setActiveCategory('backend')}
            >
              <Text 
                style={[
                  styles.categoryText,
                  { color: theme.colors.subtext },
                  activeCategory === 'backend' && styles.activeCategoryText
                ]}
              >
                Backend
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryButton,
                { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
                activeCategory === 'database' && [styles.activeCategory, { backgroundColor: theme.colors.primary }]
              ]}
              onPress={() => setActiveCategory('database')}
            >
              <Text 
                style={[
                  styles.categoryText,
                  { color: theme.colors.subtext },
                  activeCategory === 'database' && styles.activeCategoryText
                ]}
              >
                Database
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
                activeCategory === 'mobile' && [styles.activeCategory, { backgroundColor: theme.colors.primary }]
              ]}
              onPress={() => setActiveCategory('mobile')}
            >
              <Text 
                style={[
                  styles.categoryText,
                  { color: theme.colors.subtext },
                  activeCategory === 'mobile' && styles.activeCategoryText
                ]}
              >
                Mobile
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
                activeCategory === 'other' && [styles.activeCategory, { backgroundColor: theme.colors.primary }]
              ]}
              onPress={() => setActiveCategory('other')}
            >
              <Text 
                style={[
                  styles.categoryText,
                  { color: theme.colors.subtext },
                  activeCategory === 'other' && styles.activeCategoryText
                ]}
              >
                Other
              </Text>
            </TouchableOpacity>
          </ScrollView>
          
          <View style={[styles.skillsGrid, { gap: getSpacing(8) }]}>
            {filteredSkills.map((skill, index) => (
              <SkillCard key={index} skill={skill} />
            ))}
          </View>
        </View>
        
        <View style={[styles.actionsSection, { gap: getSpacing(12) }]}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Contact' as never)}
          >
            <LinearGradient
              colors={[theme.colors.secondary, theme.dark ? '#3B357A' : '#6C63FF']}
              style={[styles.actionButtonGradient, { paddingVertical: getSpacing(16) }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="mail" size={20} color="white" />
              <Text style={styles.actionButtonText}>Contact Me</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleNotificationDemo}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.dark ? '#993D3D' : '#FF8F8F']}
              style={[styles.actionButtonGradient, { paddingVertical: getSpacing(16) }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="notifications" size={20} color="white" />
              <Text style={styles.actionButtonText}>Test Notification</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  contentContainer: {
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    marginHorizontal: 10,
  },
  skillsSection: {
    borderRadius: 12,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryContainer: {
    paddingBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategory: {
  },
  categoryText: {
    fontWeight: '600',
    fontSize: 14,
  },
  activeCategoryText: {
    color: 'white',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skillCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  skillIcon: {
    marginBottom: 8,
  },
  skillName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  activeLevelDot: {
  },
  inactiveLevelDot: {
  },
  actionsSection: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});