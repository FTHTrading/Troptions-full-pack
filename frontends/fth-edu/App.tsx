import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { WalletProvider } from './src/wallet/WalletProvider';
import { voiceEngine } from './src/voice/VoiceEngine';
import { courseEngine } from './src/education/CourseEngine';
import { ammEngine } from './src/amm/AMMEngine';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import LearnScreen from './src/screens/LearnScreen';
import WalletScreen from './src/screens/WalletScreen';
import SwapScreen from './src/screens/SwapScreen';
import VoiceScreen from './src/screens/VoiceScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const queryClient = new QueryClient();

// Initialize voice engine
voiceEngine.initializeVoice();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0a0a0f',
          borderTopColor: '#1a1a2e',
        },
        tabBarActiveTintColor: '#00ff88',
        tabBarInactiveTintColor: '#666666',
        headerStyle: {
          backgroundColor: '#0a0a0f',
        },
        headerTintColor: '#ffffff',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Learn" 
        component={LearnScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>📚</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Voice" 
        component={VoiceScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 28 }}>🎙️</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>💼</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Swap" 
        component={SwapScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>🔄</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize systems
    async function init() {
      try {
        // Initialize AMM with demo pools
        await ammEngine.createPool('XRP', 'RLUSD', '10000', '10000', 3000);
        await ammEngine.createPool('SOL', 'PICK', '5000', '10000', 3000);
        
        console.log('✅ TROPTIONS EDU AI initialized');
        setIsReady(true);
      } catch (error) {
        console.error('Initialization error:', error);
      }
    }
    
    init();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0f' }}>
        <Text style={{ color: '#00ff88', fontSize: 20 }}>Loading TROPTIONS EDU AI...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <WalletProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={MainTabs} />
              </Stack.Navigator>
              <StatusBar style="light" />
            </NavigationContainer>
          </WalletProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
