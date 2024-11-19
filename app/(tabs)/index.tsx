import React, { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { post, get } from '@/utils/request'
import Markdown from 'react-native-markdown-display';

const presets = ['Recipe sugesstion', 'How to cook', 'Tell me ingredients'];

export default function VirtualNutritionistChat() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = React.useState<{text: String, sender: string}[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const flatListRef = React.useRef<FlatList>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    const getInfo = async () => {
      const response = await get('/chat/test')
      setMessages([...messages, { text: response as string, sender: 'server'}])
    }
    // getInfo()
  }, [])

  const getAnswer = async (message: string) => {
    setIsLoading(true);
    try {
      const response = await post('/chat/current', {role: 'user', content: message})
      setMessages(prevMessages => prevMessages.map((msg, index) => {
        if (index === prevMessages.length - 1 && msg.sender === 'loading') {
          return { text: response as string, sender: 'server' };
        }
        return msg;
      }));
    } catch (error) {
      setMessages(prevMessages => prevMessages.filter(msg => msg.sender !== 'loading'));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputValue.trim()) {
      setMessages(prevMessages => [
        ...prevMessages, 
        { text: inputValue, sender: 'user' },
        { text: 'Thinking...', sender: 'loading' }
      ]);
      setInputValue('');
      getAnswer(inputValue);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.messageWrapper,
      item.sender === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper
    ]}>
      {(item.sender === 'server' || item.sender === 'loading') && (
        <View style={styles.avatarContainer}>
          <Ionicons name="nutrition-outline" size={20} color="#fff" />
        </View>
      )}
      <View style={[
        item.sender === 'user' ? styles.userMessage : styles.aiMessage,
        styles.messageShadow,
        item.sender === 'loading' && styles.loadingMessage
      ]}>
        {item.sender === 'server' ? (
          <Markdown 
            style={{
              body: { color: '#333' },
              link: { color: '#2196F3' },
              code_block: { 
                backgroundColor: '#f5f5f5',
                padding: 8,
                borderRadius: 4,
              },
              code_inline: {
                backgroundColor: '#f5f5f5',
                padding: 4,
                borderRadius: 4,
              },
            }}
          >
            {item.text as string}
          </Markdown>
        ) : (
          <ThemedText style={[
            item.sender === 'user' ? styles.userText : styles.aiText,
            item.sender === 'loading' && styles.loadingText
          ]}>
            {item.text}
          </ThemedText>
        )}
      </View>
      {item.sender === 'user' && (
        <View style={[styles.avatarContainer, styles.userAvatarContainer]}>
          <Ionicons name="person" size={20} color="#fff" />
        </View>
      )}
    </View>
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#4CAF50', '#45a049']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="nutrition" size={24} color="#fff" />
          <View style={styles.headerTextContainer}>
            <ThemedText style={styles.headerTitle}>AI Nutritionist</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Online</ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={() => setMessages([])}
          >
            <Ionicons name="trash-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.chatList}
        contentContainerStyle={styles.chatListContent}
      />

      <View style={styles.presetContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={presets}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.presetButton} 
              onPress={() => setInputValue(item)}
            >
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                style={styles.presetGradient}
              >
                <ThemedText style={styles.presetText}>{item}</ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Ask about nutrition..."
          placeholderTextColor="#999"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity 
          onPress={sendMessage}
          style={styles.sendButtonContainer}
        >
          <LinearGradient
            colors={['#4CAF50', '#45a049']}
            style={styles.sendButtonGradient}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    paddingBottom: 6,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  chatListContent: {
    padding: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-start',
    gap: 8,
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  aiMessageWrapper: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarContainer: {
    backgroundColor: '#2196F3',
  },
  userMessage: {
    maxWidth: '80%',
    backgroundColor: '#2196F3',
    borderRadius: 20,
    borderBottomRightRadius: 4,
    padding: 12,
  },
  aiMessage: {
    maxWidth: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    padding: 12,
    minWidth: 200,
  },
  messageShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#333',
  },
  presetContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  presetButton: {
    marginRight: 8,
  },
  presetGradient: {
    borderRadius: 20,
    padding: 10,
  },
  presetText: {
    color: '#fff',
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 6,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginRight: 12,
    fontSize: 15,
  },
  sendButtonContainer: {
    width: 44,
    height: 44,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMessage: {
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    color: '#666',
    fontStyle: 'italic',
  },
  clearButton: {
    padding: 8,
  },
});
