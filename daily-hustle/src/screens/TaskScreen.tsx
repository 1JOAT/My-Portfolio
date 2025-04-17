import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types';
import { fetchTasks, addTask, updateTaskStatus, deleteTask } from '../api/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { TaskCard } from '../components/TaskCard';
import { checkTasksForNotifications } from '../utils/notifications';
import { LinearGradient } from '../utils/GradientWrapper';

// Sample tasks for immediate display
const SAMPLE_TASKS: Task[] = [
  { 
    id: '1', 
    title: 'Complete Daily Hustle app', 
    status: 'Todo', 
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), 
    userId: 'dev1' 
  },
  { 
    id: '2', 
    title: 'Fix styling issues', 
    status: 'Done', 
    dueDate: '', 
    userId: 'dev1' 
  },
  { 
    id: '3', 
    title: 'Add sample data', 
    status: 'Todo', 
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), 
    userId: 'dev1' 
  },
  { 
    id: '4', 
    title: 'Test app functionality', 
    status: 'Todo', 
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), 
    userId: 'dev1' 
  },
  { 
    id: '5', 
    title: 'Deploy app to Expo', 
    status: 'Todo', 
    dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), 
    userId: 'dev1' 
  },
];

export const TaskScreen = () => {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fixed infinite loading by removing tasks from dependency array
  useEffect(() => {
    loadTasks();
    
    // Check for due tasks every minute for notifications
    const intervalId = setInterval(() => {
      checkTasksForNotifications(tasks);
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []); // Removed tasks dependency to prevent infinite reloading

  const loadTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await fetchTasks();
      if (fetchedTasks && fetchedTasks.length > 0) {
        setTasks(fetchedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Keep using sample data if API fails
    } finally {
      setLoading(false);
    }
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
    try {
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
        // If API fails, add a local task with random ID
        const localTask: Task = {
          id: `local_${Date.now()}`,
          title: newTaskTitle,
          dueDate,
          status: 'Todo',
          userId: 'dev1',
        };
        setTasks([...tasks, localTask]);
        setNewTaskTitle('');
        setNewTaskDueDate(null);
      }
    } catch (error) {
      // Handle error case
      Alert.alert('Error', 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, newStatus: 'Todo' | 'Done') => {
    setLoading(true);
    try {
      const result = await updateTaskStatus(id, newStatus);
      
      if (result) {
        setTasks(tasks.map(task => 
          task.id === id ? { ...task, status: newStatus } : task
        ));
      } else {
        // Handle local update if API fails
        setTasks(tasks.map(task => 
          task.id === id ? { ...task, status: newStatus } : task
        ));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update task status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setLoading(true);
    try {
      const success = await deleteTask(id);
      
      if (success || id.startsWith('local_')) {
        setTasks(tasks.filter(task => task.id !== id));
      } else {
        Alert.alert('Error', 'Failed to delete task');
      }
    } catch (error) {
      // Handle local delete if API fails
      setTasks(tasks.filter(task => task.id !== id));
    } finally {
      setLoading(false);
    }
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
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#1E293B', '#0F172A']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar style="light" />
        
        <View style={styles.header}>
          <Ionicons name="checkmark-done-circle" size={30} color="#FF6B6B" />
          <Text style={styles.headerText}>Task Manager</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Create New Task</Text>
          <Input
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            placeholder="What do you need to hustle on?"
            containerStyle={styles.titleInput}
          />
          
          <View style={styles.datePickerRow}>
            <View style={styles.dateTextContainer}>
              <Ionicons name="calendar" size={18} color="#CBD5E1" style={styles.dateIcon} />
              <Text style={styles.dueDateText}>
                {newTaskDueDate ? formatDate(newTaskDueDate) : 'No due date'}
              </Text>
            </View>
            <Button
              title="Set Due Date"
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
          
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={[styles.addButtonGradient, { borderRadius: 8 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Button
              title="Add Task"
              onPress={handleAddTask}
              loading={loading}
              style={styles.addButton}
              textStyle={styles.addButtonText}
            />
          </LinearGradient>
        </View>
        
        <View style={styles.taskListContainer}>
          <View style={styles.listHeader}>
            <Ionicons name="list" size={22} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>Your Tasks</Text>
          </View>
          
          {loading && !refreshing ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#FF6B6B" style={styles.loader} />
              <Text style={styles.loaderText}>Loading your tasks...</Text>
            </View>
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
                <View style={styles.emptyContainer}>
                  <Ionicons name="checkbox-outline" size={50} color="#374151" />
                  <Text style={styles.emptyText}>
                    Your task list is empty
                  </Text>
                  <Text style={styles.emptySubText}>
                    Add your first task to start hustling!
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

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
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  titleInput: {
    marginBottom: 16,
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 10,
  },
  dateTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 8,
  },
  dueDateText: {
    color: '#F9FAFB',
    fontSize: 16,
  },
  dateButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  addButtonGradient: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  addButton: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  addButtonText: {
    fontWeight: 'bold',
  },
  taskListContainer: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginLeft: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginBottom: 16,
  },
  loaderText: {
    color: '#CBD5E1',
    fontSize: 16,
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginTop: 20,
  },
  emptyText: {
    color: '#CBD5E1',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubText: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 8,
  },
}); 