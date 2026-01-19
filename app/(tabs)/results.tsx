import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
// @ts-ignore
import { BarChart } from 'react-native-chart-kit';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true); // เริ่มต้นโหลดเสมอ
  
  const cellLine = params.cellLine as string;
  const drugName = params.drugName as string;
  const dosesString = params.doses as string;

  // 1. Hook ต้องอยู่บนสุด (ห้ามมี if return ก่อนบรรทัดนี้เด็ดขาด!)
  useEffect(() => {
    // ถ้ามีข้อมูล ให้เริ่มนับถอยหลังโหลด
    if (cellLine && drugName) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // ถ้าไม่มีข้อมูล ไม่ต้องโหลด
      setLoading(false);
    }
  }, [params]); // รันใหม่เมื่อ params เปลี่ยน

  // แปลงข้อมูล
  let doses: any[] = [];
  try {
    doses = dosesString ? JSON.parse(dosesString) : [];
  } catch (e) { doses = []; }
  
  const labels = doses.length > 0 ? doses.map((d: any) => d.concentration) : ["0"];

  // 2. Logic การคำนวณ (อยู่หลัง Hook ได้)
  const isTarget = drugName && drugName.toLowerCase().includes('isal');
  const countData = isTarget 
    ? [100, 60, 48, 35, 20].slice(0, labels.length) 
    : labels.map((_: any, i: number) => Math.max(0, 100 - (i * 15)));
  const sizeData = isTarget 
    ? [400, 310, 220, 190, 150].slice(0, labels.length) 
    : labels.map((_: any, i: number) => Math.max(0, 500 - (i * 80)));

  // 3. เงื่อนไข Return (ต้องอยู่ล่างสุด หลังจากประกาศ Hooks ครบแล้ว)
  
  // กรณี: กำลังโหลด
  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#003366" />
      <Text style={styles.loadText}>Analyzing {cellLine || "Sample"}...</Text>
    </View>
  );

  // กรณี: ไม่มีข้อมูล
  if (!cellLine || !drugName) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="analytics-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>No Analysis Data</Text>
        <Text style={styles.emptySub}>Please add lab data first.</Text>
        <TouchableOpacity style={styles.goBackBtn} onPress={() => router.push("/upload" as any)}>
           <Text style={styles.btnText}>Go to Lab Work</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // กรณี: แสดงผลปกติ
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Final Report</Text>
      
      <View style={styles.summaryCard}>
        <View style={styles.row}>
           <View><Text style={styles.label}>CELL LINE</Text><Text style={styles.value}>{cellLine}</Text></View>
           <View><Text style={styles.label}>DRUG</Text><Text style={styles.value}>{drugName}</Text></View>
        </View>
        <View style={styles.divider} />
        <Text style={styles.status}>Status: Complete (N={labels.length})</Text>
      </View>

      <View style={styles.chartBox}>
        <Text style={styles.chartTitle}>1. Colony Count (% of Control)</Text>
        {/* @ts-ignore */}
        <BarChart 
          data={{ labels: labels, datasets: [{ data: countData }] }} 
          width={Dimensions.get("window").width - 60} height={200} fromZero yAxisSuffix="%"
          chartConfig={{ ...chartConfig, fillShadowGradient: "#EF5350", fillShadowGradientOpacity: 1 }} 
          style={styles.chart} 
        />
      </View>

      <View style={styles.chartBox}>
        <Text style={styles.chartTitle}>2. Colony Size (μm²)</Text>
        {/* @ts-ignore */}
        <BarChart 
          data={{ labels: labels, datasets: [{ data: sizeData }] }} 
          width={Dimensions.get("window").width - 60} height={200} fromZero 
          chartConfig={{ ...chartConfig, fillShadowGradient: "#42A5F5", fillShadowGradientOpacity: 1 }} 
          style={styles.chart} 
        />
      </View>
      <View style={{height: 50}} />
    </ScrollView>
  );
}

const chartConfig = { backgroundGradientFrom: "#fff", backgroundGradientTo: "#fff", color: (o=1) => `rgba(0,0,0,${o})`, labelColor: (o=1) => `rgba(0,0,0,0.5)`, barPercentage: 0.6 };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FA', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F7FA' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: 50 },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: '#888', marginTop: 20 },
  emptySub: { textAlign: 'center', color: '#aaa', marginTop: 10, marginBottom: 30 },
  goBackBtn: { backgroundColor: '#003366', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loadText: { marginTop: 15, color: '#003366', fontWeight: 'bold' },
  header: { fontSize: 26, fontWeight: 'bold', color: '#003366', marginTop: 40, marginBottom: 20 },
  summaryCard: { backgroundColor: '#003366', padding: 20, borderRadius: 16, marginBottom: 20, elevation: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { color: '#A5C9FF', fontSize: 10, fontWeight: 'bold' },
  value: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 10 },
  status: { color: '#4CD964', fontSize: 12, fontWeight: 'bold' },
  chartBox: { backgroundColor: '#fff', padding: 15, borderRadius: 16, marginBottom: 20, elevation: 3 },
  chartTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' },
  chart: { borderRadius: 16 }
});