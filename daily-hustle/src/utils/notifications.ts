import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '../types';

export async function registerForPushNotificationsAsync() {
  let token;
  
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return null;
  }
  
  token = (await Notifications.getExpoPushTokenAsync()).data;
  
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#22C55E',
    });
  }
  
  return token;
}

export async function schedulePushNotification(title: string, body: string, data?: any) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
    },
    trigger: null,
  });
}

export async function sendTaskReminderNotification(task: Task) {
  await schedulePushNotification(
    'Task Reminder',
    `Task "${task.title}" due soon!`,
    { taskId: task.id }
  );
}

export async function sendNewMessageNotification(senderName: string, messagePreview: string) {
  await schedulePushNotification(
    'New Message',
    `New message from ${senderName}: ${messagePreview}`,
    { screen: 'Chat' }
  );
}

export async function sendTestNotification() {
  await schedulePushNotification(
    'Test Notification',
    'This is a test notification from Daily Hustle!',
    { data: 'test' }
  );
}

export function configurePushNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function checkTasksForNotifications(tasks: Task[]) {
  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
  
  tasks.forEach(task => {
    if (task.status === 'Todo' && task.dueDate) {
      const dueDate = new Date(task.dueDate);
      
      // Only send notification if due date is within the next hour but not past
      if (dueDate <= oneHourFromNow && dueDate > now) {
        sendTaskReminderNotification(task);
      }
    }
  });
} 