import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import axios from "axios";
import { getProgramById } from "../../lib/api";
import type { ProgramType } from "../../lib/api";
import { createWorkoutSession } from "../../lib/api";
import { useNavigate } from "react-router";


type WorkoutDay = ProgramType["days"][number];



export default function ActiveWorkoutPage() {

const navigate = useNavigate();

// Get programId and dayId from the URL 
const { programId, dayId } = useParams<{
  programId: string;
  dayId: string;
}>();

// State for the selected workout day
const [day, setDay] = useState<WorkoutDay | null>(null);

// UI states for loading + error handling
const [loading, setLoading] = useState(true);
const [errorMessage, setErrorMessage] = useState("");

// Track which sets are completed 
const [completedSets, setCompletedSets] = useState<string[]>([]);

// Toggle a set between completed / not completed
const toggleSet = (exerciseId: string, setNumber: number) => {
  const setKey = `${exerciseId}-${setNumber}`;

  setCompletedSets((prev) => {
    // If already completed -> remove it
    if (prev.includes(setKey)) {
      return prev.filter((key) => key !== setKey);
    }

    // Otherwise -> mark as completed
    return [...prev, setKey];
  });
};

// Fetch the program and extract the correct workout day
useEffect(() => {
  const fetchWorkoutDay = async () => {
    // check if params are missing
    if (!programId || !dayId) {
      setErrorMessage("Missing workout data");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      // Fetch program from API
      const program = await getProgramById(programId);

      // Find the specific day inside the program
      const selectedDay = program.days.find((day) => day._id === dayId);

      if (!selectedDay) {
        setErrorMessage("Workout day not found");
        return;
      }

      // Store the selected day in state
      setDay(selectedDay);
    } catch (error) {
      // Handle errors
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Failed to load workout"
        );
      } else {
        setErrorMessage("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchWorkoutDay();
}, [programId, dayId]);

// Handles completion of workouit calls backend and saves data and redirects to home
const handleCompleteWorkout = async () => {
  if (!programId || !dayId || !day) return;

  const exercises = day.exercises.map((exercise) => {
    const completedCount = completedSets.filter((setKey) =>
      setKey.startsWith(`${exercise.exerciseId}-`)
    ).length;

    return {
      exerciseId: exercise.exerciseId,
      targetSets: exercise.targetSets,
      completedSets: completedCount,
      repRange: exercise.repRange,
      restSeconds: exercise.restSeconds,
    };
  });

  await createWorkoutSession({
    programId,
    dayId,
    dayName: day.name,
    exercises,
  });

  navigate("/home");
};
  return (
    <div className="min-h-screen bg-[#05070f] px-4 py-6 text-white">
      <div className="mx-auto max-w-3xl">
        {loading && (
          <div className="rounded-3xl border border-zinc-800 bg-[#0b0f1a] p-6">
            <p className="text-zinc-300">Loading workout...</p>
          </div>
        )}

        {errorMessage && !loading && (
          <div className="rounded-3xl border border-red-900 bg-red-950/40 p-6">
            <p className="text-red-300">{errorMessage}</p>
          </div>
        )}

        {!loading && !errorMessage && day && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#85ADFF]">
                  Active Workout
                </p>
                <h1 className="mt-2 text-3xl font-bold">{day.name}</h1>
                <p className="mt-1 text-sm text-zinc-400">{day.focus}</p>
              </div>

              <NavLink
                to="/home"
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Exit
              </NavLink>
            </div>

            <div className="space-y-4">
              {day.exercises.map((exercise) => (
                <div
                  key={exercise._id || `${day.dayOrder}-${exercise.order}`}
                  className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-gray-950 via-[#0b0f1a] to-black p-5"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      {exercise.exerciseId.replaceAll("_", " ")}
                    </h2>

                    <span className="text-sm font-semibold text-[#85ADFF]">
                      {exercise.targetSets} × {exercise.repRange}
                    </span>
                  </div>

                    <div className="mt-4 flex gap-3">
                    {Array.from({ length: exercise.targetSets }).map((_, index) => {
                        const setNumber = index + 1;
                        const setKey = `${exercise.exerciseId}-${setNumber}`;
                        const isCompleted = completedSets.includes(setKey);

                        return (
                        <button
                            key={setNumber}
                            onClick={() => toggleSet(exercise.exerciseId, setNumber)}
                            className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-medium transition ${
                            isCompleted
                                ? "border-green-400 bg-green-400 text-black"
                                : "border-zinc-700 text-zinc-300 hover:bg-green-400 hover:text-black"
                            }`}
                        >
                            {setNumber}
                        </button>
                        );
                    })}
                    </div>
                </div>
              ))}
            </div>

            <button
            onClick={handleCompleteWorkout}
            className="mt-8 w-full rounded-full bg-[#85ADFF] py-4 text-lg font-semibold text-black shadow-[0_10px_30px_rgba(133,173,255,0.2)] transition hover:opacity-90"
            >
            Complete Workout
            </button>
          </>
        )}
      </div>
    </div>
  );
}