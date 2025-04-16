import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, Platform, AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Message } from '../types';
import { fetchMessages } from '../api/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ChatMessage } from '../components/ChatMessage';
import { initializeSocket, sendChatMessage, subscribeToChatMessages, disconnectSocket } from '../api/socket';
import { sendNewMessageNotification } from '../utils/notifications';

export const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
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
    const fetchedMessages = await fetchMessages();
    setMessages(fetchedMessages);
    setLoading(false);
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
    
    // Send via Socket.IO
    sendChatMessage(newMessage, currentUserId);
    setNewMessage('');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        
        <View style={styles.container}>
          <Text style={styles.header}>Daily Hustle Chat</Text>
          
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
              loading ? null : (
                <Text style={styles.emptyText}>
                  No messages yet. Start the conversation!
                </Text>
              )
            }
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
          
          <View style={styles.inputContainer}>
            <Input
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type your message..."
              containerStyle={styles.textInput}
              multiline
            />
            <Button
              title="Send"
              onPress={handleSendMessage}
              type="primary"
              style={styles.sendButton}
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#111827',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22C55E',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingBottom: 16,
  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  textInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  sendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
}); 