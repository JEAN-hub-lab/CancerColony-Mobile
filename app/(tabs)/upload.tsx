import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, TextInput, FlatList, Vibration } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function UploadScreen() {
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

  const removeDose = (id: string) => {
    if (items.length === 1) return Alert.alert("Cannot Delete", "Must have at least one control group.");
    setItems(items.filter(i => i.id !== id));
  };

  const onAnalyze = () => {
    trigger();
    if (!drugName || !cellLine) return Alert.alert("Missing Info", "Please specify Cell Line and Drug Name first.");
    
    // Safety check: Ensure concentrations are numbers (or assume 0)
    const safeItems = items.map(i => ({
      ...i,
      concentration: i.concentration || "0"
    }));

    router.push({ 
      pathname: "/results" as any, 
      params: { 
        projectTitle: "Current Project",
        cellLine, 
        drugName, 
        doses: JSON.stringify(safeItems) // ส่งข้อมูลที่ปลอดภัยแล้ว
      } 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Experiment Setup</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>1. CELL LINE</Text>
          <TextInput placeholder="e.g., A549" style={styles.input} value={cellLine} onChangeText={setCellLine} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>2. DRUG / COMPOUND</Text>
          <TextInput placeholder="e.g., Isalpinin" style={styles.input} value={drugName} onChangeText={setDrugName} />
        </View>
      </View>

      <Text style={styles.listHeader}>3. CONCENTRATIONS & IMAGES</Text>
      
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.doseLabel}>{index === 0 ? 'CONTROL' : `DOSE #${index}`}</Text>
              <TextInput 
                style={styles.cons} 
                placeholder="0" 
                keyboardType="numeric" 
                value={item.concentration}
                onChangeText={(v) => setItems(items.map(i => i.id === item.id ? {...i, concentration: v} : i))} 
              />
              <Text style={styles.unit}>μM</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btn} onPress={() => pickImage(item.id, false)}><Ionicons name="images" size={20} color="#003366" /></TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => pickImage(item.id, true)}><Ionicons name="camera" size={20} color="#003366" /></TouchableOpacity>
              {index !== 0 && (
                <TouchableOpacity style={[styles.btn, styles.delBtn]} onPress={() => removeDose(item.id)}>
                  <Ionicons name="trash" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
            {item.uri && <Image source={{ uri: item.uri }} style={styles.img} />}
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.add} onPress={() => setItems([...items, { id: Date.now().toString(), concentration: '', uri: null }])}>
          <Ionicons name="add" size={30} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.submit} onPress={onAnalyze}>
          <Text style={styles.submitText}>Analyze Project</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  header: { backgroundColor: '#fff', padding: 20, paddingTop: 50, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, elevation: 4 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#003366', marginBottom: 15 },
  inputGroup: { marginBottom: 10 },
  label: { fontSize: 10, fontWeight: 'bold', color: '#888', marginBottom: 5 },
  input: { backgroundColor: '#F5F7FA', padding: 10, borderRadius: 8, fontSize: 16, color: '#333' },
  listHeader: { margin: 20, marginBottom: 10, fontWeight: 'bold', color: '#555' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  info: { width: 90, flexDirection: 'row', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#eee', marginRight: 10 },
  doseLabel: { position: 'absolute', top: -5, left: 0, fontSize: 8, color: '#999', fontWeight: 'bold' },
  cons: { fontSize: 18, fontWeight: 'bold', color: '#003366', width: 50, marginTop: 5 },
  unit: { fontSize: 12, color: '#888', marginTop: 8 },
  actions: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  btn: { width: 36, height: 36, backgroundColor: '#E3F2FD', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 6 },
  delBtn: { backgroundColor: '#FF3B30' },
  img: { width: 40, height: 40, borderRadius: 6, marginLeft: 'auto' },
  footer: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', padding: 20, paddingBottom: 30, backgroundColor: 'rgba(255,255,255,0.9)' },
  add: { width: 50, height: 50, backgroundColor: '#ECEFF1', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  submit: { flex: 1, backgroundColor: '#003366', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});