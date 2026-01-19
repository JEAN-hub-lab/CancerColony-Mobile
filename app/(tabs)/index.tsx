import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
// แก้ Path ตรงนี้ (ใช้ .. จุด 2 อันพอ)
import { useProject } from '../GlobalContext'; 

export default function HomeScreen() {
  const { user, projects, addProject, isLoggedIn } = useProject();

  const handleCreate = () => {
    addProject("New Cancer Study", "Unknown Drug");
    Alert.alert("Success", "New Project Workspace Created!");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome back,</Text>
        <Text style={styles.user}>{isLoggedIn ? user : "Guest User"}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>ACTIVE PROJECTS ({projects.length})</Text>
        
        {/* แก้ตัวแดง: ใส่ : any หลัง proj */}
        {projects.map((proj: any, index: number) => (
          <TouchableOpacity 
            key={proj.id} 
            style={[styles.activeProject, { marginBottom: 15, backgroundColor: index === 0 ? '#003366' : '#fff' }]} 
            onPress={() => router.push("/upload" as any)}
          >
             <View style={styles.projHeader}>
               <Ionicons name="folder-open" size={24} color={index === 0 ? '#fff' : '#003366'} />
               <Text style={[styles.projName, { color: index === 0 ? '#fff' : '#333' }]}>{proj.name}</Text>
             </View>
             <Text style={{ color: index === 0 ? '#A5C9FF' : '#666', marginBottom: 15 }}>Target: {proj.drug} | {proj.status}</Text>
             <View style={styles.progressRow}>
               <Text style={{ color: index === 0 ? '#ccc' : '#999', fontSize: 12 }}>Updated: {proj.date}</Text>
               <View style={styles.badge}><Text style={styles.badgeText}>OPEN</Text></View>
             </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.newBtn} onPress={handleCreate}>
           <Ionicons name="add-circle" size={24} color="#003366" />
           <Text style={styles.newBtnText}>Create New Project</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBFF' },
  header: { padding: 25, paddingTop: 70 },
  welcome: { fontSize: 14, color: '#666' },
  user: { fontSize: 24, fontWeight: 'bold', color: '#003366' },
  content: { padding: 20, paddingTop: 0 },
  label: { fontSize: 12, fontWeight: '900', color: '#B0BEC5', marginBottom: 10, marginTop: 10 },
  activeProject: { borderRadius: 20, padding: 20, elevation: 4 },
  projHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  projName: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 15 },
  badge: { backgroundColor: '#4CD964', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  newBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 10, backgroundColor: '#E3F2FD', borderRadius: 15 },
  newBtnText: { color: '#003366', fontWeight: 'bold', marginLeft: 10, fontSize: 16 }
});