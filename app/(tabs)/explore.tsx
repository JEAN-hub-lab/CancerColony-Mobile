import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  // จำลองข้อมูลผู้ใช้และโปรเจกต์ (Database Simulation)
  const [user, setUser] = useState({ name: "Research Team A", role: "Admin" });
  const [projects, setProjects] = useState([
    { id: 1, name: "Lung Cancer Study (A549)", status: "Active" },
    { id: 2, name: "Breast Cancer (MCF-7)", status: "Pending" }
  ]);
  const [activeProject, setActiveProject] = useState(1);

  const switchProject = (id: number) => {
    setActiveProject(id);
    Alert.alert("Project Switched", `Active workspace changed to Project ID: ${id}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>{user.role}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MY PROJECTS</Text>
        {projects.map((proj) => (
          <TouchableOpacity key={proj.id} style={[styles.projectCard, activeProject === proj.id && styles.activeCard]} onPress={() => switchProject(proj.id)}>
            <View>
              <Text style={[styles.projName, activeProject === proj.id && styles.activeText]}>{proj.name}</Text>
              <Text style={[styles.projStatus, activeProject === proj.id && styles.activeText]}>{proj.status}</Text>
            </View>
            {activeProject === proj.id && <Ionicons name="checkmark-circle" size={24} color="#fff" />}
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addBtn} onPress={() => Alert.alert("Feature", "Create New Project")}>
          <Ionicons name="add" size={20} color="#003366" />
          <Text style={styles.addText}>Create New Project</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DEVELOPMENT TEAM</Text>
        <View style={styles.teamCard}>
          <View style={styles.member}><Ionicons name="person-outline" size={16} /><Text style={styles.memName}>Khajon Muenban</Text></View>
          <View style={styles.member}><Ionicons name="person-outline" size={16} /><Text style={styles.memName}>Printhorn Kongphol</Text></View>
          {/* Kittisak removed as requested */}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert("System", "Logged out successfully")}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      <View style={{height: 40}}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FA' },
  header: { backgroundColor: '#003366', padding: 40, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  role: { color: '#A5C9FF' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#888', marginBottom: 10 },
  projectCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activeCard: { backgroundColor: '#003366' },
  projName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  projStatus: { fontSize: 12, color: '#666' },
  activeText: { color: '#fff' },
  addBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: '#003366', borderRadius: 12, borderStyle: 'dashed' },
  addText: { color: '#003366', fontWeight: 'bold', marginLeft: 5 },
  teamCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12 },
  member: { flexDirection: 'row', marginBottom: 8, alignItems: 'center' },
  memName: { marginLeft: 10, color: '#444' },
  logoutBtn: { margin: 20, backgroundColor: '#FF3B30', padding: 15, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold' }
});