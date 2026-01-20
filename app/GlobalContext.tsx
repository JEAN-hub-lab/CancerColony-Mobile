import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import * as API from './services/api';
import { onAuthStateChanged } from 'firebase/auth'; // เพิ่มบรรทัดนี้
import { auth } from './services/firebaseConfig';    // เพิ่มบรรทัดนี้

export type Dose = { id: string; concentration: string; uri: string | null; };

export type Experiment = {
  id: string;
  cellLine: string;
  drug: string;
  doses: Dose[];
  analysisResult?: {
    labels: string[];
    countData: number[];
    sizeData: number[];
  }
};

export type Project = {
  id: string;
  name: string;
  owner: string;
  createDate: string;
  experiments: Experiment[];
};

type ContextType = {
  isLoggedIn: boolean;
  currentUser: string;
  projects: Project[];
  activeProjectId: string | null;
  isLoading: boolean;
  login: (u: string, p: string) => Promise<boolean>;
  register: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
  createProject: (name: string) => Promise<void>;
  deleteProject: (id: string) => void;
  selectProject: (id: string) => void;
  addExperimentToActiveProject: (cellLine: string, drug: string, doses: Dose[]) => Promise<boolean>;
};

const ProjectContext = createContext<ContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // เริ่มต้นให้หมุนๆ รอเช็ค User ก่อน

  // ✅ แก้ไข: เพิ่มระบบเช็ค Login อัตโนมัติ
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        // ถ้าเจอ User ค้างอยู่
        console.log("Found user:", user.email);
        setCurrentUser(user.email);
        setIsLoggedIn(true);

        // ดึงข้อมูลโปรเจกต์มาเลย
        const projRes: any = await API.fetchProjectsAPI(user.email);
        if (projRes.status === 200) setProjects(projRes.data);
      } else {
        // ถ้าไม่เจอ
        setIsLoggedIn(false);
        setCurrentUser("");
        setProjects([]);
      }
      setIsLoading(false); // เลิกหมุน
    });

    return () => unsubscribe(); // ล้างค่าเมื่อปิดแอป
  }, []);

  const login = async (u: string, p: string) => {
    setIsLoading(true);
    const res: any = await API.loginAPI(u, p);
    setIsLoading(false);
    if (res.status === 200) {
      // ไม่ต้องทำอะไรมาก เดี๋ยว onAuthStateChanged ข้างบนมันทำงานให้เอง
      return true;
    }
    Alert.alert("Login Failed", res.message);
    return false;
  };

  const register = async (u: string, p: string) => {
    setIsLoading(true);
    const res = await API.registerAPI(u, p);
    setIsLoading(false);
    if (res.status === 200) return true;
    Alert.alert("Error", res.message || "Failed");
    return false;
  };

  const logout = () => {
    auth.signOut(); // สั่ง Firebase ให้ออกด้วย
    // State จะถูกเคลียร์เองโดย onAuthStateChanged
  };

  const createProject = async (name: string) => {
    if (!currentUser) return;
    setIsLoading(true);
    console.log("Creating project for:", currentUser); // Debug
    const res: any = await API.createProjectAPI(name, currentUser);
    setIsLoading(false);
    if (res.status === 200) {
      setProjects(prev => [res.data, ...prev]);
      Alert.alert("Success", "Project created!"); // แจ้งเตือนหน่อยจะได้รู้ว่าทำงาน
    } else {
      Alert.alert("Error", res.message);
    }
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) setActiveProjectId(null);
  };

  const selectProject = (id: string) => {
    setActiveProjectId(id);
  };

  const addExperimentToActiveProject = async (cellLine: string, drug: string, doses: Dose[]) => {
    if (!activeProjectId) return false;

    setIsLoading(true);
    const res: any = await API.analyzeExperimentAPI(activeProjectId, cellLine, drug, doses);
    setIsLoading(false);

    if (res.status === 200) {
      const newExperiment = res.data as Experiment;
      setProjects(prevProjects => prevProjects.map(p => {
        if (p.id === activeProjectId) {
            const exists = p.experiments ? p.experiments.find(e => e.id === newExperiment.id) : false;
            if (exists) return p;

            return {
              ...p,
              experiments: [newExperiment, ...(p.experiments || [])]
            };
        }
        return p;
      }));
      return true;
    }
    return false;
  };

  const myProjects = projects.filter(p => p.owner === currentUser);

  return (
    <ProjectContext.Provider value={{
      isLoggedIn, currentUser, projects: myProjects, activeProjectId, isLoading,
      login, register, logout, createProject, deleteProject, selectProject, addExperimentToActiveProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProject must be used within a ProjectProvider");
  return context;
};