import { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';

export default function GoalScreen() {
  // State variables
  const [weightGoal, setWeightGoal] = useState('');
  const [dietPreference, setDietPreference] = useState('');
  const [healthStatus, setHealthStatus] = useState('Healthy');
  const [isVegan, setIsVegan] = useState(false);
  const insets = useSafeAreaInsets();
  const [isPreferenceModalVisible, setPreferenceModalVisible] = useState(false);
  const [isHealthModalVisible, setHealthModalVisible] = useState(false);

  const dietaryOptions = [
    { label: 'Low Carb', value: 'low_carb' },
    { label: 'High Protein', value: 'high_protein' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Vegetarian', value: 'vegetarian' },
  ];

  const healthOptions = [
    { label: 'Healthy', value: 'healthy' },
    { label: 'Underweight', value: 'underweight' },
    { label: 'Overweight', value: 'overweight' },
    { label: 'Diabetic', value: 'diabetic' },
    { label: 'Hypertension', value: 'hypertension' },
  ];

  const handleSaveGoal = () => {
    // Save the user's goals (can integrate with backend or state management here)
    console.log('Goal saved:', { weightGoal, dietPreference, healthStatus, isVegan });
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + 20 }]} >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <ThemedText type="title" style={styles.header}>Set Your Goals</ThemedText>
          <ThemedText style={styles.subtitle}>Customize your health journey</ThemedText>
        </Animated.View>

        {/* Weight Loss Goal Card */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.card}>
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons name="scale-bathroom" size={24} color="#6200EE" />
            <ThemedText style={styles.label}>Weight Goal (kg)</ThemedText>
          </View>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter your target weight"
            value={weightGoal}
            onChangeText={setWeightGoal}
            placeholderTextColor="#999"
          />
        </Animated.View>

        {/* Dietary Preferences Card */}
        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.card}>
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons name="food-apple" size={24} color="#6200EE" />
            <ThemedText style={styles.label}>Dietary Preferences</ThemedText>
          </View>
          <Pressable 
            style={styles.selectButton}
            onPress={() => setPreferenceModalVisible(true)}
          >
            <ThemedText style={styles.selectButtonText}>
              {dietPreference ? dietaryOptions.find(opt => opt.value === dietPreference)?.label : 'Select preference'}
            </ThemedText>
            <MaterialCommunityIcons name="chevron-down" size={24} color="#666" />
          </Pressable>
        </Animated.View>

        {/* Health Status Card */}
        <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.card}>
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons name="heart-pulse" size={24} color="#6200EE" />
            <ThemedText style={styles.label}>Health Status</ThemedText>
          </View>
          <Pressable 
            style={styles.selectButton}
            onPress={() => setHealthModalVisible(true)}
          >
            <ThemedText style={styles.selectButtonText}>
              {healthStatus ? healthOptions.find(opt => opt.value === healthStatus)?.label : 'Select status'}
            </ThemedText>
            <MaterialCommunityIcons name="chevron-down" size={24} color="#666" />
          </Pressable>
        </Animated.View>

        {/* Vegan Switch Card */}
        <Animated.View entering={FadeInUp.delay(500).springify()} style={[styles.card, styles.switchCard]}>
          <View style={styles.switchContainer}>
            <View style={styles.labelContainer}>
              <MaterialCommunityIcons name="leaf" size={24} color="#6200EE" />
              <ThemedText style={styles.switchLabel}>Vegan Diet</ThemedText>
            </View>
            <Switch
              value={isVegan}
              onValueChange={setIsVegan}
              trackColor={{ false: '#767577', true: '#a668ee' }}
              thumbColor={isVegan ? '#6200EE' : '#f4f3f4'}
            />
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
              <ThemedText style={styles.buttonText}>Save Goals</ThemedText>
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

      {/* Similar Modal for Health Status */}
      <Modal
        isVisible={isHealthModalVisible}
        onBackdropPress={() => setHealthModalVisible(false)}
        style={styles.modal}
        backdropTransitionOutTiming={0}
      >
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalHeader}>Select Health Status</ThemedText>
          {healthOptions.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.modalOption,
                healthStatus === option.value && styles.selectedOption
              ]}
              onPress={() => {
                setHealthStatus(option.value);
                setHealthModalVisible(false);
              }}
            >
              <ThemedText style={[
                styles.modalOptionText,
                healthStatus === option.value && styles.selectedOptionText
              ]}>
                {option.label}
              </ThemedText>
              {healthStatus === option.value && (
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
});
