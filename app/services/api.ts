// app/services/api.ts

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const generateID = () => Date.now().toString() + Math.floor(Math.random() * 100000).toString();

let MOCK_DB = {
  users: [{ u: 'admin', p: '1234', name: 'Research Team A' }],
  projects: [] as any[]
};

export const loginAPI = async (u: string, p: string) => {
  await delay(500);
  const user = MOCK_DB.users.find(x => x.u === u && x.p === p);
  if (user) return { status: 200, data: user };
  return { status: 401, message: "Invalid credentials" };
};

export const registerAPI = async (u: string, p: string) => {
  await delay(500);
  if (MOCK_DB.users.find(x => x.u === u)) return { status: 400, message: "User exists" };
  const newUser = { u, p, name: u };
  MOCK_DB.users.push(newUser);
  return { status: 200, data: newUser };
};

export const fetchProjectsAPI = async (username: string) => {
  await delay(300);
  const myProjs = MOCK_DB.projects.filter(p => p.owner === username);
  return { status: 200, data: myProjs };
};

export const createProjectAPI = async (name: string, owner: string) => {
  await delay(500);
  const newProj = {
    id: parseInt(generateID()),
    name,
    owner,
    createDate: new Date().toISOString().split('T')[0],
    experiments: []
  };
  MOCK_DB.projects.unshift(newProj);
  return { status: 200, data: newProj };
};

// --- จุดที่ย้าย Logic มา ---
// จำลอง AI คำนวณผลลัพธ์กราฟที่นี่เลย
const mockAIAnalysis = (drug: string, doses: any[]) => {
  const labels = doses.map(d => d.concentration);
  // Logic เดิม: ถ้าชื่อยามี 'isal' กราฟลดลง
  const isTarget = drug.toLowerCase().includes('isal');

  const countData = isTarget 
      ? [100, 75, 55, 35, 15].slice(0, labels.length) // ลดลงจริง
      : labels.map((_, i) => Math.max(0, 100 - (i * 5))); // ลดลงนิดหน่อย (สุ่ม)

  const sizeData = isTarget
      ? [450, 320, 210, 150, 100].slice(0, labels.length)
      : labels.map((_, i) => Math.max(0, 450 - (i * 10)));

  return { labels, countData, sizeData };
};

export const analyzeExperimentAPI = async (projectId: number, cellLine: string, drug: string, doses: any[]) => {
  await delay(1500); // รอ AI คิด
  
  // ให้ Server (จำลอง) เป็นคนคิดเลขกราฟ
  const analysisResult = mockAIAnalysis(drug, doses);

  const newExperiment = {
    id: generateID(),
    cellLine,
    drug,
    doses,
    analysisResult // แนบผลลัพธ์กลับไปให้หน้าบ้าน
  };

  const projIndex = MOCK_DB.projects.findIndex(p => p.id === projectId);
  if (projIndex >= 0) {
    MOCK_DB.projects[projIndex].experiments.unshift(newExperiment);
  }

  return { status: 200, data: newExperiment };
};