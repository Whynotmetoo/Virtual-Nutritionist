import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const menuItems = [
  {
    id: 'personal',
    title: 'Personal Information',
    icon: 'account-edit',
    color: '#6200EE',
  },
  {
    id: 'security',
    title: 'Security Settings',
    icon: 'shield-lock',
    color: '#00BFA5',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'bell',
    color: '#FF6D00',
  },
  {
    id: 'privacy',
    title: 'Privacy Settings',
    icon: 'eye-settings',
    color: '#C51162',
  },
  {
    id: 'help',
    title: 'Help & Support',
    icon: 'help-circle',
    color: '#00C853',
  },
  {
    id: 'about',
    title: 'About App',
    icon: 'information',
    color: '#304FFE',
  },
  {
    id: 'logout',
    title: 'Logout',
    icon: 'logout',
    color: '#D50000',
  },
];

export default function AccountScreen() {
  const [userImage, setUserImage] = useState(null);
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.profileHeader}
        >
          <LinearGradient
            colors={['#6200EE', '#9747FF']}
            style={styles.headerGradient}
          >
            <View style={[styles.profileImageContainer, { paddingTop: insets.top }]}>
              {userImage ? (
                <Image source={{ uri: userImage }} style={styles.profileImage} />
              ) : (
                <MaterialCommunityIcons name="account-circle" size={80} color="#FFF" />
              )}
              <TouchableOpacity style={styles.editImageButton}>
                <MaterialCommunityIcons name="camera" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
            <ThemedText style={styles.userName}>John Doe</ThemedText>
            <ThemedText style={styles.userEmail}>john.doe@example.com</ThemedText>
          </LinearGradient>
        </Animated.View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Animated.View 
              key={item.id}
              entering={FadeInUp.delay(200 + index * 100).springify()}
            >
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  if (item.id === 'logout') {
                    router.replace('/');
                  }
                  // ... handle other menu items
                }}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                    <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
                  </View>
                  <ThemedText style={styles.menuItemText}>{item.title}</ThemedText>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileHeader: {
    marginBottom: 24,
  },
  headerGradient: {
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginTop: 16,
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#6200EE',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.8,
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
