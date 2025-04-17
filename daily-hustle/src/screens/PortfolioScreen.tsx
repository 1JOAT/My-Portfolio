import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Linking, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Project } from '../types';
import { LinearGradient } from '../utils/GradientWrapper';

// Sample projects
const SAMPLE_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with React, Node.js, and MongoDB. Features include product search, cart functionality, payment integration, and admin dashboard.',
    imageUrl: 'https://via.placeholder.com/300x200/2C3E50/FFFFFF?text=E-Commerce',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
    githubUrl: 'https://github.com/username/ecommerce',
    liveUrl: 'https://myecommerce.example.com',
    featured: true,
  },
  {
    id: '2',
    title: 'Social Media App',
    description: 'A React Native social media app with real-time chat, post creation, and user authentication. Utilizes Firebase for backend services.',
    imageUrl: 'https://via.placeholder.com/300x200/3498DB/FFFFFF?text=Social+Media',
    technologies: ['React Native', 'Firebase', 'Redux', 'Expo'],
    githubUrl: 'https://github.com/username/social-app',
    featured: true,
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description: 'A responsive weather dashboard that fetches data from OpenWeather API. Shows current weather and 5-day forecast with beautiful visualizations.',
    imageUrl: 'https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=Weather+App',
    technologies: ['JavaScript', 'HTML/CSS', 'Chart.js', 'OpenWeather API'],
    liveUrl: 'https://weather.example.com',
    featured: false,
  },
  {
    id: '4',
    title: 'Task Management API',
    description: 'A RESTful API for task management built with Node.js and Express. Features include task CRUD operations, user authentication, and analytics.',
    imageUrl: 'https://via.placeholder.com/300x200/2C3E50/FFFFFF?text=API',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Jest'],
    githubUrl: 'https://github.com/username/task-api',
    featured: false,
  },
  {
    id: '5',
    title: 'Portfolio Website',
    description: 'Personal portfolio website showcasing projects and skills. Built with React and styled-components. Features smooth animations and responsive design.',
    imageUrl: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Portfolio',
    technologies: ['React', 'Styled Components', 'Framer Motion'],
    githubUrl: 'https://github.com/username/portfolio',
    liveUrl: 'https://myportfolio.example.com',
    featured: true,
  },
];

export const PortfolioScreen = () => {
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const filteredProjects = filter === 'all' 
    ? SAMPLE_PROJECTS 
    : SAMPLE_PROJECTS.filter(project => project.featured);

  return (
    <LinearGradient
      colors={['#121638', '#2C3E50']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Ionicons name="code-slash" size={30} color="#FF6B6B" />
        <Text style={styles.headerText}>My Projects</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>All Projects</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'featured' && styles.activeFilter]}
          onPress={() => setFilter('featured')}
        >
          <Text style={[styles.filterText, filter === 'featured' && styles.activeFilterText]}>Featured</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard project={item} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.projectList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open" size={50} color="#CBD5E1" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No projects found</Text>
          </View>
        }
      />
    </LinearGradient>
  );
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const handleOpenLink = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.projectCard}>
      <Image 
        source={{ uri: project.imageUrl }} 
        style={styles.projectImage}
        resizeMode="cover"
      />
      
      {project.featured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      )}
      
      <View style={styles.projectContent}>
        <Text style={styles.projectTitle}>{project.title}</Text>
        <Text style={styles.projectDescription}>{project.description}</Text>
        
        <View style={styles.techContainer}>
          {project.technologies.map((tech, index) => (
            <View key={index} style={styles.techBadge}>
              <Text style={styles.techText}>{tech}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          {project.githubUrl && (
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => handleOpenLink(project.githubUrl)}
            >
              <Ionicons name="logo-github" size={20} color="#FF6B6B" />
              <Text style={styles.linkButtonText}>GitHub</Text>
            </TouchableOpacity>
          )}
          
          {project.liveUrl && (
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => handleOpenLink(project.liveUrl)}
            >
              <Ionicons name="globe" size={20} color="#FF6B6B" />
              <Text style={styles.linkButtonText}>Live Demo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginLeft: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeFilter: {
    backgroundColor: '#FF6B6B',
  },
  filterText: {
    color: '#CBD5E1',
    fontWeight: '600',
  },
  activeFilterText: {
    color: 'white',
  },
  projectList: {
    paddingBottom: 20,
  },
  projectCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  projectImage: {
    width: '100%',
    height: 180,
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  featuredText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  projectContent: {
    padding: 16,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  projectDescription: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  techBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    margin: 3,
  },
  techText: {
    color: '#F9FAFB',
    fontSize: 12,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  linkButtonText: {
    color: '#FF6B6B',
    marginLeft: 6,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginTop: 20,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    color: '#CBD5E1',
    fontSize: 18,
    fontWeight: '600',
  },
}); 