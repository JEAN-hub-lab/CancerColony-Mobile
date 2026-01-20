import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useProject } from '../GlobalContext'; 

export default function HomeScreen() {
  const { currentUser, projects, createProject, deleteProject, selectProject, isLoggedIn } = useProject();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newProjName, setNewProjName] = useState('');

  const handleCreate = () => {
    if (!newProjName.trim()) return Alert.alert("Required", "Please enter project name");
    createProject(newProjName);
    setModalVisible(false);
    setNewProjName('');
  };

  // ✅ จุดที่แก้: เปลี่ยน id จาก number เป็น string ให้ตรงกับ Firebase
  const openProject = (id: string) => {
    selectProject(id);
    router.push("/results" as any);
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.centerAuth}>
        <Ionicons name="lock-closed-outline" size={60} color="#ccc" />
        <Text style={{fontSize: 18, color: '#666', marginTop: 20}}>Please Log In via Profile Tab</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push("/about" as any)}>
          <Text style={{color:'#fff', fontWeight:'bold'}}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Researcher</Text>
          <Text style={styles.user}>{currentUser || "Guest"}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>YOUR PROJECTS ({projects.length})</Text>
          
          {projects.length === 0 ? (
             <View style={styles.emptyState}>
               <Ionicons name="folder-open-outline" size={60} color="#DDE4ED" />
               <Text style={styles.emptyText}>No projects yet</Text>
               <Text style={styles.emptySub}>Create a new project folder to start.</Text>
             </View>
          ) : (
             projects.map((proj: any) => (
              <View key={proj.id} style={styles.projectWrapper}>
                <TouchableOpacity style={styles.activeProject} onPress={() => openProject(proj.id)}>
                   <View style={styles.projHeader}>
                     <Ionicons name="folder" size={24} color="#003366" />
                     <View style={{marginLeft: 10}}>
                        <Text style={styles.projName}>{proj.name}</Text>
                        <Text style={styles.projSub}>Created: {proj.createDate}</Text>
                        <Text style={styles.expCount}>{proj.experiments?.length || 0} Experiments inside</Text>
                     </View>
                   </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => Alert.alert("Delete", "Confirm?", [{text:"Cancel"}, {text:"Delete", style:'destructive', onPress:()=>deleteProject(proj.id)}])}>
                   <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Project Folder</Text>
            <Text style={styles.inputLabel}>Project Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Lung Cancer Research" value={newProjName} onChangeText={setNewProjName} />
            <View style={styles.modalBtns}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}><Text style={{color:'#666'}}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleCreate} style={styles.createBtn}><Text style={{color:'#fff', fontWeight:'bold'}}>Create Folder</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBFF' },
  centerAuth: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loginBtn: { marginTop: 20, backgroundColor: '#003366', padding: 10, paddingHorizontal: 20, borderRadius: 20 },
  header: { padding: 25, paddingTop: 70, backgroundColor: '#fff', elevation: 2 },
  welcome: { fontSize: 12, color: '#666', textTransform: 'uppercase' },
  user: { fontSize: 24, fontWeight: 'bold', color: '#003366' },
  content: { padding: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#888', marginBottom: 15 },
  emptyState: { alignItems: 'center', padding: 40, marginTop: 20 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555', marginTop: 10 },
  emptySub: { textAlign: 'center', color: '#999', marginTop: 5 },
  projectWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: '#fff', borderRadius: 12, padding: 5, elevation: 1 },
  activeProject: { flex: 1, padding: 15 },
  projHeader: { flexDirection: 'row', alignItems: 'center' },
  projName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  projSub: { fontSize: 12, color: '#999' },
  expCount: { fontSize: 10, color: '#4CD964', marginTop: 2, fontWeight: 'bold' },
  deleteBtn: { padding: 15 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#003366', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalCard: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#003366' },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 5 },
  input: { backgroundColor: '#F0F4F8', padding: 12, borderRadius: 8, marginBottom: 15 },
  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  cancelBtn: { padding: 10, marginRight: 15 },
  createBtn: { backgroundColor: '#003366', padding: 10, paddingHorizontal: 20, borderRadius: 8 }
});