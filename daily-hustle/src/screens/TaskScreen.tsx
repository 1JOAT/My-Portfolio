import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task } from '../types';
import { fetchTasks, addTask, updateTaskStatus, deleteTask } from '../api/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { TaskCard } from '../components/TaskCard';
import { checkTasksForNotifications } from '../utils/notifications';

export const TaskScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTasks();
    
    // Check for due tasks every minute for notifications
    const intervalId = setInterval(() => {
      checkTasksForNotifications(tasks);
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [tasks]);

  const loadTasks = async () => {
    setLoading(true);
    const fetchedTasks = await fetchTasks();
    setTasks(fetchedTasks);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const dueDate = newTaskDueDate ? newTaskDueDate.toISOString() : '';
    
    setLoading(true);
    const result = await addTask({
      title: newTaskTitle,
      dueDate,
      userId: 'dev1',
    });
    
    if (result) {
      setTasks([...tasks, result]);
      setNewTaskTitle('');
      setNewTaskDueDate(null);
    } else {
      Alert.alert('Error', 'Failed to add task');
    }
    setLoading(false);
  };

  const handleToggleStatus = async (id: string, newStatus: 'Todo' | 'Done') => {
    setLoading(true);
    const result = await updateTaskStatus(id, newStatus);
    
    if (result) {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, status: newStatus } : task
      ));
    } else {
      Alert.alert('Error', 'Failed to update task status');
    }
    setLoading(false);
  };

  const handleDeleteTask = async (id: string) => {
    setLoading(true);
    const success = await deleteTask(id);
    
    if (success) {
      setTasks(tasks.filter(task => task.id !== id));
    } else {
      Alert.alert('Error', 'Failed to delete task');
    }
    setLoading(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewTaskDueDate(selectedDate);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'No due date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      
      <View style={styles.container}>
        <Text style={styles.header}>Task Manager</Text>
        
        <View style={styles.inputContainer}>
          <Input
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            placeholder="Enter new task..."
          />
          
          <View style={styles.datePickerRow}>
            <Text style={styles.dueDateText}>
              Due Date: {newTaskDueDate ? formatDate(newTaskDueDate) : 'None'}
            </Text>
            <Button
              title="Set Date"
              onPress={() => setShowDatePicker(true)}
              type="secondary"
              style={styles.dateButton}
            />
          </View>
          
          {showDatePicker && (
            <DateTimePicker
              value={newTaskDueDate || new Date()}
              mode="datetime"
              display="default"
              onChange={handleDateChange}
            />
          )}
          
          <Button
            title="Add Task"
            onPress={handleAddTask}
            loading={loading}
            style={styles.addButton}
          />
        </View>
        
        <View style={styles.taskListContainer}>
          <Text style={styles.sectionTitle}>Your Tasks</Text>
          
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#22C55E" style={styles.loader} />
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TaskCard
                  task={item}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteTask}
                />
              )}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              style={styles.taskList}
              contentContainerStyle={styles.taskListContent}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No tasks yet. Add some above!
                </Text>
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22C55E',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dueDateText: {
    color: '#F9FAFB',
    fontSize: 16,
  },
  dateButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addButton: {
    width: '100%',
  },
  taskListContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  loader: {
    marginTop: 32,
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    paddingBottom: 16,
  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
}); 