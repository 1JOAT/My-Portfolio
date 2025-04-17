import { io, Socket } from 'socket.io-client';
import { Message } from '../types';

// Replace with your server URL when deployed
const SOCKET_URL = 'http://172.20.10.2:5050';

let socket: Socket | null = null;

export const initializeSocket = (userId: string = 'dev1'): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL);
    
    socket.on('connect', () => {
      console.log('Socket connected');
      socket?.emit('join', userId);
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendChatMessage = (text: string, userId: string = 'dev1'): void => {
  if (socket) {
    socket.emit('message', { text, userId });
  } else {
    console.error('Socket not connected');
  }
};

export const subscribeToChatMessages = (callback: (message: Message) => void): () => void => {
  if (!socket) {
    initializeSocket();
  }
  
  socket?.on('message', callback);
  
  // Return unsubscribe function
  return () => {
    socket?.off('message', callback);
  };
}; 