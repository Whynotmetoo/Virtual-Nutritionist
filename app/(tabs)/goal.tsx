import { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';

import { post,get } from '@/utils/request'

export default function GoalScreen() {
  // State variables
  const [dietPreference, setDietPreference] = useState('');
  const insets = useSafeAreaInsets();
  const [isPreferenceModalVisible, setPreferenceModalVisible] = useState(false);
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [isCuisineModalVisible, setCuisineModalVisible] = useState(false);
  const [ enableEditing, setEnableEditing] = useState(false);

  const dietaryOptions = [
    { label: 'paleo', value: 'paleo' },
    { label: 'keto', value: 'keto' },
    { label: 'mediterranean', value: 'mediterranean' },
    { label: 'vegan', value: 'vegan' },
    { label: 'dash', value: 'dash'},
    { lable: 'any', value: 'No preference'}
  ];

  const cuisineOptions = [
    { label: 'American', value: 'American' },
    { label: 'Japanese', value: 'Japanese' },
    { label: 'French', value: 'French' },
    { label: 'Mexican', value: 'Mexican' },
    { label: 'Indian', value: 'Indian' },
    { label: 'italian', value: 'italian' },
    { label: 'Chinese', value: 'Chinese' },
    { label: 'any', value: 'No preference'}
  ];

  useEffect(() => {
    const getGoal = async () => {
      const response = await get<{data: {weight: number, goal: number, dietary: string, cuisine: string, duration: number}}>('/preference')
      if(response){
        const { weight, goal, dietary, cuisine, duration } = response.data
        setCurrentWeight(String(weight))
        setTargetWeight(String(goal))
        setDietPreference(dietary)
        setCuisineType(cuisine)
        setDuration(String(duration))
        setEnableEditing(false)
      } else {
        setEnableEditing(true)
      }
    }
    getGoal()
  }, [])

  const handleSubmit = async () => {
    const response = await post('/preference/save', {
      weight: Number(currentWeight),
      goal: Number(targetWeight),
      dietary: dietPreference,
      cuisine: cuisineType,
      duration: Number(duration),
    })
    if(response){
      Alert.alert('Success', 'Your goals have been saved successfully');
      setEnableEditing(false)
    }
  }
 
  const handleSaveGoal = () => {
    if(!enableEditing) {
      setEnableEditing(true)
    } else {
      handleSubmit()
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + 20 }]} >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <ThemedText type="title" style={styles.header}>Set Your Goals</ThemedText>
          <ThemedText style={styles.subtitle}>Customize your health journey</ThemedText>
        </Animated.View>

        {/* Weight Goals Card */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.card}>
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons name="scale-bathroom" size={24} color="#6200EE" />
            <ThemedText style={styles.label}>Weight Goals</ThemedText>
          </View>
          <View style={styles.weightInputContainer}>
            <View style={styles.weightInput}>
              <ThemedText style={styles.weightLabel}>Current (kg)</ThemedText>
              <TextInput
                style={[styles.input, !enableEditing && styles.disabledInput]}
                keyboardType="numeric"
                placeholder="Current weight"
                value={currentWeight}
                onChangeText={setCurrentWeight}
                placeholderTextColor="#999"
                editable={enableEditing}
              />
            </View>
            <View style={styles.weightInput}>
              <ThemedText style={styles.weightLabel}>Target (kg)</ThemedText>
              <TextInput
                style={[styles.input, !enableEditing && styles.disabledInput]}
                keyboardType="numeric"
                placeholder="Target weight"
                value={targetWeight}
                onChangeText={setTargetWeight}
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </Animated.View>

        {/* Dietary Preferences Card */}
        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.card}>
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons name="food-apple" size={24} color="#6200EE" />
            <ThemedText style={styles.label}>Dietary Preferences</ThemedText>
          </View>
          <Pressable 
            style={[styles.selectButton, !enableEditing && styles.disabledButton]}
            onPress={() => enableEditing && setPreferenceModalVisible(true)}
          >
            <ThemedText style={styles.selectButtonText}>
              {dietPreference ? dietaryOptions.find(opt => opt.value === dietPreference)?.label : 'Select preference'}
            </ThemedText>
            <MaterialCommunityIcons name="chevron-down" size={24} color="#666" />
          </Pressable>
        </Animated.View>

        {/* Cuisine Type Card */}
        <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.card}>
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#6200EE" />
            <ThemedText style={styles.label}>Cuisine Type</ThemedText>
          </View>
          <Pressable 
            style={[styles.selectButton, !enableEditing && styles.disabledButton]}
            onPress={() => enableEditing && setCuisineModalVisible(true)}
          >
            <ThemedText style={styles.selectButtonText}>
              {cuisineType ? cuisineOptions.find(opt => opt.value === cuisineType)?.label : 'Select cuisine'}
            </ThemedText>
            <MaterialCommunityIcons name="chevron-down" size={24} color="#666" />
          </Pressable>
        </Animated.View>

        {/* Duration Card */}
        <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.card}>
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons name="calendar-clock" size={24} color="#6200EE" />
            <ThemedText style={styles.label}>Duration</ThemedText>
          </View>
          <View style={styles.durationContainer}>
            <TextInput
              style={[styles.input, !enableEditing && styles.disabledInput]}
              keyboardType="numeric"
              placeholder="Enter number of days"
              value={duration}
              onChangeText={setDuration}
              placeholderTextColor="#999"
              editable={enableEditing}
            />
            <ThemedText style={styles.durationUnit}>days</ThemedText>
          </View>
        </Animated.View>

        {/* Save Button */}
        <Animated.View entering={FadeInUp.delay(600).springify()}>
          <Pressable onPress={handleSaveGoal}>
            <LinearGradient
              colors={['#6200EE', '#9747FF']}
              style={styles.saveButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <ThemedText style={styles.buttonText}>{enableEditing ? 'Save Golal' : 'Update Goals'}</ThemedText>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* Add Modals */}
      <Modal
        isVisible={isPreferenceModalVisible}
        onBackdropPress={() => setPreferenceModalVisible(false)}
        style={styles.modal}
        backdropTransitionOutTiming={0}
      >
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalHeader}>Select Dietary Preference</ThemedText>
          {dietaryOptions.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.modalOption,
                dietPreference === option.value && styles.selectedOption
              ]}
              onPress={() => {
                setDietPreference(option.value);
                setPreferenceModalVisible(false);
              }}
            >
              <ThemedText style={[
                styles.modalOptionText,
                dietPreference === option.value && styles.selectedOptionText
              ]}>
                {option.label}
              </ThemedText>
              {dietPreference === option.value && (
                <MaterialCommunityIcons name="check" size={24} color="#6200EE" />
              )}
            </Pressable>
          ))}
        </View>
      </Modal>

      <Modal
        isVisible={isCuisineModalVisible}
        onBackdropPress={() => setCuisineModalVisible(false)}
        style={styles.modal}
        backdropTransitionOutTiming={0}
      >
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalHeader}>Select Cuisine Type</ThemedText>
          {cuisineOptions.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.modalOption,
                cuisineType === option.value && styles.selectedOption
              ]}
              onPress={() => {
                setCuisineType(option.value);
                setCuisineModalVisible(false);
              }}
            >
              <ThemedText style={[
                styles.modalOptionText,
                cuisineType === option.value && styles.selectedOptionText
              ]}>
                {option.label}
              </ThemedText>
              {cuisineType === option.value && (
                <MaterialCommunityIcons name="check" size={24} color="#6200EE" />
              )}
            </Pressable>
          ))}
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  input: {
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginTop: 8,
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 8,
  },
  picker: {
    height: 48,
  },
  switchCard: {
    paddingVertical: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  saveButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  selectButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#f0e5ff',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#6200EE',
    fontWeight: '600',
  },
  weightInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  weightInput: {
    flex: 1,
  },
  weightLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  durationUnit: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
    opacity: 0.7,
  },
});
