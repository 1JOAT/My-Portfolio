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

  // Save a new note or update an existing one
  const handleSaveNote = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    // Parse tags from the input string
    const tags = tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    const now = new Date().toISOString();
    let updatedNotes: Note[];

    if (editMode && currentNote) {
      // Update existing note
      updatedNotes = notes.map(note => 
        note.id === currentNote.id
          ? {
              ...note,
              title,
              content,
              tags,
              updatedAt: now,
            }
          : note
      );
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        tags,
        createdAt: now,
        updatedAt: now,
        color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      };
      updatedNotes = [newNote, ...notes];
    }

    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setModalVisible(false);
  };

  // Delete a note
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

  // Filter notes based on search query
  const filteredNotes = searchQuery
    ? notes.filter(
        note =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : notes;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <LinearGradient
      colors={['#121638', '#2C3E50']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Ionicons name="document-text" size={28} color="#FF6B6B" />
        <Text style={styles.headerText}>Notes</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#94A3B8" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading notes...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.noteCard, { borderLeftColor: item.color }]}
              onPress={() => handleEditNote(item)}
            >
              <View style={styles.noteHeader}>
                <Text style={styles.noteTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <TouchableOpacity
                  onPress={() => handleDeleteNote(item.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.noteContent} numberOfLines={2}>
                {item.content}
              </Text>
              
              {item.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {item.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
              
              <Text style={styles.noteDate}>
                Updated {formatDate(item.updatedAt)}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.notesList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={60} color="#CBD5E1" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>
                {searchQuery ? 'No notes matching your search' : 'No notes yet'}
              </Text>
              <Text style={styles.emptySubText}>
                {searchQuery ? 'Try a different search term' : 'Tap the + button to create your first note'}
              </Text>
            </View>
          }
        />
      )}
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddNote}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          style={styles.addButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="add" size={32} color="white" />
        </LinearGradient>
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editMode ? 'Edit Note' : 'New Note'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
            
            <TextInput
              style={styles.textArea}
              placeholder="Note content..."
              placeholderTextColor="#94A3B8"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Tags (comma separated)"
              placeholderTextColor="#94A3B8"
              value={tagInput}
              onChangeText={setTagInput}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveNote}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'center',
    paddingVertical: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: 'white',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#CBD5E1',
    marginTop: 12,
    fontSize: 16,
  },
  notesList: {
    padding: 16,
    paddingBottom: 100, // Extra padding for FAB
  },
  noteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
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
    color: 'white',
    flex: 1,
  },
  noteContent: {
    fontSize: 14,
    color: '#CBD5E1',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  noteDate: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginTop: 20,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    color: '#CBD5E1',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
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
    color: 'white',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: 'white',
    fontSize: 16,
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: 'white',
    fontSize: 16,
    minHeight: 120,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 