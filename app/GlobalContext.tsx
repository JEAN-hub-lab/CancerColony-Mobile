import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import * as API from './services/api'; 

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

// ✅ แก้ ID เป็น string ให้หมด เพื่อรองรับ Firebase
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
  activeProjectId: string | null; // ✅ เป็น string
  isLoading: boolean;
  login: (u: string, p: string) => Promise<boolean>;
  register: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
  createProject: (name: string) => Promise<void>;
  deleteProject: (id: string) => void; // ✅ เป็น string
  selectProject: (id: string) => void; // ✅ เป็น string
  addExperimentToActiveProject: (cellLine: string, drug: string, doses: Dose[]) => Promise<boolean>;
};

const ProjectContext = createContext<ContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null); // ✅ เป็น string
  const [isLoading, setIsLoading] = useState(false);

  // Auto Login Check (ถ้าต้องการ)
  useEffect(() => {
    // ในอนาคตสามารถใส่ Logic เช็ค User ค้างไว้ตรงนี้ได้
  }, []);

  const login = async (u: string, p: string) => {
    setIsLoading(true);
    const res: any = await API.loginAPI(u, p);
    setIsLoading(false);
    if (res.status === 200) {
      setCurrentUser(res.data.u);
      setIsLoggedIn(true);
      // ดึงข้อมูล Project จาก Firebase
      const projRes: any = await API.fetchProjectsAPI(res.data.u);
      if (projRes.status === 200) setProjects(projRes.data);
      return true;
    }
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
    setIsLoggedIn(false);
    setCurrentUser("");
    setActiveProjectId(null);
    setProjects([]);
  };

  const createProject = async (name: string) => {
    setIsLoading(true);
    const res: any = await API.createProjectAPI(name, currentUser);
    setIsLoading(false);
    if (res.status === 200) {
      setProjects(prev => [res.data, ...prev]);
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
    // ส่งข้อมูลไป Firebase (api.ts ต้องรับ string ด้วยนะ)
    const res: any = await API.analyzeExperimentAPI(activeProjectId, cellLine, drug, doses);
    setIsLoading(false);

    if (res.status === 200) {
      const newExperiment = res.data as Experiment;
      setProjects(prevProjects => prevProjects.map(p => {
        // เช็คว่าใช่โปรเจกต์ที่กำลังเลือกอยู่ไหม (เทียบ string กับ string)
        if (p.id === activeProjectId) {
            // กันเหนียว: เช็คว่ามีการทดลองนี้อยู่แล้วหรือยัง
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