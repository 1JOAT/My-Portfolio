import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from '../utils/GradientWrapper';
import { Note } from '../types';
import { useTheme } from '../utils/ThemeContext';

// Storage key
const NOTES_STORAGE_KEY = '@dev_showcase_notes';

// Sample colors for notes
const NOTE_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#FFD166', // Yellow
  '#6B66FF', // Purple
  '#0BD904', // Green
  '#FF66B3', // Pink
];

export const NotesScreen = () => {
  const { theme, settings } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load notes from AsyncStorage on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Calculate spacing based on compact mode
  const getSpacing = (size: number) => {
    return settings.compactMode ? size * 0.8 : size;
  };

  // Load notes from AsyncStorage
  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error('Failed to load notes from storage', error);
      Alert.alert('Error', 'Failed to load notes from storage');
    } finally {
      setLoading(false);
    }
  };

  // Save notes to AsyncStorage
  const saveNotes = async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Failed to save notes to storage', error);
      Alert.alert('Error', 'Failed to save notes to storage');
    }
  };

  // Open modal to add a new note
  const handleAddNote = () => {
    setEditMode(false);
    setCurrentNote(null);
    setTitle('');
    setContent('');
    setTagInput('');
    setModalVisible(true);
  };

  // Open modal to edit an existing note
  const handleEditNote = (note: Note) => {
    setEditMode(true);
    setCurrentNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTagInput(note.tags.join(', '));
    setModalVisible(true);
  };

  // Handle save note
  const handleSaveNote = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your note');
      return;
    }

    const tags = tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    if (editMode && currentNote) {
      // Update existing note
      const updatedNote: Note = {
        ...currentNote,
        title,
        content,
        tags,
        updatedAt: new Date().toISOString(),
      };

      const updatedNotes = notes.map(note => 
        note.id === currentNote.id ? updatedNote : note
      );

      setNotes(updatedNotes);
      saveNotes(updatedNotes);
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        tags,
        color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
    }

    setModalVisible(false);
  };

  // Handle delete note
  const handleDeleteNote = (id: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedNotes = notes.filter(note => note.id !== id);
            setNotes(updatedNotes);
            saveNotes(updatedNotes);
          },
        },
      ]
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    
    return searchTerms.every(term => 
      note.title.toLowerCase().includes(term) ||
      note.content.toLowerCase().includes(term) ||
      note.tags.some(tag => tag.toLowerCase().includes(term))
    );
  });

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.card]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style={theme.dark ? "light" : "dark"} />
      
      <View style={styles.header}>
        <Ionicons name="document-text" size={28} color={theme.colors.primary} />
        <Text style={[styles.headerText, { color: theme.colors.text }]}>Notes</Text>
      </View>
      
      <View style={[
        styles.searchContainer, 
        { 
          backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          padding: getSpacing(12)
        }
      ]}>
        <Ionicons name="search" size={20} color={theme.colors.subtext} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search notes..."
          placeholderTextColor={theme.colors.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading notes...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.noteCard, 
                { 
                  backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  borderLeftColor: item.color,
                  marginBottom: getSpacing(12),
                  padding: getSpacing(14)
                }
              ]}
              onPress={() => handleEditNote(item)}
            >
              <View style={styles.noteHeader}>
                <Text style={[styles.noteTitle, { color: theme.colors.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <TouchableOpacity
                  onPress={() => handleDeleteNote(item.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="trash-outline" size={18} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
              
              <Text style={[styles.noteContent, { color: theme.colors.subtext }]} numberOfLines={2}>
                {item.content}
              </Text>
              
              {item.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {item.tags.map((tag, index) => (
                    <View key={index} style={[styles.tag, { backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.07)' }]}>
                      <Text style={[styles.tagText, { color: theme.colors.primary }]}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
              
              <Text style={[styles.noteDate, { color: theme.colors.subtext }]}>
                Updated {formatDate(item.updatedAt)}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={[styles.notesList, { padding: getSpacing(16) }]}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <TouchableOpacity 
        style={[
          styles.addButton, 
          { 
            backgroundColor: theme.colors.primary,
            bottom: getSpacing(16),
            right: getSpacing(16),
            width: getSpacing(56),
            height: getSpacing(56),
          }
        ]} 
        onPress={handleAddNote}
      >
        <Ionicons name="add" size={30} color="white" />
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
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                {editMode ? 'Edit Note' : 'New Note'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.titleInput, { color: theme.colors.text, borderBottomColor: theme.colors.border }]}
              placeholder="Title"
              placeholderTextColor={theme.colors.subtext}
              value={title}
              onChangeText={setTitle}
            />
            
            <TextInput
              style={[styles.contentInput, { color: theme.colors.text, backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)' }]}
              placeholder="Type your note here..."
              placeholderTextColor={theme.colors.subtext}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
            
            <TextInput
              style={[styles.tagsInput, { color: theme.colors.text, backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)' }]}
              placeholder="Tags (separated by commas)"
              placeholderTextColor={theme.colors.subtext}
              value={tagInput}
              onChangeText={setTagInput}
            />
            
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleSaveNote}
            >
              <Text style={styles.saveButtonText}>Save Note</Text>
            </TouchableOpacity>
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
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  notesList: {
    paddingTop: 0,
  },
  noteCard: {
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  noteContent: {
    fontSize: 14,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  noteDate: {
    fontSize: 12,
  },
  addButton: {
    position: 'absolute',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
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
  },
  titleInput: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  contentInput: {
    fontSize: 16,
    padding: 12,
    borderRadius: 12,
    minHeight: 150,
    marginBottom: 16,
  },
  tagsInput: {
    fontSize: 16,
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 