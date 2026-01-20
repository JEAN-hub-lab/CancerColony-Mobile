import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, TextInput, FlatList, Vibration, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useProject } from '../GlobalContext';

export default function UploadScreen() {
  const { activeProjectId, addExperimentToActiveProject, projects, isLoading } = useProject();
  const activeProj = projects.find((p: any) => p.id === activeProjectId);

  const [cellLine, setCellLine] = useState('');
  const [drugName, setDrugName] = useState('');
  const [items, setItems] = useState([{ id: '1', concentration: '0', uri: null }]);

  const trigger = () => Vibration.vibrate(50);

  const pickImage = async (id: string, useCam: boolean) => {
    trigger();
    const opt: ImagePicker.ImagePickerOptions = { allowsEditing: true, quality: 1 };
    let res = useCam ? await ImagePicker.launchCameraAsync(opt) : await ImagePicker.launchImageLibraryAsync(opt);
    if (!res.canceled) setItems(items.map(i => i.id === id ? { ...i, uri: res.assets[0].uri as any } : i));
  };

  const onSaveExperiment = async () => {
    trigger();
    if (!activeProjectId) return Alert.alert("Error", "No project selected.");
    if (!drugName || !cellLine) return Alert.alert("Required", "Specify Cell Line and Drug Name.");
    
    // เปลี่ยนเป็น await เพราะต้องรอ API ตอบกลับ
    const success = await addExperimentToActiveProject(cellLine, drugName, items.map(i => ({...i, uri: i.uri, id: i.id, concentration: i.concentration || "0"})));
    
    if (success) {
      Alert.alert("Analysis Complete", "Data processed successfully by AI Server.", [
          { text: "View Results", onPress: () => router.push("/results" as any) }
      ]);
    }
  };

  if (!activeProjectId || !activeProj) return <View style={styles.center}><Text>Select Project First</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subTitle}>Adding Experiment to:</Text>
        <Text style={styles.title}>{activeProj.name}</Text>
        <View style={styles.inputRow}>
            <View style={{flex:1, marginRight:10}}>
                <Text style={styles.label}>CELL LINE</Text>
                <TextInput placeholder="e.g. A549" style={styles.input} value={cellLine} onChangeText={setCellLine} />
            </View>
            <View style={{flex:1}}>
                <Text style={styles.label}>DRUG</Text>
                <TextInput placeholder="e.g. Isalpinin" style={styles.input} value={drugName} onChangeText={setDrugName} />
            </View>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.doseLabel}>{index === 0 ? 'CONTROL' : `DOSE ${index}`}</Text>
              <TextInput style={styles.cons} placeholder="0" keyboardType="numeric" value={item.concentration} onChangeText={(v) => setItems(items.map(i => i.id === item.id ? {...i, concentration: v} : i))} />
              <Text style={styles.unit}>μM</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btn} onPress={() => pickImage(item.id, false)}><Ionicons name="images" size={20} color="#003366" /></TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => pickImage(item.id, true)}><Ionicons name="camera" size={20} color="#003366" /></TouchableOpacity>
            </View>
            {item.uri ? <Image source={{ uri: item.uri }} style={styles.img} /> : <View style={[styles.img, {backgroundColor:'#eee'}]} />}
          </View>
        )}
      />

      <View style={styles.footer}>
        {/* จุดที่แก้บั๊ก: เพิ่ม Math.random() ต่อท้าย id เพื่อไม่ให้ซ้ำกัน */}
        <TouchableOpacity style={styles.add} onPress={() => setItems([...items, { id: Date.now().toString() + Math.random().toString(), concentration: '', uri: null }])}>
          <Ionicons name="add" size={30} color="#003366" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.submit} onPress={onSaveExperiment} disabled={isLoading}>
          <Text style={styles.submitText}>{isLoading ? "Processing..." : "Analyze & Save"}</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{color:'#fff', marginTop:10, fontWeight:'bold'}}>Processing AI Analysis...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#fff', padding: 20, paddingTop: 50, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, elevation: 4 },
  subTitle: { fontSize: 12, color: '#888', textTransform: 'uppercase' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#003366', marginBottom: 15 },
  inputRow: { flexDirection: 'row' },
  label: { fontSize: 10, fontWeight: 'bold', color: '#888', marginBottom: 5 },
  input: { backgroundColor: '#F5F7FA', padding: 10, borderRadius: 8, fontSize: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  info: { width: 80, borderRightWidth: 1, borderColor: '#eee', marginRight: 10 },
  doseLabel: { fontSize: 10, color: '#999' },
  cons: { fontSize: 18, fontWeight: 'bold', color: '#003366' },
  unit: { fontSize: 12, color: '#888' },
  actions: { flex: 1, flexDirection: 'row' },
  btn: { width: 36, height: 36, backgroundColor: '#E3F2FD', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 5 },
  img: { width: 40, height: 40, borderRadius: 6, backgroundColor: '#eee' },
  footer: { flexDirection: 'row', padding: 20, paddingBottom: 30, backgroundColor: '#fff' },
  add: { width: 50, height: 50, backgroundColor: '#ECEFF1', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  submit: { flex: 1, backgroundColor: '#003366', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold' },
  loadingOverlay: { position: 'absolute', top:0, left:0, right:0, bottom:0, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 999 }
});