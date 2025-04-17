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

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  color: string;
}

export interface Skill {
  name: string;
  level: number; // 1-5
  icon: string;
  category: 'frontend' | 'backend' | 'mobile' | 'other';
}

export type RootStackParamList = {
  Home: undefined;
  Notes: undefined;
  Tasks: undefined;
  Settings: undefined;
}; 