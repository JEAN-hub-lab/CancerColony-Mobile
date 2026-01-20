import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';
import * as API from './services/api'; 

export type Dose = { id: string; concentration: string; uri: string | null; };

// เพิ่ม type analysisResult
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

export type Project = { id: number; name: string; owner: string; createDate: string; experiments: Experiment[]; };

type ContextType = {
  isLoggedIn: boolean;
  currentUser: string;
  projects: Project[];
  activeProjectId: number | null;
  isLoading: boolean;
  login: (u: string, p: string) => Promise<boolean>;
  register: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
  createProject: (name: string) => Promise<void>;
  deleteProject: (id: number) => void;
  selectProject: (id: number) => void;
  addExperimentToActiveProject: (cellLine: string, drug: string, doses: Dose[]) => Promise<boolean>;
};

const ProjectContext = createContext<ContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (u: string, p: string) => {
    setIsLoading(true);
    const res: any = await API.loginAPI(u, p);
    setIsLoading(false);
    if (res.status === 200) {
      setCurrentUser(res.data.u);
      setIsLoggedIn(true);
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

  const deleteProject = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) setActiveProjectId(null);
  };

  const selectProject = (id: number) => {
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
          const exists = p.experiments.find(e => e.id === newExperiment.id);
          if (exists) return p;
          return { ...p, experiments: [newExperiment, ...p.experiments] };
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