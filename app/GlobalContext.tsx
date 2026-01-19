import React, { createContext, useState, useContext } from 'react';

// กำหนดหน้าตาข้อมูล
type Project = {
  id: number;
  name: string;
  drug: string;
  status: string;
  date: string;
};

type ContextType = {
  isLoggedIn: boolean;
  user: string;
  projects: Project[];
  login: () => void;
  logout: () => void;
  addProject: (name: string, drug: string) => void;
};

const ProjectContext = createContext<ContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // เริ่มต้นยังไม่ Login
  const [user, setUser] = useState("Guest");
  
  // ข้อมูลโปรเจกต์เริ่มต้น
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: "Lung Cancer Study (A549)", drug: "Isalpinin", status: "In Progress", date: "Just now" }
  ]);

  const login = () => {
    setIsLoggedIn(true);
    setUser("Research Team A");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser("Guest");
  };

  const addProject = (name: string, drug: string) => {
    const newProj = {
      id: Date.now(),
      name: name || "New Project",
      drug: drug || "Unknown",
      status: "Active",
      date: "New"
    };
    setProjects([newProj, ...projects]); // เอาอันใหม่ขึ้นก่อน
  };

  return (
    <ProjectContext.Provider value={{ isLoggedIn, user, projects, login, logout, addProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProject must be used within a ProjectProvider");
  return context;
};