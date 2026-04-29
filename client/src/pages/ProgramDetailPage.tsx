import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProgramDetailHeader from "../components/Program/ProgramDetailHeader";
import ProgramSummaryCards from "../components/Program/ProgramSummaryCard";
import ProgramDaysSection from "../components/Program/ProgramDaySection";
import { getProgramById, updateProgram } from "../lib/api";
import type { ProgramType } from "../lib/api";

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [program, setProgram] = useState<ProgramType | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");


  // fetch program
  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) {
        setErrorMessage("Missing program id");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");
        const data = await getProgramById(id);
        setProgram(data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data?.message || "Failed to fetch program"
          );
        } else {
          setErrorMessage("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);



  // handle delete exercise from program
  const handleDeleteExercise = async (dayId: string, exerciseId: string) => {
  if (!program) return;

  const confirmed = window.confirm("Delete this exercise from the program?");
  if (!confirmed) return;

  const updatedDays = program.days.map((day) => {
    if (day._id !== dayId) return day;

    return {
      ...day,
      exercises: day.exercises.filter((exercise) => exercise._id !== exerciseId),
    };
  });

  try {
    const updatedProgram = await updateProgram(program._id, {
      days: updatedDays,
      daysPerWeek: updatedDays.length,
    });

    setProgram(updatedProgram);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      setErrorMessage(
        error.response?.data?.message || "Failed to delete exercise"
      );
    } else {
      setErrorMessage("Something went wrong");
    }
  }
};

  return (
    <div className="min-h-screen bg-[#05070f] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {loading && (
          <div className="rounded-[32px] border border-zinc-800 bg-[#0b0f1a] p-6">
            <p className="text-zinc-300">Loading program...</p>
          </div>
        )}

        {errorMessage && !loading && (
          <div className="rounded-[32px] border border-red-900 bg-red-950/40 p-6">
            <p className="text-red-300">{errorMessage}</p>
          </div>
        )}

        {!loading && !errorMessage && program && (
          <div className="space-y-6">
            <ProgramDetailHeader program={program} />
            <ProgramSummaryCards program={program} />
            <ProgramDaysSection program={program} onDeleteExercise={handleDeleteExercise} />
          </div>
        )}
      </main>
    </div>
  );
}