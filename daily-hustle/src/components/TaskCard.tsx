import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.detailsRow}>
          <View style={[
            styles.statusBadge,
            task.status === 'Done' ? styles.completedBadge : styles.todoBadge
          ]}>
            <Text style={styles.statusText}>{task.status}</Text>
          </View>
          
          {task.dueDate && (
            <Text style={styles.dueDate}>
              Due: {formatDate(task.dueDate)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedTask: {
    opacity: 0.7,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9FAFB',
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  todoBadge: {
    backgroundColor: '#4B5563',
  },
  completedBadge: {
    backgroundColor: '#065F46',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dueDate: {
    color: '#D1D5DB',
    fontSize: 12,
  },
}); 