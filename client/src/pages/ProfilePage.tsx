import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  getWorkoutSessions,
  getWorkoutStats,
  type WorkoutSessionType,
  type WorkoutStatsType,
} from "../lib/api";

type StoredUser = {
  username: string;
  email: string;
};

const formatExerciseName = (value: string) => {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getProgramName = (program: WorkoutSessionType["programId"]) => {
  if (typeof program === "string") return "Program";
  return program.name;
};

export default function ProfilePage() {
  const [workouts, setWorkouts] = useState<WorkoutSessionType[]>([]);
  const [stats, setStats] = useState<WorkoutStatsType>({
    totalWorkouts: 0,
    totalCompletedSets: 0,
    totalTargetSets: 0,
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const user: StoredUser | null = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const [workoutData, statsData] = await Promise.all([
          getWorkoutSessions(),
          getWorkoutStats(),
        ]);

        setWorkouts(workoutData);
        setStats(statsData);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data?.message || "Failed to load profile"
          );
        } else {
          setErrorMessage("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const recentWorkouts = workouts.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#05070f] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#85ADFF]">
            Profile
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white">
            {user?.username || "User"}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {user?.email || "No email available"}
          </p>
        </div>

        {loading && (
          <div className="rounded-[32px] border border-zinc-800 bg-[#0b0f1a] p-6">
            <p className="text-zinc-300">Loading profile...</p>
          </div>
        )}

        {errorMessage && !loading && (
          <div className="rounded-[32px] border border-red-900 bg-red-950/40 p-6">
            <p className="text-red-300">{errorMessage}</p>
          </div>
        )}

        {!loading && !errorMessage && (
          <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[28px] border border-zinc-800 bg-[#0b0f1a] p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                  Workouts
                </p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {stats.totalWorkouts}
                </p>
              </div>

              <div className="rounded-[28px] border border-zinc-800 bg-[#0b0f1a] p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                  Completed Sets
                </p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {stats.totalCompletedSets}
                </p>
              </div>

              <div className="rounded-[28px] border border-zinc-800 bg-[#0b0f1a] p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                  Target Sets
                </p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {stats.totalTargetSets}
                </p>
              </div>
            </section>

            <section className="rounded-[32px] border border-zinc-800 bg-[#0b0f1a] p-6">
              <h2 className="text-xl font-semibold text-white">Recent Workouts</h2>

              {recentWorkouts.length === 0 ? (
                <p className="mt-4 text-sm text-zinc-400">
                  Complete a workout to see your history here.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {recentWorkouts.map((workout) => (
                    <article
                      key={workout._id}
                      className="rounded-2xl bg-white/[0.03] p-4"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-semibold text-white">
                            {workout.dayName}
                          </h3>
                          <p className="mt-1 text-sm text-zinc-400">
                            {getProgramName(workout.programId)}
                          </p>
                        </div>

                        <p className="text-sm text-zinc-500">
                          {new Date(workout.completedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {workout.exercises.slice(0, 4).map((exercise) => (
                          <span
                            key={exercise.exerciseId}
                            className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
                          >
                            {formatExerciseName(exercise.exerciseId)}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
