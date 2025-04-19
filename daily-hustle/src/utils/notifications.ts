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

export async function schedulePushNotification(
  title: string, 
  body: string, 
  data?: any, 
  trigger: Notifications.NotificationTriggerInput = null
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
      sound: true,
    },
    trigger,
  });
}

export async function sendTaskReminderNotification(task: Task) {
  // Disabled as per user request to only send notifications when task is due
  console.log('Task reminder notifications disabled except for due time');
  return;
  
  // Original code preserved but disabled
  /*
  await schedulePushNotification(
    'Task Reminder',
    `Task "${task.title}" due soon!`,
    { taskId: task.id, screen: 'Tasks' }
  );
  */
}

// export async function scheduleTaskReminder(task: Task) {
//   // Cancel any existing notification for this task
//   await cancelTaskReminders(task.id);
  
//   if (task.status === 'Done' || !task.dueDate) {
//     return;
//   }

//   const dueDate = new Date(task.dueDate);
//   const now = new Date();

//   // If due date is in the past, don't schedule
//   if (dueDate <= now) {
//     console.log(`Task "${task.title}" due date is in the past, not scheduling notifications`);
//     return;
//   }

//   // Calculate time differences for better notification planning
//   const timeDiff = dueDate.getTime() - now.getTime();
//   const hoursDiff = timeDiff / (1000 * 60 * 60);
//   const minutesDiff = timeDiff / (1000 * 60);
  
//   console.log(`Scheduling notifications for task "${task.title}":
//     - Due date: ${dueDate.toLocaleString()}
//     - Current time: ${now.toLocaleString()}
//     - Hours until due: ${hoursDiff.toFixed(1)}
//     - Minutes until due: ${minutesDiff.toFixed(1)}`);
  
//   // Minimum buffer for any notification (5 minutes in ms)
//   const MIN_NOTIFICATION_BUFFER = 5 * 60 * 1000; // 5 minutes in ms
  
//   // Schedule the "due now" notification
//   // Add a buffer to prevent immediate notifications
//   const MIN_DUE_NOW_BUFFER = 2 * 60 * 1000; // 2 minutes in ms
  
//   // Set the due notification time to the actual due time
//   let dueNotificationTime = new Date(dueDate);
  
//   // Add a check to ensure we're not scheduling notifications for the immediate future
//   if (dueNotificationTime.getTime() - now.getTime() < MIN_NOTIFICATION_BUFFER) {
//     console.log(`Due notification would be too soon, adding more buffer time`);
//     // If due time is less than the minimum buffer, push it to minimum buffer time
//     dueNotificationTime = new Date(now.getTime() + MIN_NOTIFICATION_BUFFER);
//   }
  
//   console.log(`Scheduling due now notification for ${dueNotificationTime.toLocaleString()}`);
//   try {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: 'Task Due Now',
//         body: `"${task.title}" is due now`,
//         data: { taskId: task.id, screen: 'Tasks', type: 'due-now' },
//         sound: true,
//       },
//       trigger: {
//         date: dueNotificationTime,
//         channelId: 'default',
//       } as Notifications.NotificationTriggerInput,
//     });
//   } catch (error) {
//     console.error('Failed to schedule due now notification:', error);
//   }

//   // Debug: List all scheduled notifications
//   setTimeout(async () => {
//     try {
//       const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
//       console.log(`Total scheduled notifications: ${scheduledNotifications.length}`);
//       scheduledNotifications.forEach((notification, index) => {
//         let triggerDate = 'unknown trigger';
        
//         // Handle different trigger types safely
//         if (notification.trigger && 'date' in notification.trigger) {
//           triggerDate = new Date(notification.trigger.date).toLocaleString();
//         }
        
//         console.log(`Notification #${index + 1}: ${notification.content.title} - ${triggerDate}`);
//       });
//     } catch (error) {
//       console.error('Failed to list scheduled notifications:', error);
//     }
//   }, 1000);
// }

export async function cancelTaskReminders(taskId: string) {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  
  for (const notification of scheduledNotifications) {
    if (notification.content.data?.taskId === taskId) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}


export async function sendTestNotification(title: string, body: string) {
  await schedulePushNotification(
    title,
    body,
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
  // Skip sending notifications as per user request
  return;

  // Original code preserved but disabled:
  /*
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
  */
} 