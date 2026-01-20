import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProject } from '../GlobalContext'; 

export default function ResultsScreen() {
  const { activeProjectId, projects } = useProject();
  const activeProj = projects.find((p: any) => p.id === activeProjectId);

  if (!activeProjectId || !activeProj) {
    return (
      <View style={styles.center}>
         <Text style={{color:'#666', marginBottom: 20}}>No active project selected.</Text>
         <TouchableOpacity style={styles.btnOutline} onPress={()=>router.push("/" as any)}>
            <Text style={{color:'#003366', fontWeight:'bold'}}>Back to Projects</Text>
         </TouchableOpacity>
      </View>
    );
  }

  // หน้าจอว่าง ถ้ายังไม่มีการทดลอง
  if (activeProj.experiments.length === 0) {
    return (
      <View style={styles.center}>
         <Ionicons name="flask-outline" size={80} color="#ddd" />
         <Text style={styles.emptyTitle}>{activeProj.name}</Text>
         <Text style={styles.emptySub}>No experiments yet.</Text>
         <TouchableOpacity style={styles.addBtn} onPress={() => router.push("/upload" as any)}>
            <Text style={styles.addBtnText}>+ Add First Experiment</Text>
         </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Project Dashboard</Text>
      <View style={styles.projBanner}>
          <Text style={styles.projName}>{activeProj.name}</Text>
          <Text style={styles.projMeta}>Total Experiments: {activeProj.experiments.length}</Text>
      </View>

      <Text style={styles.sectionLabel}>EXPERIMENTS LIST</Text>

      {/* วนลูปโชว์เป็นรายการ (Card List) แทนกราฟ */}
      {activeProj.experiments.map((exp: any, index: number) => (
        <TouchableOpacity 
            key={`${exp.id}-${index}`} 
            style={styles.expCard}
            // กดแล้วไปหน้า Detail พร้อมส่ง ID ไป
            onPress={() => router.push({ pathname: "/experiment-detail", params: { id: exp.id } } as any)}
        >
            <View style={styles.cardLeft}>
                <View style={styles.iconBox}>
                    <Text style={styles.iconText}>#{activeProj.experiments.length - index}</Text>
                </View>
                <View>
                    <Text style={styles.expTitle}>{exp.cellLine}</Text>
                    <Text style={styles.expSub}>{exp.drug} • {exp.doses.length} Doses</Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.addBtnFooter} onPress={() => router.push("/upload" as any)}>
         <Ionicons name="add-circle" size={24} color="#003366" />
         <Text style={styles.addBtnTextDark}>New Experiment</Text>
      </TouchableOpacity>
      <View style={{height: 50}}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FA', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#003366', marginTop: 20, textAlign: 'center' },
  emptySub: { color: '#999', marginVertical: 10 },
  addBtn: { backgroundColor: '#003366', padding: 12, borderRadius: 20, marginTop: 10 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  btnOutline: { padding: 10, borderWidth: 1, borderColor: '#003366', borderRadius: 20 },
  
  header: { fontSize: 12, color: '#999', marginTop: 30, textTransform: 'uppercase', fontWeight: 'bold' },
  projBanner: { marginBottom: 20 },
  projName: { fontSize: 26, fontWeight: 'bold', color: '#003366' },
  projMeta: { fontSize: 14, color: '#666' },
  
  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: '#aaa', marginBottom: 10 },
  
  // Card Style ใหม่ (แบบ List)
  expCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 2 },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  iconText: { color: '#003366', fontWeight: 'bold' },
  expTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  expSub: { fontSize: 12, color: '#888' },

  addBtnFooter: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginTop: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: '#003366' },
  addBtnTextDark: { color: '#003366', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
});