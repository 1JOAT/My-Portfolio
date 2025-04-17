import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../utils/GradientWrapper';
import { Skill } from '../types';
import { sendTestNotification } from '../utils/notifications';

// Sample skills data
const SKILLS: Skill[] = [
  { name: 'React', level: 5, icon: 'logo-react', category: 'frontend' },
  { name: 'React Native', level: 4, icon: 'phone-portrait', category: 'mobile' },
  { name: 'TypeScript', level: 4, icon: 'code-slash', category: 'frontend' },
  { name: 'Node.js', level: 4, icon: 'server', category: 'backend' },
  { name: 'MongoDB', level: 3, icon: 'leaf', category: 'backend' },
  { name: 'GraphQL', level: 3, icon: 'trending-up', category: 'backend' },
  { name: 'UI/UX Design', level: 4, icon: 'color-palette', category: 'frontend' },
  { name: 'AWS', level: 3, icon: 'cloud', category: 'other' },
  { name: 'Git', level: 4, icon: 'git-branch', category: 'other' },
  { name: 'Redux', level: 4, icon: 'flash', category: 'frontend' },
  { name: 'Jest', level: 3, icon: 'flask', category: 'other' },
  { name: 'Firebase', level: 4, icon: 'flame', category: 'backend' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    color: '#CBD5E1',
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  badge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  badgeText: {
    color: '#22C55E',
    fontWeight: '600',
    fontSize: 12,
  },
  aboutSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  aboutText: {
    color: '#CBD5E1',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
  skillsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeCategory: {
    backgroundColor: '#FF6B6B',
  },
  categoryText: {
    color: '#CBD5E1',
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  skillIcon: {
    marginBottom: 8,
  },
  skillName: {
    color: 'white',
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
    backgroundColor: '#FF6B6B',
  },
  inactiveLevelDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionsSection: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2,
  },
  actionButtonGradient: {
    paddingVertical: 16,
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

export const HomeScreen = () => {
  const navigation = useNavigation();
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend' | 'mobile' | 'other'>('all');

  const filteredSkills = activeCategory === 'all' 
    ? SKILLS 
    : SKILLS.filter(skill => skill.category === activeCategory);

  const handleNotificationDemo = async () => {
    try {
      await sendTestNotification('Test Notification', 'This is a test notification from Daily Hustle');
      // No alert here - just let the notification appear
    } catch (error) {
      console.error('Error sending notification:', error);
    }
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
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.profileSection}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.avatarGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.avatarText}>JD</Text>
          </LinearGradient>
          
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.title}>Software Engineer & Developer</Text>
          
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Available for work</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.aboutSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={22} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>About Me</Text>
          </View>
          
          <Text style={styles.aboutText}>
            I'm a passionate software engineer with 5+ years of experience creating modern web and mobile applications. 
            I specialize in React Native, React, Node.js, and TypeScript. My mission is to build clean, 
            performant, and user-friendly applications that solve real-world problems.
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5+</Text>
              <Text style={styles.statLabel}>Years Experience</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>30+</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15+</Text>
              <Text style={styles.statLabel}>Clients</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.skillsSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="code-slash" size={22} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>Skills</Text>
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
                activeCategory === 'all' && styles.activeCategory
              ]}
              onPress={() => setActiveCategory('all')}
            >
              <Text 
                style={[
                  styles.categoryText,
                  activeCategory === 'all' && styles.activeCategoryText
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryButton,
                activeCategory === 'frontend' && styles.activeCategory
              ]}
              onPress={() => setActiveCategory('frontend')}
            >
              <Text 
                style={[
                  styles.categoryText,
                  activeCategory === 'frontend' && styles.activeCategoryText
                ]}
              >
                Frontend
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryButton,
                activeCategory === 'backend' && styles.activeCategory
              ]}
              onPress={() => setActiveCategory('backend')}
            >
              <Text 
                style={[
                  styles.categoryText,
                  activeCategory === 'backend' && styles.activeCategoryText
                ]}
              >
                Backend
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryButton,
                activeCategory === 'mobile' && styles.activeCategory
              ]}
              onPress={() => setActiveCategory('mobile')}
            >
              <Text 
                style={[
                  styles.categoryText,
                  activeCategory === 'mobile' && styles.activeCategoryText
                ]}
              >
                Mobile
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryButton,
                activeCategory === 'other' && styles.activeCategory
              ]}
              onPress={() => setActiveCategory('other')}
            >
              <Text 
                style={[
                  styles.categoryText,
                  activeCategory === 'other' && styles.activeCategoryText
                ]}
              >
                Other
              </Text>
            </TouchableOpacity>
          </ScrollView>
          
          <View style={styles.skillsGrid}>
            {filteredSkills.map((skill, index) => (
              <SkillCard key={index} skill={skill} />
            ))}
          </View>
        </View>
        
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Portfolio' as never)}
          >
            <LinearGradient
              colors={['#3498DB', '#2980B9']}
              style={styles.actionButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="folder-open" size={20} color="white" />
              <Text style={styles.actionButtonText}>View Portfolio</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Contact' as never)}
          >
            <LinearGradient
              colors={['#9B59B6', '#8E44AD']}
              style={styles.actionButtonGradient}
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
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.actionButtonGradient}
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

interface SkillCardProps {
  skill: Skill;
}

const SkillCard = ({ skill }: SkillCardProps) => {
  return (
    <View style={styles.skillCard}>
      <Ionicons name={skill.icon as any} size={24} color="#FF6B6B" style={styles.skillIcon} />
      <Text style={styles.skillName}>{skill.name}</Text>
      <View style={styles.levelContainer}>
        {[...Array(5)].map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.levelDot,
              i < skill.level ? styles.activeLevelDot : styles.inactiveLevelDot
            ]} 
          />
        ))}
      </View>
    </View>
  );
};