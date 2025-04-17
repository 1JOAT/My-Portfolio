import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../utils/GradientWrapper';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string, newStatus: 'Todo' | 'Done') => void;
  onDelete: (id: string) => void;
}

export const TaskCard = ({ task, onToggleStatus, onDelete }: TaskCardProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        task.status === 'Done' ? styles.completedTask : {}
      ]}
      onPress={() => onToggleStatus(task.id, task.status === 'Todo' ? 'Done' : 'Todo')}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={task.status === 'Done' ? ['#1F2937', '#111827'] : ['#1F2937', '#1E293B']}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.statusIndicator}>
          <View 
            style={[
              styles.statusDot, 
              task.status === 'Done' ? styles.completedDot : styles.todoDot
            ]}
          />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={[
              styles.title,
              task.status === 'Done' ? styles.completedTitle : {}
            ]}>
              {task.title}
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(task.id)}
            >
              <Ionicons name="close" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.detailsRow}>
            <View style={[
              styles.statusBadge,
              task.status === 'Done' ? styles.completedBadge : styles.todoBadge
            ]}>
              <Ionicons 
                name={task.status === 'Done' ? "checkmark-circle" : "time"} 
                size={12} 
                color={task.status === 'Done' ? "#10B981" : "#FF6B6B"} 
                style={styles.badgeIcon}
              />
              <Text style={[
                styles.statusText,
                task.status === 'Done' ? styles.completedText : styles.todoText
              ]}>
                {task.status}
              </Text>
            </View>
            
            {task.dueDate && (
              <View style={styles.dueDateContainer}>
                <Ionicons name="calendar" size={12} color="#94A3B8" style={styles.dateIcon} />
                <Text style={styles.dueDate}>
                  {formatDate(task.dueDate)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  gradientContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  completedTask: {
    opacity: 0.8,
  },
  statusIndicator: {
    width: 8,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  todoDot: {
    backgroundColor: '#FF6B6B',
  },
  completedDot: {
    backgroundColor: '#10B981',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9FAFB',
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  todoBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
  },
  completedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  badgeIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  todoText: {
    color: '#FF6B6B',
  },
  completedText: {
    color: '#10B981',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 4,
  },
  dueDate: {
    color: '#94A3B8',
    fontSize: 12,
  },
}); 