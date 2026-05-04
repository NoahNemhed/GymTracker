import axios from "axios";

// Base API url used for all requests
const API_BASE_URL = "http://localhost:5000/api";


// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// HANDLE JWT TOKEN
// Automatically attach JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// AUTH: Login & Register payload types
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



// PROGRAM TYPES: Structure of programs, days, and exercises
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

// Payload used when creating a new program
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

// Payload used when updating a program (all fields optional)
export type UpdateProgramPayload = Partial<{
  name: string;
  description: string;
  goal: "hypertrophy" | "strength" | "endurance" | "general_fitness";
  daysPerWeek: number;
  isActive: boolean;
  days: ProgramType["days"];
}>;


// Fetch all programs for the current user
export const getPrograms = async (): Promise<ProgramType[]> => {
  const response = await api.get("/programs");
  return response.data; 
};

// Fetch a single program by id
export const getProgramById = async (id: string): Promise<ProgramType> => {
  const response = await api.get(`/programs/${id}`);
  return response.data;
};

// Create a new program
export const createProgram = async (
  payload: CreateProgramPayload
): Promise<ProgramType> => {
  const response = await api.post("/programs", payload);
  return response.data;
};

// Delete a program
export const deleteProgram = async (id: string) => {
  const response = await api.delete(`/programs/${id}`);
  return response.data;
};

// Set one program as active
export const setActiveProgram = async (id: string) => {
  const response = await api.patch(`/programs/${id}/activate`);
  return response.data;
};


// Update an existing program (used for adding/removing exercises etc.)
export const updateProgram = async (
  id: string,
  payload: UpdateProgramPayload
): Promise<ProgramType> => {
  const response = await api.put(`/programs/${id}`, payload);
  return response.data;
};



// EXERCISE TYPES: Used in exercise search and selection
export type ExerciseType = {
  _id: string;
  exerciseId: string;
  name: string;
  aliases: string[];
  primaryMuscles: string[];
};

// Fetch all exercises for search modal
export const getExercises = async (): Promise<ExerciseType[]> => {
  const response = await api.get("/exercises");
  return response.data;
};



// WORKOUT SESSION
// Payload used when completing a workout session
export type CreateWorkoutSessionPayload = {
  programId: string;
  dayId: string;
  dayName: string;
  exercises: {
    exerciseId: string;
    targetSets: number;
    completedSets: number;
    repRange: string;
    restSeconds: number;
  }[];
};

export const createWorkoutSession = async (
  payload: CreateWorkoutSessionPayload
) => {
  const response = await api.post("/workouts", payload);
  return response.data;
};