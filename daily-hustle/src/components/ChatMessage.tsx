import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../utils/GradientWrapper';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export const ChatMessage = ({ message, isCurrentUser }: ChatMessageProps) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      {!isCurrentUser && (
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#3498DB', '#2980B9']}
            style={styles.avatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.avatarText}>U</Text>
          </LinearGradient>
        </View>
      )}
      
      <View style={styles.messageContent}>
        <LinearGradient
          colors={isCurrentUser ? ['#FF6B6B', '#FF8E53'] : ['#334155', '#1E293B']}
          style={[
            styles.bubble,
            isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[
            styles.text,
            isCurrentUser ? styles.currentUserText : styles.otherUserText
          ]}>
            {message.text}
          </Text>
        </LinearGradient>
        
        <View style={[
          styles.timeContainer,
          isCurrentUser ? styles.currentUserTime : styles.otherUserTime
        ]}>
          <Ionicons 
            name="time-outline" 
            size={12} 
            color="#94A3B8" 
            style={styles.timeIcon} 
          />
          <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
        </View>
      </View>
      
      {isCurrentUser && (
        <View style={styles.statusContainer}>
          <Ionicons name="checkmark-done" size={16} color="#22C55E" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    flexDirection: 'row',
    maxWidth: '90%',
    alignItems: 'flex-end',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  messageContent: {
    maxWidth: '85%',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 4,
  },
  currentUserBubble: {
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  currentUserText: {
    color: '#FFFFFF',
  },
  otherUserText: {
    color: '#F9FAFB',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentUserTime: {
    alignSelf: 'flex-end',
  },
  otherUserTime: {
    alignSelf: 'flex-start',
  },
  timeIcon: {
    marginRight: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statusContainer: {
    marginLeft: 4,
    alignSelf: 'flex-end',
  },
}); 