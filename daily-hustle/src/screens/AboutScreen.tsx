import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

// Replace with your name
const DEVELOPER_NAME = 'Your Name';

export const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>About Daily Hustle</Text>
        
        <View style={styles.card}>
          <Text style={styles.title}>Developer</Text>
          <Text style={styles.description}>
            Built by {DEVELOPER_NAME}, a crazy dev mastering React Native, Node.js, TypeScript, MongoDB.
          </Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.title}>Skills</Text>
          
          <View style={styles.skillsContainer}>
            <Skill name="React Native" />
            <Skill name="TypeScript" />
            <Skill name="Node.js" />
            <Skill name="PHP" />
            <Skill name="MongoDB" />
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.title}>App Features</Text>
          <FeatureItem title="Task Management" description="Create, track, and complete your tasks." />
          <FeatureItem title="Real-time Chat" description="Communicate with your team in real-time." />
          <FeatureItem title="Push Notifications" description="Get alerts for due tasks and new messages." />
          <FeatureItem title="MongoDB Database" description="All data is persistently stored." />
        </View>
        
        <View style={styles.card}>
          <Text style={styles.title}>Tech Stack</Text>
          <FeatureItem title="Frontend" description="React Native with TypeScript" />
          <FeatureItem title="Styling" description="Custom styling with dark theme" />
          <FeatureItem title="Backend" description="Node.js with Express" />
          <FeatureItem title="Database" description="MongoDB Atlas" />
          <FeatureItem title="Real-time" description="Socket.IO for live updates" />
          <FeatureItem title="Notifications" description="Expo Notifications" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface SkillProps {
  name: string;
}

const Skill = ({ name }: SkillProps) => (
  <View style={styles.skillBadge}>
    <Text style={styles.skillText}>{name}</Text>
  </View>
);

interface FeatureItemProps {
  title: string;
  description: string;
}

const FeatureItem = ({ title, description }: FeatureItemProps) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22C55E',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  description: {
    color: '#D1D5DB',
    fontSize: 16,
    lineHeight: 24,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
  },
  skillText: {
    color: '#F9FAFB',
    fontWeight: 'bold',
    fontSize: 14,
  },
  featureItem: {
    marginBottom: 16,
  },
  featureTitle: {
    color: '#22C55E',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
  },
}); 