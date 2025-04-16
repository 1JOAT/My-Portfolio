import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Task } from '../types';
import { fetchTasks } from '../api/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { TaskCard } from '../components/TaskCard';
import { sendTestNotification } from '../utils/notifications';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const [goalText, setGoalText] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const fetchedTasks = await fetchTasks();
    setTasks(fetchedTasks);
    setLoading(false);
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification();
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      
      <View style={styles.container}>
        <Text style={styles.header}>Crush Your Hustle!</Text>
        
        <View style={styles.goalContainer}>
          <Input
            label="Today's Goal"
            value={goalText}
            onChangeText={setGoalText}
            placeholder="e.g., Finish 3 tasks"
          />
        </View>
        
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>Your Tasks</Text>
          <Button 
            title="+ Add Task" 
            onPress={() => navigation.navigate('Task' as never)}
            type="primary"
            style={styles.addButton}
          />
        </View>
        
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggleStatus={() => {}}
              onDelete={() => {}}
            />
          )}
          style={styles.taskList}
          contentContainerStyle={styles.taskListContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No tasks yet. Add some to get hustling!
            </Text>
          }
        />
        
        <View style={styles.buttonContainer}>
          <Button
            title="Chat"
            onPress={() => navigation.navigate('Chat' as never)}
            type="secondary"
            style={styles.navigationButton}
          />
          <Button
            title="Test Notification"
            onPress={handleTestNotification}
            type="primary"
            style={styles.navigationButton}
          />
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
  goalContainer: {
    marginBottom: 24,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  navigationButton: {
    flex: 1,
    marginHorizontal: 8,
  },
}); 