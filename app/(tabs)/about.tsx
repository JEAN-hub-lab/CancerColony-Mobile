import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// แก้ Path ตรงนี้เหมือนกัน (ใช้ .. จุด 2 อันพอ)
import { useProject } from '../GlobalContext'; 

export default function ProfileScreen() {
  const { user, isLoggedIn, login, logout, projects } = useProject();

  const handleAuth = () => {
    if (isLoggedIn) {
      logout();
      Alert.alert("System", "Logged out successfully");
    } else {
      login();
      Alert.alert("Welcome", "Logged in as Research Team A");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: isLoggedIn ? '#003366' : '#666' }]}>
        <View style={styles.avatar}><Ionicons name="person" size={40} color="#fff" /></View>
        <Text style={styles.name}>{isLoggedIn ? user : "Guest"}</Text>
        <Text style={styles.role}>{isLoggedIn ? "Admin" : "Viewer Mode"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MY WORKSPACE</Text>
        <View style={styles.statCard}>
            <Text style={styles.statNum}>{projects.length}</Text>
            <Text style={styles.statLabel}>Active Projects</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DEVELOPMENT TEAM</Text>
        <View style={styles.teamCard}>
          <View style={styles.member}><Ionicons name="person-outline" size={16} /><Text style={styles.memName}>Khajon Muenban</Text></View>
          <View style={styles.member}><Ionicons name="person-outline" size={16} /><Text style={styles.memName}>Printhorn Kongphol</Text></View>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.logoutBtn, { backgroundColor: isLoggedIn ? '#FF3B30' : '#4CD964' }]} 
        onPress={handleAuth}
      >
        <Text style={styles.logoutText}>{isLoggedIn ? "Log Out" : "Log In"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FA' },
  header: { padding: 40, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  role: { color: '#ddd' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#888', marginBottom: 10 },
  statCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', elevation: 2 },
  statNum: { fontSize: 30, fontWeight: 'bold', color: '#003366' },
  statLabel: { color: '#666' },
  teamCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12 },
  member: { flexDirection: 'row', marginBottom: 8, alignItems: 'center' },
  memName: { marginLeft: 10, color: '#444' },
  logoutBtn: { margin: 20, padding: 15, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold' }
});