import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import Animated, { withSpring, useAnimatedStyle  } from 'react-native-reanimated';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 6,
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          padding: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => {
            const animatedStyle = useAnimatedStyle(() => {
              return {
                transform: [{ scale: withSpring(focused ? 1.2 : 1) }],
                paddingBottom: 4
              };
            });

            return (
              <Animated.View style={animatedStyle}>
                <TabBarIcon 
                  name={focused ? 'chatbubble' : 'chatbubble-outline'} 
                  color={color} 
                  size={focused ? 24 : 22}
                />
              </Animated.View>
            );
          },
        }}
      />
       <Tabs.Screen
        name="goal"
        options={{
          title: 'Goal',
          tabBarIcon: ({ color, focused }) => {
            const animatedStyle = useAnimatedStyle(() => {
              return {
                transform: [{ scale: withSpring(focused ? 1.2 : 1) }],
                paddingBottom: 4
              };
            });

            return (
              <Animated.View style={animatedStyle}>
                <TabBarIcon 
                  name={focused ? 'flag' : 'flag-outline'} 
                  color={color} 
                  size={focused ? 24 : 22}
                />
              </Animated.View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => {
            const animatedStyle = useAnimatedStyle(() => {
              return {
                transform: [{ scale: withSpring(focused ? 1.2 : 1) }],
                paddingBottom: 4
              };
            });

            return (
              <Animated.View style={animatedStyle}>
                <TabBarIcon 
                  name={focused ? 'person' : 'person-outline'} 
                  color={color} 
                  size={focused ? 24 : 22}
                />
              </Animated.View>
            );
          },
        }}
      />
    </Tabs>
  );
}
