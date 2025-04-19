import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../utils/GradientWrapper';

// Replace with your name
const DEVELOPER_NAME = 'John Doe';

export const AboutScreen = () => {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <LinearGradient
      colors={['#212B40', '#0F172A']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      <StatusBar style="light" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="information-circle" size={30} color="#FF6B6B" />
          <Text style={styles.headerText}>About Me</Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={22} color="#FF6B6B" />
            <Text style={styles.title}>Who I Am</Text>
          </View>
          
          <Text style={styles.description}>
            I'm Praise Oke, a passionate software engineer with a focus on creating elegant, 
            efficient, and user-friendly applications. I specialize in web and mobile development,
            creating solutions that combine technical excellence with great user experience.
          </Text>
          
          <Text style={styles.description}>
            I believe in writing clean, maintainable code and staying up-to-date with 
            the latest technologies and best practices in software development. 
            My approach combines technical excellence with a deep understanding of user needs.
          </Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school" size={22} color="#FF6B6B" />
            <Text style={styles.title}>Education</Text>
          </View>
          
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineDate}>2018 - 2022</Text>
              <Text style={styles.timelineTitle}>BSc in Computer Science</Text>
              <Text style={styles.timelineSubtitle}>University of Lagos</Text>
            </View>
          </View>
          
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineDate}>2016 - 2018</Text>
              <Text style={styles.timelineTitle}>Software Development Bootcamp</Text>
              <Text style={styles.timelineSubtitle}>Tech Institute</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase" size={22} color="#FF6B6B" />
            <Text style={styles.title}>Work Experience</Text>
          </View>
          
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineDate}>2022 - Present</Text>
              <Text style={styles.timelineTitle}>Frontend Developer</Text>
              <Text style={styles.timelineSubtitle}>TechSolutions Ltd.</Text>
              <Text style={styles.timelineDescription}>
                Building responsive web applications with React and TypeScript.
                Working with RESTful APIs and state management solutions.
                Implementing modern UI/UX designs with CSS frameworks.
              </Text>
            </View>
          </View>
          
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineDate}>2020 - 2022</Text>
              <Text style={styles.timelineTitle}>Junior Web Developer</Text>
              <Text style={styles.timelineSubtitle}>Digital Creatives</Text>
              <Text style={styles.timelineDescription}>
                Developed front-end interfaces using HTML, CSS, and JavaScript.
                Collaborated with design teams to implement responsive web designs.
                Assisted with backend development using Node.js and Express.
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart" size={22} color="#FF6B6B" />
            <Text style={styles.title}>Interests</Text>
          </View>
          
          <View style={styles.interestsContainer}>
            <View style={styles.interest}>
              <Ionicons name="code" size={24} color="#FF6B6B" />
              <Text style={styles.interestText}>Open Source</Text>
            </View>
            
            <View style={styles.interest}>
              <Ionicons name="book" size={24} color="#FF6B6B" />
              <Text style={styles.interestText}>Reading</Text>
            </View>
            
            <View style={styles.interest}>
              <Ionicons name="bicycle" size={24} color="#FF6B6B" />
              <Text style={styles.interestText}>Cycling</Text>
            </View>
            
            <View style={styles.interest}>
              <Ionicons name="globe" size={24} color="#FF6B6B" />
              <Text style={styles.interestText}>Travel</Text>
            </View>
            
            <View style={styles.interest}>
              <Ionicons name="game-controller" size={24} color="#FF6B6B" />
              <Text style={styles.interestText}>Gaming</Text>
            </View>
            
            <View style={styles.interest}>
              <Ionicons name="camera" size={24} color="#FF6B6B" />
              <Text style={styles.interestText}>Photography</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="code-slash" size={22} color="#FF6B6B" />
            <Text style={styles.title}>Tech Stack</Text>
          </View>
          
          <View style={styles.stackContainer}>
            <View style={styles.stackGroup}>
              <Text style={styles.stackTitle}>Frontend</Text>
              <View style={styles.stackItems}>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>HTML</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>CSS</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>JavaScript</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>TypeScript</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>React</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>React Native</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>Redux</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>SCSS</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>Bootstrap</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>Material UI</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>Tailwind CSS</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.stackGroup}>
              <Text style={styles.stackTitle}>Backend</Text>
              <View style={styles.stackItems}>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>Node.js</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>Express</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>PHP</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>Laravel</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>Socket.IO</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.stackGroup}>
              <Text style={styles.stackTitle}>Database</Text>
              <View style={styles.stackItems}>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>MongoDB</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>MySQL</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>PostgreSQL</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>Redis</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>Supabase</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.stackGroup}>
              <Text style={styles.stackTitle}>Tools & Other</Text>
              <View style={styles.stackItems}>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>Git</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>GitHub</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>Cursor</Text>
                </View>
                <View style={styles.stackItem}>
                  <Text style={styles.stackItemText}>Claude</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="link" size={22} color="#FF6B6B" />
            <Text style={styles.title}>Connect With Me</Text>
          </View>
          
          <View style={styles.connectContainer}>
            <TouchableOpacity 
              style={styles.connectButton}
              onPress={() => openLink('https://github.com/1JOAT')}
            >
              <LinearGradient
                colors={['#333333', '#111111']}
                style={styles.connectGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <Ionicons name="logo-github" size={20} color="#FFFFFF" />
                <Text style={styles.connectText}>GitHub</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.connectButton}
              onPress={() => openLink('https://x.com/1JOAT')}
            >
              <LinearGradient
                colors={['#1DA1F2', '#0D8ECF']}
                style={styles.connectGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <Ionicons name="logo-twitter" size={20} color="#FFFFFF" />
                <Text style={styles.connectText}>Twitter</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.connectButton}
              onPress={() => Linking.openURL('mailto:praiseoke215@gmail.com')}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53']}
                style={styles.connectGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <Ionicons name="mail" size={20} color="#FFFFFF" />
                <Text style={styles.connectText}>Email</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.connectButton}
              onPress={() => Linking.openURL('tel:+2348125556472')}
            >
              <LinearGradient
                colors={['#4CAF50', '#388E3C']}
                style={styles.connectGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <Ionicons name="call" size={20} color="#FFFFFF" />
                <Text style={styles.connectText}>Call</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2023 Praise Oke</Text>
          <Text style={styles.footerSubText}>Built with React Native</Text>
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginLeft: 10,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginLeft: 8,
  },
  description: {
    color: '#D1D5DB',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
    marginRight: 12,
    marginTop: 5,
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timelineTitle: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  timelineSubtitle: {
    color: '#CBD5E1',
    fontSize: 14,
    marginBottom: 4,
  },
  timelineDescription: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  interest: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  interestText: {
    color: '#F9FAFB',
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  stackContainer: {
    marginBottom: 8,
  },
  stackGroup: {
    marginBottom: 16,
  },
  stackTitle: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stackItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stackItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
  },
  stackItemText: {
    color: '#F9FAFB',
    fontWeight: '500',
    fontSize: 14,
  },
  connectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  connectButton: {
    width: '48%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  connectGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  connectText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  footerText: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerSubText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
}); 