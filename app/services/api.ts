import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';

export const loginAPI = async (u: string, p: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, u, p);
    return { status: 200, data: { u: userCredential.user.email } };
  } catch (error: any) {
    return { status: 400, message: "Login failed: " + error.message };
  }
};

export const registerAPI = async (u: string, p: string) => {
  try {
    await createUserWithEmailAndPassword(auth, u, p);
    return { status: 200, data: { u } };
  } catch (error: any) {
    return { status: 400, message: "Register failed: " + error.message };
  }
};

export const fetchProjectsAPI = async (username: string) => {
  try {
    const q = query(collection(db, "projects"), where("owner", "==", username));
    const querySnapshot = await getDocs(q);
    const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { status: 200, data: projects };
  } catch (error) {
    console.log(error);
    return { status: 500, data: [] };
  }
};

export const createProjectAPI = async (name: string, owner: string) => {
  try {
    const newProj = {
      name,
      owner,
      createDate: new Date().toISOString().split('T')[0],
      experiments: []
    };
    const docRef = await addDoc(collection(db, "projects"), newProj);
    return { status: 200, data: { id: docRef.id, ...newProj } };
  } catch (error) {
    return { status: 500, message: "Error creating project" };
  }
};

// Logic คำนวณ (เหมือนเดิม)
const mockAIAnalysis = (drug: string, doses: any[]) => {
    const labels = doses.map((d: any) => d.concentration);
    const isTarget = drug.toLowerCase().includes('isal');
    const countData = isTarget ? [100, 75, 50, 25].slice(0, labels.length) : labels.map(()=>100);
    const sizeData = isTarget ? [400, 300, 200, 100].slice(0, labels.length) : labels.map(()=>400);
    return { labels, countData, sizeData };
};

// ✅ จุดสำคัญที่แก้: projectId ต้องเป็น string
export const analyzeExperimentAPI = async (projectId: string, cellLine: string, drug: string, doses: any[]) => {
  try {
    const analysisResult = mockAIAnalysis(drug, doses);
    const newExperiment = {
      id: Date.now().toString(),
      cellLine,
      drug,
      doses, 
      analysisResult
    };

    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, {
      experiments: arrayUnion(newExperiment)
    });

    return { status: 200, data: newExperiment };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Save failed" };
  }
};