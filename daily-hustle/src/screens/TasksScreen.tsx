import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Switch
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from '../utils/GradientWrapper';
import { Task } from '../types';
import { sendTestNotification} from '../utils/notifications';
import { useTheme } from '../utils/ThemeContext';

// Storage key
const TASKS_STORAGE_KEY = '@dev_showcase_tasks';

export const TasksScreen = () => {
  const { theme, settings } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'Todo' | 'Done'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Load tasks from AsyncStorage on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Calculate spacing based on compact mode
  const getSpacing = (size: number) => {
    return settings.compactMode ? size * 0.8 : size;
  };

  // Load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Failed to load tasks from storage', error);
      Alert.alert('Error', 'Failed to load tasks from storage');
    } finally {
      setLoading(false);
    }
  };

  // Save tasks to AsyncStorage
  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to save tasks to storage', error);
      Alert.alert('Error', 'Failed to save tasks to storage');
    }
  };

  // Handle refreshing the task list
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  // Add a new task
  const handleAddTask = () => {
    setTaskTitle('');
    setTaskDueDate(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Default due date to tomorrow
    setCurrentTask(null);
    setModalVisible(true);
  };

  // Save the task
  const handleSaveTask = async () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    console.log('Creating/saving task with title:', taskTitle);
    const now = new Date().toISOString();
    
    if (currentTask) {
      // Update existing task
      console.log('Updating existing task:', currentTask.id);
      const updatedTasks = tasks.map(task =>
        task.id === currentTask.id
          ? {
              ...task,
              title: taskTitle,
              dueDate: taskDueDate ? taskDueDate.toISOString() : '',
              updatedAt: now,
            }
          : task
      );
      
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      
      // Update or cancel reminder for this task
      const updatedTask = updatedTasks.find(task => task.id === currentTask.id);
      if (updatedTask) {
        console.log('Task due date:', updatedTask.dueDate ? new Date(updatedTask.dueDate).toLocaleString() : 'None');
        if (updatedTask.dueDate && updatedTask.status === 'Todo') {
          console.log('Scheduling reminder for updated task');
          // await scheduleTaskReminder(updatedTask);
        } else {
          console.log('Cancelling reminders for updated task');
          // await cancelTaskReminders(currentTask.id);
        }
      }
    } else {
      // Create new task
      console.log('Creating new task with due date:', taskDueDate ? taskDueDate.toLocaleString() : 'None');
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskTitle,
        status: 'Todo',
        dueDate: taskDueDate ? taskDueDate.toISOString() : '',
        createdAt: now,
        updatedAt: now,
        userId: 'dev1',
      };
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      
      // Schedule reminder for this task if it has a due date
      if (newTask.dueDate) {
        console.log('Scheduling reminder for new task');
        try {
          // await scheduleTaskReminder(newTask);
          console.log('Reminder scheduling completed');
        } catch (error) {
          console.error('Error scheduling reminder:', error);
        }
      } else {
        console.log('No due date set, skipping reminder scheduling');
      }
    }
    
    setModalVisible(false);
  };

  // Toggle task completion status
  const toggleTaskStatus = async (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? {
            ...task,
            status: task.status === 'Todo' ? 'Done' : 'Todo',
            updatedAt: new Date().toISOString(),
          }
        : task
    );
    const typedUpdatedTasks = updatedTasks.map(task => ({
      ...task,
      status: task.status as 'Todo' | 'Done'
    }));
    
    setTasks(typedUpdatedTasks);
    await saveTasks(typedUpdatedTasks);
    
    // Handle the reminder based on task status
    const task = typedUpdatedTasks.find(task => task.id === id);
    if (task) {
      if (task.status === 'Done') {
        // await cancelTaskReminders(id);
      } else if (task.dueDate) {
        const typedTask: Task = {
          ...task,
          status: task.status as 'Todo' | 'Done'
        };
        // await scheduleTaskReminder(typedTask);
      }
    }
  };

  // Edit a task
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setTaskTitle(task.title);
    setTaskDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setModalVisible(true);
  };

  // Delete a task
  const handleDeleteTask = async (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Cancel any scheduled reminders for this task
            // await cancelTaskReminders(id);
            
            const updatedTasks = tasks.filter(task => task.id !== id);
            setTasks(updatedTasks);
            await saveTasks(updatedTasks);
          },
        },
      ]
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if it's today or tomorrow
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  // Check if a task is overdue
  const isTaskOverdue = (task: Task) => {
    if (task.status === 'Done' || !task.dueDate) return false;
    
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    
    return dueDate < now;
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filterType === 'Todo') return task.status === 'Todo';
    if (filterType === 'Done') return task.status === 'Done';
    return true;
  });

  // Count tasks by status
  const todoCount = tasks.filter(task => task.status === 'Todo').length;
  const doneCount = tasks.filter(task => task.status === 'Done').length;
  const overdueCount = tasks.filter(task => isTaskOverdue(task)).length;

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.card]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style={theme.dark ? "light" : "dark"} />
      
      <View style={styles.header}>
        <Ionicons name="checkmark-circle" size={28} color={theme.colors.primary} />
        <Text style={[styles.headerText, { color: theme.colors.text }]}>Tasks</Text>
      </View>
      
      <View style={[
        styles.statsContainer, 
        { 
          backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          marginHorizontal: getSpacing(16),
          marginBottom: getSpacing(16),
          padding: getSpacing(16),
        }
      ]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{todoCount}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>Todo</Text>
        </View>
        
        <View style={[styles.statDivider, { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)' }]} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{doneCount}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>Done</Text>
        </View>
        
        <View style={[styles.statDivider, { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)' }]} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, overdueCount > 0 && { color: theme.colors.error }]}>
            {overdueCount}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>Overdue</Text>
        </View>
      </View>
      
      <View style={[
        styles.filterContainer, 
        { 
          marginHorizontal: getSpacing(16),
          marginBottom: getSpacing(16),
        }
      ]}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'all' && [styles.activeFilterButton, { backgroundColor: theme.colors.primary }]
          ]}
          onPress={() => setFilterType('all')}
        >
          <Text 
            style={[
              styles.filterText, 
              { color: theme.colors.subtext },
              filterType === 'all' && styles.activeFilterText
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'Todo' && [styles.activeFilterButton, { backgroundColor: theme.colors.primary }]
          ]}
          onPress={() => setFilterType('Todo')}
        >
          <Text 
            style={[
              styles.filterText, 
              { color: theme.colors.subtext },
              filterType === 'Todo' && styles.activeFilterText
            ]}
          >
            Todo
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'Done' && [styles.activeFilterButton, { backgroundColor: theme.colors.primary }]
          ]}
          onPress={() => setFilterType('Done')}
        >
          <Text 
            style={[
              styles.filterText, 
              { color: theme.colors.subtext },
              filterType === 'Done' && styles.activeFilterText
            ]}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View 
              style={[
                styles.taskCard,
                { 
                  backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  marginBottom: getSpacing(12)
                },
                isTaskOverdue(item) && styles.overdueTaskCard
              ]}
            >
              <View style={styles.taskHeader}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => toggleTaskStatus(item.id)}
                >
                  <LinearGradient
                    colors={item.status === 'Done' ? theme.colors.gradient.success : ['transparent', 'transparent']}
                    style={[
                      styles.checkbox,
                      { 
                        borderColor: theme.colors.primary,
                        borderWidth: item.status === 'Done' ? 0 : 2
                      }
                    ]}
                  >
                    {item.status === 'Done' && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                
                <View style={styles.taskDetails}>
                  <Text 
                    style={[
                      styles.taskTitle,
                      { color: theme.colors.text },
                      item.status === 'Done' && styles.completedTaskTitle
                    ]}
                  >
                    {item.title}
                  </Text>
                  
                  {item.dueDate && (
                    <Text
                      style={[
                        styles.dueDate,
                        { color: theme.colors.subtext },
                        isTaskOverdue(item) && { color: theme.colors.error }
                      ]}
                    >
                      <Ionicons 
                        name="time-outline" 
                        size={12} 
                        color={isTaskOverdue(item) ? theme.colors.error : theme.colors.subtext} 
                      /> {formatDate(item.dueDate)}
                    </Text>
                  )}
                </View>
                
                <View style={styles.taskActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleEditTask(item)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="pencil" size={18} color={theme.colors.primary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeleteTask(item.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={[styles.tasksList, { padding: getSpacing(16) }]}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <TouchableOpacity 
        style={[
          styles.addButton, 
          { 
            bottom: getSpacing(16),
            right: getSpacing(16),
            width: getSpacing(56),
            height: getSpacing(56),
          }
        ]} 
        onPress={handleAddTask}
      >
        <LinearGradient
          colors={theme.colors.gradient.primary}
          style={styles.addButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={30} color="white" />
        </LinearGradient>
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                {currentTask ? 'Edit Task' : 'New Task'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[
                styles.input,
                { 
                  color: theme.colors.text,
                  backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  borderColor: theme.colors.border
                }
              ]}
              placeholder="What needs to be done?"
              placeholderTextColor={theme.colors.subtext}
              value={taskTitle}
              onChangeText={setTaskTitle}
              autoFocus
            />
            
            <TouchableOpacity
              style={[
                styles.dateButton,
                { 
                  backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  borderColor: theme.colors.border
                }
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
                {taskDueDate ? formatDate(taskDueDate.toISOString()) : 'Set due date'}
              </Text>
              {taskDueDate && (
                <TouchableOpacity
                  onPress={() => setTaskDueDate(null)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close-circle" size={20} color={theme.colors.subtext} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={taskDueDate || new Date()}
                mode="datetime"
                display="default"
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const now = new Date();
                    const validDate = selectedDate > now ? selectedDate : new Date(now.getTime() + 60 * 60 * 1000);
                    setTaskDueDate(validDate);
                  }
                }}
              />
            )}
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveTask}
            >
              <LinearGradient
                colors={theme.colors.gradient.primary}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.saveButtonText}>Save Task</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeFilterButton: {
  },
  filterText: {
    fontWeight: '600',
  },
  activeFilterText: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  tasksList: {
    paddingTop: 0,
  },
  taskCard: {
    borderRadius: 12,
    padding: 16,
  },
  overdueTaskCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  dueDate: {
    fontSize: 12,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 12,
  },
  addButton: {
    position: 'absolute',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 20,
  },
  dateButtonText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 12,
  },
  saveButtonGradient: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 