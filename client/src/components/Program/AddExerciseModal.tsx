import { useEffect, useState } from "react";
import { getExercises } from "../../lib/api";
import type { ExerciseType } from "../../lib/api";


type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (exercise: {
    exerciseId: string;
    targetSets: number;
    repRange: string;
    restSeconds: number;
  }) => void;
};

export default function AddExerciseModal({ open, onClose, onAdd }: Props) {
    // Local form state for the exercise settings before it is added to the program
    const [sets, setSets] = useState(3);
    const [minReps, setMinReps] = useState(8);
    const [maxReps, setMaxReps] = useState(12);
    const [restSeconds, setRestSeconds] = useState(90);

    // Stores all exercises from the database and the current search/selection state
    const [exercises, setExercises] = useState<ExerciseType[]>([]);
    const [search, setSearch] = useState("");
    const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(null);

  // Fetch exercises only when the modal opens so the user can search the exercise library
  useEffect(() => {
    if (!open) return;

    const fetchExercises = async () => {
        const data = await getExercises();
        setExercises(data);
    };

    fetchExercises();
    }, [open]);

    if (!open) return null;

    // Filter exercises by name, alias, or primary muscle and only show the top 5 matches
    const filteredExercises = exercises
    .filter((exercise) => {
        const query = search.toLowerCase();

        return (
        exercise.name.toLowerCase().includes(query) ||
        exercise.aliases.some((alias) =>
            alias.toLowerCase().includes(query)
        ) ||
        exercise.primaryMuscles.some((muscle) =>
            muscle.toLowerCase().includes(query)
        )
        );
    })
    .slice(0, 5);

  // If min reps becomes higher than max reps, update max reps to keep the range valid
  const handleMinRepsChange = (value: number) => {
    setMinReps(value);

    if (value > maxReps) {
      setMaxReps(value);
    }
  };

  // Prevent max reps from being lower than min reps
  const handleMaxRepsChange = (value: number) => {
    if (value < minReps) {
      setMaxReps(minReps);
      return;
    }

    setMaxReps(value);
  };

  
    // Reset modal state so it opens fresh next time
    const resetForm = () => {
    setSearch("");
    setSelectedExercise(null);
    setSets(3);
    setMinReps(8);
    setMaxReps(12);
    setRestSeconds(90);
    };

    // Close the modal and clear all temporary form/search state
    const handleClose = () => {
    resetForm();
    onClose();
    };

    // Send the selected exercise and target values back to ProgramDetailPage
    const handleSubmit = () => {
    if (!selectedExercise) return;

    onAdd({
        exerciseId: selectedExercise.exerciseId,
        targetSets: sets,
        repRange: `${minReps}-${maxReps}`,
        restSeconds,
    });

    resetForm();
    onClose();
    };

  return (
<div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 px-4 py-6">
  <div className="mx-auto flex min-h-full max-w-2xl items-center justify-center">
    <div className="w-full rounded-[28px] border border-zinc-800 bg-[#0b0f1a] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.7)] sm:p-6">

      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#85ADFF]">
            Program Builder
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Add Exercise</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Search your exercise library and set targets for this day.
          </p>
        </div>

        <button
          onClick={handleClose}
          className="self-start rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          Close
        </button>
      </div>

      {/* CONTENT */}
      <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">

        {/* SEARCH PANEL */}
        <div className="rounded-3xl border border-zinc-800 bg-[#090d16] p-4">
          <label className="text-sm font-medium text-zinc-300">
            Search Exercise
          </label>

          <input
            placeholder="Search by name, alias, or muscle..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedExercise(null);
            }}
            className="mt-2 w-full rounded-2xl border border-zinc-800 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-[#85ADFF]"
          />

          <div className="mt-4 max-h-[220px] space-y-2 overflow-y-auto pr-1 md:h-[280px] md:max-h-none">

            {!search && (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-800 text-center">
                <p className="max-w-xs text-sm text-zinc-500">
                  Start typing to find exercises.
                </p>
              </div>
            )}

            {search && filteredExercises.length === 0 && (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-800 text-center">
                <p className="text-sm text-zinc-500">No exercises found.</p>
              </div>
            )}

            {search &&
              filteredExercises.map((exercise) => (
                <button
                  key={exercise.exerciseId}
                  type="button"
                  onClick={() => {
                    setSelectedExercise(exercise);
                    setSearch(exercise.name);
                  }}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedExercise?.exerciseId === exercise.exerciseId
                      ? "border-[#85ADFF] bg-[#85ADFF]/10"
                      : "border-zinc-800 bg-black/20 hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {exercise.name}
                      </p>

                      {exercise.aliases?.length > 0 && (
                        <p className="mt-1 truncate text-xs text-zinc-500">
                          {exercise.aliases.join(", ")}
                        </p>
                      )}
                    </div>

                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                      {exercise.primaryMuscles[0]}
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* TARGET PANEL */}
        <div className="rounded-3xl border border-zinc-800 bg-[#090d16] p-4">
          <p className="text-sm font-medium text-zinc-300">Exercise Targets</p>

          {selectedExercise ? (
            <div className="mt-3 rounded-2xl border border-[#85ADFF]/30 bg-[#85ADFF]/10 p-4">
              <p className="text-sm font-semibold text-white">
                {selectedExercise.name}
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                {selectedExercise.primaryMuscles.join(", ")}
              </p>
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-dashed border-zinc-800 p-4">
              <p className="text-sm text-zinc-500">
                Select an exercise to continue.
              </p>
            </div>
          )}

          <div className="mt-5 space-y-4">

            <div>
              <label className="text-sm text-zinc-400">Sets</label>
              <input
                type="number"
                min={1}
                max={10}
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
                className="mt-1 w-full rounded-2xl border border-zinc-800 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#85ADFF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-zinc-400">Min Reps</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={minReps}
                  onChange={(e) =>
                    handleMinRepsChange(Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-2xl border border-zinc-800 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#85ADFF]"
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400">Max Reps</label>
                <input
                  type="number"
                  min={minReps}
                  max={100}
                  value={maxReps}
                  onChange={(e) =>
                    handleMaxRepsChange(Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-2xl border border-zinc-800 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#85ADFF]"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-zinc-400">Rest Seconds</label>
              <input
                type="number"
                min={15}
                max={600}
                value={restSeconds}
                onChange={(e) =>
                  setRestSeconds(Number(e.target.value))
                }
                className="mt-1 w-full rounded-2xl border border-zinc-800 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#85ADFF]"
              />
            </div>

          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
        <button
          onClick={handleClose}
          className="flex-1 rounded-full border border-zinc-700 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={!selectedExercise}
          className="flex-1 rounded-full bg-[#85ADFF] px-4 py-3 text-sm font-semibold text-black hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add Exercise
        </button>
      </div>

    </div>
  </div>
</div>
  );
}