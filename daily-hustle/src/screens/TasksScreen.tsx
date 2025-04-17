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
import { sendTestNotification } from '../utils/notifications';

// Storage key
const TASKS_STORAGE_KEY = '@dev_showcase_tasks';

export const TasksScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'completed'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Load tasks from AsyncStorage on component mount
  useEffect(() => {
    loadTasks();
  }, []);

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
    setCurrentTask(null);
    setTaskTitle('');
    setTaskDueDate(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Default to tomorrow
    setModalVisible(true);
  };

  // Save task
  const handleSaveTask = () => {
    if (taskTitle.trim() === '') {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const now = new Date().toISOString();
    let updatedTasks: Task[];

    if (currentTask) {
      // Update existing task
      updatedTasks = tasks.map(task =>
        task.id === currentTask.id
          ? {
              ...task,
              title: taskTitle,
              dueDate: taskDueDate ? taskDueDate.toISOString() : '',
            }
          : task
      );
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskTitle,
        status: 'Todo',
        dueDate: taskDueDate ? taskDueDate.toISOString() : '',
        userId: 'user1',
      };
      updatedTasks = [newTask, ...tasks];
    }

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setModalVisible(false);

    // Show notification for new task with due date
    if (!currentTask && taskDueDate) {
      sendTaskNotification(taskTitle);
    }
  };

  // Toggle task status
  const handleToggleStatus = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, status: task.status === 'Todo' ? 'Done' : 'Todo' }
        : task
    );
    const typedUpdatedTasks: Task[] = updatedTasks.map(task => ({
      ...task,
      status: task.status as 'Todo' | 'Done'
    }));
    setTasks(typedUpdatedTasks);
    saveTasks(typedUpdatedTasks);
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
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
          onPress: () => {
            const updatedTasks = tasks.filter(task => task.id !== id);
            setTasks(updatedTasks);
            saveTasks(updatedTasks);
          },
        },
      ]
    );
  };

  // Edit task
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setTaskTitle(task.title);
    setTaskDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setModalVisible(true);
  };

  // Handle date change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTaskDueDate(selectedDate);
    }
  };

  // Send notification for task
  const sendTaskNotification = async (title: string) => {
    try {
      await sendTestNotification(`New Task: ${title}`, 'Tap to view your task details');
    } catch (error) {
      console.error('Failed to send notification', error);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No due date';
    
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Check if a task is overdue
  const isOverdue = (task: Task) => {
    if (task.status === 'Done' || !task.dueDate) return false;
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < now;
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter(task => {
    if (filterType === 'all') return true;
    if (filterType === 'pending') return task.status === 'Todo';
    if (filterType === 'completed') return task.status === 'Done';
    return true;
  });

  // Get counts
  const todoCount = tasks.filter(task => task.status === 'Todo').length;
  const doneCount = tasks.filter(task => task.status === 'Done').length;
  const overdueCount = tasks.filter(task => isOverdue(task)).length;

  return (
    <LinearGradient
      colors={['#121638', '#2C3E50']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Ionicons name="checkmark-circle" size={28} color="#FF6B6B" />
        <Text style={styles.headerText}>Tasks</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{todoCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{doneCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, overdueCount > 0 && styles.overdueText]}>
            {overdueCount}
          </Text>
          <Text style={styles.statLabel}>Overdue</Text>
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'all' && styles.activeFilterButton,
          ]}
          onPress={() => setFilterType('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterType === 'all' && styles.activeFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'pending' && styles.activeFilterButton,
          ]}
          onPress={() => setFilterType('pending')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterType === 'pending' && styles.activeFilterText,
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'completed' && styles.activeFilterButton,
          ]}
          onPress={() => setFilterType('completed')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterType === 'completed' && styles.activeFilterText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[
              styles.taskCard,
              item.status === 'Done' && styles.completedTaskCard,
              isOverdue(item) && styles.overdueTaskCard,
            ]}>
              <TouchableOpacity
                style={styles.taskStatusButton}
                onPress={() => handleToggleStatus(item.id)}
              >
                <View style={[
                  styles.checkCircle,
                  item.status === 'Done' && styles.checkedCircle,
                ]}>
                  {item.status === 'Done' && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>
              
              <View style={styles.taskContent}>
                <Text
                  style={[
                    styles.taskTitle,
                    item.status === 'Done' && styles.completedTaskTitle,
                  ]}
                >
                  {item.title}
                </Text>
                
                {item.dueDate && (
                  <View style={styles.taskDueDateContainer}>
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color={isOverdue(item) ? '#FF6B6B' : '#94A3B8'}
                      style={styles.taskDueDateIcon}
                    />
                    <Text
                      style={[
                        styles.taskDueDate,
                        isOverdue(item) && styles.overdueDateText,
                      ]}
                    >
                      {formatDate(item.dueDate)}
                      {isOverdue(item) && ' (Overdue)'}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.taskActions}>
                <TouchableOpacity
                  style={styles.taskActionButton}
                  onPress={() => handleEditTask(item)}
                >
                  <Ionicons name="create-outline" size={20} color="#94A3B8" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.taskActionButton}
                  onPress={() => handleDeleteTask(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.tasksList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="checkbox-outline"
                size={60}
                color="#CBD5E1"
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>
                {filterType === 'all'
                  ? 'No tasks yet'
                  : filterType === 'pending'
                  ? 'No pending tasks'
                  : 'No completed tasks'}
              </Text>
              <Text style={styles.emptySubText}>
                {filterType === 'all'
                  ? 'Tap the + button to create your first task'
                  : filterType === 'pending'
                  ? 'All your tasks are completed!'
                  : 'You haven\'t completed any tasks yet'}
              </Text>
            </View>
          }
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
      
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          style={styles.addButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="add" size={32} color="white" />
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {currentTask ? 'Edit Task' : 'New Task'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="What needs to be done?"
              placeholderTextColor="#94A3B8"
              value={taskTitle}
              onChangeText={setTaskTitle}
              autoFocus
            />
            
            <View style={styles.dueDateContainer}>
              <Text style={styles.dueDateLabel}>Due Date</Text>
              
              <View style={styles.dueDateRow}>
                <View style={styles.dueDateTextContainer}>
                  <Ionicons name="calendar-outline" size={20} color="#94A3B8" style={styles.dueDateIcon} />
                  <Text style={styles.dueDateText}>
                    {taskDueDate ? formatDate(taskDueDate.toISOString()) : 'No due date'}
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.datePickerButtonText}>
                    {taskDueDate ? 'Change' : 'Set Date'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {showDatePicker && (
                <DateTimePicker
                  value={taskDueDate || new Date()}
                  mode="datetime"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveTask}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'center',
    paddingVertical: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
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
  overdueText: {
    color: '#FF6B6B',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeFilterButton: {
    backgroundColor: '#FF6B6B',
  },
  filterButtonText: {
    color: '#CBD5E1',
    fontWeight: '600',
    fontSize: 14,
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
    color: '#CBD5E1',
    marginTop: 12,
    fontSize: 16,
  },
  tasksList: {
    padding: 16,
    paddingBottom: 100, // Extra padding for FAB
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  completedTaskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  overdueTaskCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B6B',
  },
  taskStatusButton: {
    marginRight: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCircle: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  taskDueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDueDateIcon: {
    marginRight: 4,
  },
  taskDueDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  overdueDateText: {
    color: '#FF6B6B',
  },
  taskActions: {
    flexDirection: 'row',
  },
  taskActionButton: {
    paddingHorizontal: 8,
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
    marginBottom: 8,
  },
  emptySubText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    color: 'white',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: 'white',
    fontSize: 16,
  },
  dueDateContainer: {
    marginBottom: 20,
  },
  dueDateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  dueDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  dueDateTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateIcon: {
    marginRight: 8,
  },
  dueDateText: {
    color: 'white',
    fontSize: 14,
  },
  datePickerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  datePickerButtonText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 