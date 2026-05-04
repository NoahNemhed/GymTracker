import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { getPrograms } from "../lib/api";
import type { ProgramType } from "../lib/api";
import ActiveProgramCard from "../components/Home/ActiveProgramCard";

export default function HomePage() {
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        
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
  return (
    
    <div className="min-h-screen bg-[#05070f] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 ">

      {loading && (
        <div className="mt-8 rounded-[32px] border border-zinc-800 bg-[#0b0f1a] p-6">
          <p className="text-zinc-300">Loading your dashboard...</p>
        </div>
      )}

      {errorMessage && !loading && (
        <div className="mt-8 rounded-[32px] border border-red-900 bg-red-950/40 p-6">
          <p className="text-red-300">{errorMessage}</p>
        </div>
      )}

      {!loading && !errorMessage && <ActiveProgramCard program={activeProgram} />}

       
      </main>
    </div>
  );
}
