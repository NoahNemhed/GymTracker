import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { getPrograms } from "../lib/api";
import type { ProgramType } from "../lib/api";
import { NavLink } from "react-router";
import ActiveProgramCard from "../components/Home/ActiveProgramCard";

type userType = {
  _id: string;
  username: string;
  email: string;
  token: string;
};

export default function HomePage() {
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  

  const user: userType | null = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        
        const token = user?.token

        const data = await getPrograms();
        setPrograms(data);
      }

      catch (error){
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data?.message || "Failed to fetch programs"
          );
        } else {
          setErrorMessage("Something went wrong");
        }
      } 
      
      finally {
        setLoading(false);
      }
    }
    fetchPrograms();
  }, []);


 
  // Gets active program
  const activeProgram = programs.find((program) => program.isActive)
  console.log(activeProgram)


  const formatExerciseName = (value: string) => {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
  return (
    
    <div className="min-h-screen bg-[#05070f] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 ">

      <ActiveProgramCard program={activeProgram} />

       
      </main>
    </div>
  );
}