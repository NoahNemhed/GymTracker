import { Pencil, Plus, Trash2, Check } from "lucide-react";
import type { ProgramType } from "../../lib/api";
import { useState } from "react";

type ProgramDay = ProgramType["days"][number];

type Props = {
  day: ProgramDay;
  onDeleteExercise: (dayId: string, exerciseId: string) => void;
  setSelectedDayId: (dayId: string) => void;
  setIsModalOpen: (open: boolean) => void;
  onDeleteDay: (dayId: string) => void;
  onUpdateDayName: (dayId: string, newName: string) => void;
};

// Converts "bench_press" to "Bench Press" for display in the UI
const formatExerciseName = (value: string) => {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// Displays one program day with its exercises and actions (add/delete exercise)
export default function ProgramDayCard({ day, onDeleteExercise, setSelectedDayId, setIsModalOpen, onDeleteDay, onUpdateDayName}: Props) {
  // states for editing and setting name
  const [isEditingName, setIsEditingName] = useState(false);
  const [dayName, setDayName] = useState(day.name);

  return (
    <article className="rounded-[32px] border border-zinc-800 bg-gradient-to-br from-gray-950 via-[#0b0f1a] to-black p-6">
  <div className="flex items-start justify-between gap-4">
    <div>
      <div className="flex items-center gap-3">
        {isEditingName ? (
          <input
            value={dayName}
            onChange={(e) => setDayName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && day._id) {
                onUpdateDayName(day._id, dayName.trim());
                setIsEditingName(false);
              }
            }}
            autoFocus
            className="rounded-xl border border-zinc-700 bg-[#090d16] px-3 py-2 text-2xl font-bold text-white outline-none focus:border-[#85ADFF]"
          />
        ) : (
          <h2 className="text-2xl font-bold text-white">{day.name}</h2>
        )}

        <button
          onClick={() => {
            if (!day._id) return;

            if (isEditingName) {
              onUpdateDayName(day._id, dayName.trim());
              setIsEditingName(false);
            } else {
              setIsEditingName(true);
            }
          }}
          className="rounded-full border border-zinc-700 p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
        >
          {isEditingName ? <Check size={14} /> : <Pencil size={14} />}
        </button>
      </div>

      <p className="mt-2 text-sm text-zinc-400">{day.focus}</p>
    </div>

    <div className="flex items-center gap-2">
      <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-300">
        {day.exercises?.length || 0} exercises
      </span>

      <button
        onClick={() => {
          if (!day._id) return;
          onDeleteDay(day._id);
        }}
        className="rounded-full border border-red-900/60 p-2 text-red-300 transition hover:bg-red-950/40"
      >
        <Trash2 size={14} />
      </button>
    </div>
  </div>

  <div className="mt-6 space-y-3">
    {day.exercises?.length ? (
      day.exercises.map((exercise) => (
        <div
          key={exercise._id || `${day.dayOrder}-${exercise.order}`}
          className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3"
        >
          <div className="min-w-0">
            <span className="block truncate text-sm text-zinc-100">
              {formatExerciseName(exercise.exerciseId)}
            </span>
          </div>

          <div className="ml-4 flex items-center gap-3">
            <span className="text-sm font-semibold text-[#85ADFF]">
              {exercise.targetSets} × {exercise.repRange}
            </span>

            <button
              onClick={() => {
                if (!day._id || !exercise._id) return;
                onDeleteExercise(day._id, exercise._id);
              }}
              className="rounded-full border border-red-900/60 p-2 text-red-300 transition hover:bg-red-950/40"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className="text-sm text-zinc-500">No exercises added yet.</p>
    )}
  </div>

  <div className="mt-5">
    <button
      className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
      onClick={() => {
        if (!day._id) return;
        setSelectedDayId(day._id);
        setIsModalOpen(true);
      }}
    >
      <Plus size={16} />
      Add Exercise
    </button>
  </div>
</article>
  );
}