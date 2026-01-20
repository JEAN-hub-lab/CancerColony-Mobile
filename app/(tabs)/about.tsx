import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProject } from '../GlobalContext'; // Import 2 จุด

export default function ProfileScreen() {
  const { currentUser, isLoggedIn, login, register, logout, projects, isLoading } = useProject();
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // แก้: ใส่ async ตรงนี้
  const handleAuth = async () => {
    if (!username || !password) return Alert.alert("Error", "Please fill in all fields");

    if (isRegisterMode) {
      // แก้: ใส่ await รอผล Register
      const success = await register(username, password);
      if (success) {
        Alert.alert("Success", "Account created! Please log in.");
        setIsRegisterMode(false);
      }
    } else {
      // แก้: ใส่ await รอผล Login
      const success = await login(username, password);
      if (success) {
        setUsername('');
        setPassword('');
      } else {
        Alert.alert("Failed", "Invalid username or password");
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.authContainer}>
        <View style={styles.logoBox}>
          <Ionicons name="medical" size={60} color="#fff" />
          <Text style={styles.appTitle}>CancerColony AI</Text>
        </View>

        <View style={styles.formBox}>
          <Text style={styles.formTitle}>{isRegisterMode ? "Create Account" : "Welcome Back"}</Text>
          
          <TextInput 
            placeholder="Username" 
            style={styles.input} 
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput 
            placeholder="Password" 
            style={styles.input} 
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.primaryBtn} onPress={handleAuth} disabled={isLoading}>
            {isLoading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.btnText}>{isRegisterMode ? "Sign Up" : "Log In"}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsRegisterMode(!isRegisterMode)} style={{marginTop: 15}}>
            <Text style={styles.linkText}>
              {isRegisterMode ? "Already have an account? Log In" : "New user? Create an Account"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
           <Text style={{fontSize:30, fontWeight:'bold', color:'#003366'}}>
             {currentUser.charAt(0).toUpperCase()}
           </Text>
        </View>
        <Text style={styles.name}>{currentUser}</Text>
        <Text style={styles.role}>Researcher</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
           <Text style={styles.statNum}>{projects.length}</Text>
           <Text style={styles.statLabel}>My Projects</Text>
        </View>
        <View style={styles.statBox}>
           <Text style={styles.statNum}>Active</Text>
           <Text style={styles.statLabel}>Status</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => {
            Alert.alert("Logout", "Are you sure?", [
              { text: "Cancel" }, { text: "Log Out", style: 'destructive', onPress: logout }
            ])
        }}>
           <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
           <Text style={[styles.menuText, {color: '#FF3B30'}]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  authContainer: { flex: 1, backgroundColor: '#003366', justifyContent: 'center', padding: 20 },
  logoBox: { alignItems: 'center', marginBottom: 40 },
  appTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  formBox: { backgroundColor: '#fff', padding: 25, borderRadius: 20, elevation: 5 },
  formTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#F0F4F8', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  primaryBtn: { backgroundColor: '#003366', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkText: { color: '#003366', textAlign: 'center', fontWeight: '600' },
  container: { flex: 1, backgroundColor: '#F4F7FA' },
  header: { alignItems: 'center', padding: 40, backgroundColor: '#fff' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F0F4F8', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  role: { color: '#888', marginTop: 5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: '#fff', marginTop: 1 },
  statBox: { alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: 'bold', color: '#003366' },
  statLabel: { fontSize: 12, color: '#999' },
  section: { marginTop: 20, backgroundColor: '#fff', padding: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#ccc', marginBottom: 15 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuText: { fontSize: 16, marginLeft: 15, fontWeight: '500' }
});