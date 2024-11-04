import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const presets = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Diet Tips'];

export default function VirtualNutritionistChat() {
  const [messages, setMessages] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');

  const sendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');
      // Here you would also call the AI API to get a response
    }
  };

  const renderItem = ({ item }) => (
    <View style={item.sender === 'user' ? styles.userMessage : styles.aiMessage}>
      <ThemedText>{item.text}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="happy-outline" size={24} style={styles.aiIcon} />
        <ThemedText>AI is Online</ThemedText>
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.chatList}
        inverted // To show the latest message at the bottom
      />

      <View style={styles.presetContainer}>
        {presets.map((preset, index) => (
          <TouchableOpacity key={index} style={styles.presetButton} onPress={() => setInputValue(preset)}>
            <ThemedText>{preset}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Type your message..."
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={24} style={styles.sendButton} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiIcon: {
    marginRight: 8,
    color: '#4CAF50', // Example color for online status
  },
  chatList: {
    flex: 1,
    marginBottom: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e1ffc7',
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  presetButton: {
    backgroundColor: '#d0d0d0',
    borderRadius: 20,
    padding: 8,
    margin: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    marginRight: 8,
  },
  sendButton: {
    color: '#4CAF50',
  },
});
