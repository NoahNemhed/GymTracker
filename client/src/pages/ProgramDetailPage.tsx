import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProgramDetailHeader from "../components/Program/ProgramDetailHeader";
import ProgramSummaryCards from "../components/Program/ProgramSummaryCard";
import ProgramDaysSection from "../components/Program/ProgramDaySection";
import { getProgramById, updateProgram } from "../lib/api";
import type { ProgramType } from "../lib/api";
import AddExerciseModal from "../components/Program/AddExerciseModal";

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();

  // Main program state for the detail page
  const [program, setProgram] = useState<ProgramType | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

 // Modal state used when adding an exercise to a specific program day
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);


  // Fetch the selected program when the page loads or when the URL id changes
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



  // Remove one exercise from a specific day, then save the updated days array to the backend
  const handleDeleteExercise = async (dayId: string, exerciseId: string) => {
  if (!program) return;

  const confirmed = window.confirm("Delete this exercise from the program?");
  if (!confirmed) return;
  
  // Create a new days array where only the matching day has the exercise removed
  const updatedDays = program.days.map((day) => {
    if (day._id !== dayId) return day;

    return {
      ...day,
      exercises: day.exercises.filter((exercise) => exercise._id !== exerciseId),
    };
  });

  try {
    // Save the updated program in MongoDB and refresh local state with the response
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


// Add a new exercise to a specific day, then save the updated days array to the backend
const handleAddExercise = async (
  dayId: string,
  newExercise: {
    exerciseId: string;
    targetSets: number;
    repRange: string;
    restSeconds: number;
  }
) => {
  if (!program) return;
  // Create a new days array where only the selected day gets the new exercise
  const updatedDays = program.days.map((day) => {
    if (day._id !== dayId) return day;

    return {
      ...day,
      exercises: [
        ...day.exercises,
        {
          ...newExercise,
          // Order places the new exercise last in the selected day
          order: day.exercises.length + 1,
        },
      ],
    };
  });

  try {
    const updatedProgram = await updateProgram(program._id, {
      days: updatedDays,
      daysPerWeek: updatedDays.length,
    });

    setProgram(updatedProgram);
  } 
  catch (error) {
    if (axios.isAxiosError(error)) {
      setErrorMessage(
        error.response?.data?.message || "Failed to add exercise"
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
            <ProgramDaysSection program={program} onDeleteExercise={handleDeleteExercise} setSelectedDayId={setSelectedDayId} setIsModalOpen={setIsModalOpen} />
          </div>
        )}
        {/* Modal receives the selected exercise and sends it back to handleAddExercise */}
        <AddExerciseModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDayId(null);
        }}
        onAdd={(exercise) => {
        if (!selectedDayId) return;
        handleAddExercise(selectedDayId, exercise);
        setSelectedDayId(null);
        }}
      />
      </main>
    </div>
  );
}