import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image, Alert } from 'react-native';
// @ts-ignore
import { BarChart } from 'react-native-chart-kit';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProject } from './GlobalContext'; // Import context

export default function ExperimentDetailScreen() {
  const { id } = useLocalSearchParams(); // รับ ID การทดลองที่ส่งมา
  const { activeProjectId, projects } = useProject();
  
  const activeProj = projects.find((p: any) => p.id === activeProjectId);
  // หาการทดลองที่ตรงกับ ID
  const experiment = activeProj?.experiments.find((e: any) => e.id === id);

  const [currentTab, setCurrentTab] = useState<'chart' | 'raw'>('chart');

  if (!experiment) return <View style={styles.center}><Text>Experiment not found</Text></View>;

  const { labels, countData, sizeData } = experiment.analysisResult || { labels:[], countData:[], sizeData:[] };

  return (
    <View style={styles.container}>
      {/* Header พร้อมปุ่มย้อนกลับ */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{experiment.cellLine}</Text>
        <TouchableOpacity onPress={() => Alert.alert("Edit", "Feature coming soon!")}>
            <Ionicons name="create-outline" size={24} color="#003366" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.metaBox}>
            <Text style={styles.metaText}>Target Drug: <Text style={{fontWeight:'bold'}}>{experiment.drug}</Text></Text>
            <Text style={styles.metaText}>Doses: {labels.length} variations</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tabBtn, currentTab === 'chart' && styles.tabActive]} onPress={()=>setCurrentTab('chart')}>
                <Text style={[styles.tabText, currentTab === 'chart' && styles.textActive]}>Analysis Charts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, currentTab === 'raw' && styles.tabActive]} onPress={()=>setCurrentTab('raw')}>
                <Text style={[styles.tabText, currentTab === 'raw' && styles.textActive]}>Raw Images</Text>
            </TouchableOpacity>
        </View>

        {currentTab === 'chart' ? (
            <View style={styles.content}>
                <Text style={styles.chartTitle}>Colony Count (% Control)</Text>
                {/* @ts-ignore */}
                <BarChart
                    data={{ labels, datasets: [{ data: countData }] }}
                    width={Dimensions.get("window").width - 40} height={220} fromZero yAxisSuffix="%"
                    chartConfig={{ ...chartConfig, fillShadowGradient: "#EF5350", fillShadowGradientOpacity: 1 }}
                    style={{borderRadius: 15, marginBottom: 20}}
                />
                <Text style={styles.chartTitle}>Avg. Colony Size (μm²)</Text>
                {/* @ts-ignore */}
                <BarChart
                    data={{ labels, datasets: [{ data: sizeData }] }}
                    width={Dimensions.get("window").width - 40} height={220} fromZero
                    chartConfig={{ ...chartConfig, fillShadowGradient: "#42A5F5", fillShadowGradientOpacity: 1 }}
                    style={{borderRadius: 15}}
                />
            </View>
        ) : (
            <View style={styles.content}>
                 <View style={styles.rawHeader}>
                    <Text style={{flex:1, fontWeight:'bold'}}>Image</Text>
                    <Text style={{flex:1, fontWeight:'bold', textAlign:'right'}}>Concentration</Text>
                 </View>
                 {experiment.doses.map((dose: any, i: number) => (
                     <View key={i} style={styles.rawRow}>
                         {dose.uri ? <Image source={{uri: dose.uri}} style={styles.thumb} /> : <View style={[styles.thumb, {backgroundColor:'#eee'}]} />}
                         <Text style={styles.doseVal}>{dose.concentration} μM</Text>
                     </View>
                 ))}
            </View>
        )}
        <View style={{height: 50}} />
      </ScrollView>
    </View>
  );
}

const chartConfig = { backgroundGradientFrom: "#fff", backgroundGradientTo: "#fff", color: (o=1) => `rgba(0,0,0,${o})`, labelColor: (o=1) => `rgba(0,0,0,0.5)`, barPercentage: 0.6 };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50, backgroundColor: '#fff', elevation: 2 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#003366' },
  metaBox: { padding: 20, backgroundColor: '#E3F2FD', margin: 20, borderRadius: 10 },
  metaText: { color: '#003366', marginBottom: 5 },
  tabContainer: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 20, backgroundColor: '#eee', borderRadius: 10, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#fff', elevation: 2 },
  tabText: { color: '#888', fontWeight: 'bold' },
  textActive: { color: '#003366' },
  content: { paddingHorizontal: 20 },
  chartTitle: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 10, textAlign: 'center' },
  rawHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 10, marginBottom: 10 },
  rawRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, backgroundColor: '#fff', padding: 10, borderRadius: 10 },
  thumb: { width: 60, height: 60, borderRadius: 8 },
  doseVal: { fontSize: 18, fontWeight: 'bold', color: '#333' }
});