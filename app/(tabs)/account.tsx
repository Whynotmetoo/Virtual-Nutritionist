import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AccountScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="person-circle" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Account</ThemedText>
      </ThemedView>
      <ThemedText>Manage your account settings and preferences here.</ThemedText>

      <TouchableOpacity style={styles.option} onPress={() => {/* Navigate to Personal Information */}}>
        <ThemedText>Personal Information</ThemedText>
        <Ionicons name="chevron-forward" size={20} color="#808080" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => {/* Navigate to Security Settings */}}>
        <ThemedText>Security Settings</ThemedText>
        <Ionicons name="chevron-forward" size={20} color="#808080" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => {/* Navigate to Notifications */}}>
        <ThemedText>Notifications</ThemedText>
        <Ionicons name="chevron-forward" size={20} color="#808080" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => {/* Navigate to Payment Methods */}}>
        <ThemedText>Payment Methods</ThemedText>
        <Ionicons name="chevron-forward" size={20} color="#808080" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => {/* Navigate to Privacy Settings */}}>
        <ThemedText>Privacy Settings</ThemedText>
        <Ionicons name="chevron-forward" size={20} color="#808080" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => {/* Navigate to Account Deletion */}}>
        <ThemedText>Account Deletion</ThemedText>
        <Ionicons name="chevron-forward" size={20} color="#808080" />
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
});
