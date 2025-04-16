export interface Task {
  id: string;
  title: string;
  status: 'Todo' | 'Done';
  dueDate: string;
  userId: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  userId: string;
}

export type RootStackParamList = {
  Home: undefined;
  Task: undefined;
  Chat: undefined;
  About: undefined;
}; 