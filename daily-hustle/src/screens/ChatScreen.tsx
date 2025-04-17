import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, Platform, AppState, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../types';
import { fetchMessages } from '../api/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ChatMessage } from '../components/ChatMessage';
import { initializeSocket, sendChatMessage, subscribeToChatMessages, disconnectSocket } from '../api/socket';
import { sendNewMessageNotification } from '../utils/notifications';
import { LinearGradient } from '../utils/GradientWrapper';

// Sample messages for immediate display
const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hey, how\'s the Daily Hustle app coming along?',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    userId: 'other1',
  },
  {
    id: '2',
    text: 'Making good progress! Just fixing some styling issues.',
    timestamp: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
    userId: 'dev1',
  },
  {
    id: '3',
    text: 'The top navigation looks great now!',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    userId: 'dev1',
  },
  {
    id: '4',
    text: 'Can\'t wait to see the final version. When will it be ready?',
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    userId: 'other1',
  },
  {
    id: '5',
    text: 'Should be ready by tomorrow. I\'ll send you the demo link!',
    timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    userId: 'dev1',
  },
];

export const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const appState = useRef(AppState.currentState);
  const flatListRef = useRef<FlatList>(null);
  const currentUserId = 'dev1'; // In a real app, this would come from authentication

  useEffect(() => {
    loadMessages();
    
    // Socket.IO setup
    const socket = initializeSocket(currentUserId);
    const unsubscribe = subscribeToChatMessages(handleNewMessage);
    
    // Set up AppState listener for background state
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        loadMessages();
      } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App has gone to the background
      }
      appState.current = nextAppState;
    });
    
    return () => {
      unsubscribe();
      disconnectSocket();
      subscription.remove();
    };
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const fetchedMessages = await fetchMessages();
      if (fetchedMessages && fetchedMessages.length > 0) {
        setMessages(fetchedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // Keep using sample data if API fails
    } finally {
      setLoading(false);
    }
    
    // Scroll to bottom after loading messages
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 200);
  };

  const handleNewMessage = (message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
    
    // Scroll to the bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    // Send notification if message is from another user and app is in background
    if (message.userId !== currentUserId && appState.current !== 'active') {
      sendNewMessageNotification('Collaborator', message.text);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    try {
      // Send via Socket.IO
      sendChatMessage(newMessage, currentUserId);
      
      // Add message locally in case Socket.IO fails
      const newMsg: Message = {
        id: `local_${Date.now()}`,
        text: newMessage,
        timestamp: new Date().toISOString(),
        userId: currentUserId
      };
      
      setMessages(prevMessages => [...prevMessages, newMsg]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  return (
    <LinearGradient 
      colors={['#212B40', '#0F172A']} 
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      <StatusBar style="light" />
      
      <View style={styles.headerContainer}>
        <Ionicons name="chatbubbles" size={30} color="#FF6B6B" />
        <Text style={styles.header}>Daily Hustle Chat</Text>
      </View>
      
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="chatbubbles-outline" size={50} color="#374151" style={styles.loadingIcon} />
            <Text style={styles.loadingText}>Loading chat history...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatMessage
                message={item}
                isCurrentUser={item.userId === currentUserId}
              />
            )}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubbles-outline" size={50} color="#374151" />
                <Text style={styles.emptyText}>
                  No messages yet
                </Text>
                <Text style={styles.emptySubText}>
                  Be the first one to start the conversation!
                </Text>
              </View>
            }
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />
        )}
        
        <View style={styles.inputContainer}>
          <Input
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message..."
            containerStyle={styles.textInput}
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={handleSendMessage}
            disabled={newMessage.trim() === ''}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.sendButtonGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            >
              <Ionicons name="send" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginLeft: 10,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    marginBottom: 16,
  },
  loadingText: {
    color: '#CBD5E1',
    fontSize: 16,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginTop: 60,
    marginBottom: 60,
  },
  emptyText: {
    color: '#CBD5E1',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  textInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 