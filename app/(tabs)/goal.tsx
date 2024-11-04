import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function GoalScreen() {
  // State variables
  const [weightGoal, setWeightGoal] = useState('');
  const [dietPreference, setDietPreference] = useState('');
  const [healthStatus, setHealthStatus] = useState('Healthy');
  const [isVegan, setIsVegan] = useState(false);

  const handleSaveGoal = () => {
    // Save the user's goals (can integrate with backend or state management here)
    console.log('Goal saved:', { weightGoal, dietPreference, healthStatus, isVegan });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Set Your Goals</ThemedText>

      {/* Weight Loss Goal */}
      <View style={styles.inputContainer}>
        <Text>Weight Loss Goal (kg):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter your weight goal"
          value={weightGoal}
          onChangeText={setWeightGoal}
        />
      </View>

      {/* Dietary Preferences */}
      <View style={styles.inputContainer}>
        <Text>Dietary Preferences:</Text>
        <Picker
          selectedValue={dietPreference}
          onValueChange={(itemValue) => setDietPreference(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select preference" value="" />
          <Picker.Item label="Low Carb" value="low_carb" />
          <Picker.Item label="High Protein" value="high_protein" />
          <Picker.Item label="Vegan" value="vegan" />
          <Picker.Item label="Vegetarian" value="vegetarian" />
        </Picker>
      </View>

      {/* Health Status */}
      <View style={styles.inputContainer}>
        <Text>Health Status:</Text>
        <Picker
          selectedValue={healthStatus}
          onValueChange={(itemValue) => setHealthStatus(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Healthy" value="healthy" />
          <Picker.Item label="Underweight" value="underweight" />
          <Picker.Item label="Overweight" value="overweight" />
          <Picker.Item label="Diabetic" value="diabetic" />
          <Picker.Item label="Hypertension" value="hypertension" />
        </Picker>
      </View>

      {/* Vegan Preference */}
      <View style={styles.switchContainer}>
        <Text>Are you following a Vegan diet?</Text>
        <Switch
          value={isVegan}
          onValueChange={(value) => setIsVegan(value)}
        />
      </View>

      {/* Save Button */}
      <Button title="Save Goal" onPress={handleSaveGoal} color="#6200EE" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  picker: {
    height: 40,
    marginTop: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
