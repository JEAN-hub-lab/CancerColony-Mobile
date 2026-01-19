import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#003366', 
      headerShown: false,
      tabBarStyle: { 
        height: Platform.OS === 'ios' ? 100 : 80, // เพิ่มความสูงหนีปุ่มโฮม
        paddingBottom: Platform.OS === 'ios' ? 35 : 20, // ดันไอคอนขึ้นมาอีก
        paddingTop: 10,
        backgroundColor: '#fff',
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
      }
    }}>
      <Tabs.Screen name="index" options={{ title: 'Project', tabBarIcon: ({ color }) => <Ionicons name="folder-open" size={24} color={color} /> }} />
      <Tabs.Screen name="upload" options={{ title: 'Lab Work', tabBarIcon: ({ color }) => <Ionicons name="flask" size={24} color={color} /> }} />
      <Tabs.Screen name="results" options={{ title: 'Report', tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} /> }} />
      <Tabs.Screen name="about" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={28} color={color} /> }} />
      
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}