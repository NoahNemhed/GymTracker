import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

{/* HANDLE JWT TOKEN */}
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

{/* LOGIN & REGISER */}

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const registerUser = async (payload: RegisterPayload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

export const loginUser = async (payload: LoginPayload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};



{/* PROGRAMS */}
export type ProgramExercise = {
  exerciseId: string;
  targetSets: number;
  repRange: string;
  restSeconds: number;
  order: number;
  _id?: string;
};

export type ProgramDay = {
  name: string;
  focus: string;
  dayOrder: number;
  exercises: ProgramExercise[];
  _id?: string;
};

export type ProgramType = {
  _id: string;
  name: string;
  description?: string;
  goal: string;
  daysPerWeek: number;
  isActive: boolean;
  days: ProgramDay[];
};


export type CreateProgramPayload = {
  userId: number;
  name: string;
  description: string;
  goal: "hypertrophy" | "strength" | "endurance" | "general_fitness";
  daysPerWeek: number;
  isActive: boolean;
  days: {
    name: string;
    focus: string;
    dayOrder: number;
    exercises: {
      exerciseId: string;
      targetSets: number;
      repRange: string;
      restSeconds: number;
      order: number;
    }[];
  }[];
};


export const getPrograms = async (): Promise<ProgramType[]> => {
  const response = await api.get("/programs");
  return response.data; 
};

export const getProgramById = async (id: string): Promise<ProgramType> => {
  const response = await api.get(`/programs/${id}`);
  return response.data;
};


export const createProgram = async (
  payload: CreateProgramPayload
): Promise<ProgramType> => {
  const response = await api.post("/programs", payload);
  return response.data;
};

export const deleteProgram = async (id: string) => {
  const response = await api.delete(`/programs/${id}`);
  return response.data;
};