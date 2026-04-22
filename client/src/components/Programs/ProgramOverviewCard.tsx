import { NavLink } from "react-router";
import type { ProgramType } from "../../lib/api";

type Props = {
  program: ProgramType;
  onDelete: (id: string) => void;
};

export default function ProgramOverviewCard({ program, onDelete  }: Props) {
  const totalExercises =
    program.days?.reduce((sum, day) => sum + (day.exercises?.length || 0), 0) || 0;



    const handleDelete = () => {
      const confirmed = window.confirm(
        `Delete "${program.name}"?`
      );

      if (!confirmed) return;

      onDelete(program._id);
    };

  return (
    <article className="rounded-[32px] border border-zinc-800 bg-gradient-to-br from-gray-950 via-[#0b0f1a] to-black p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">{program.name}</h2>
          <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
            {program.description || "No description provided."}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            program.isActive
              ? "bg-[#85ADFF]/15 text-[#85ADFF]"
              : "bg-zinc-800 text-zinc-300"
          }`}
        >
          {program.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white/[0.03] p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
            Goal
          </p>
          <p className="mt-2 truncate text-sm font-medium capitalize text-white">
            {program.goal.replace("_", " ")}
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.03] p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
            Days
          </p>
          <p className="mt-2 text-sm font-medium text-white">
            {program.days?.length || 0}
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.03] p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
            Exercises
          </p>
          <p className="mt-2 text-sm font-medium text-white">
            {totalExercises}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button className="rounded-full bg-[#85ADFF] px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90">
          <NavLink to={`/programs/${program._id}`}>View</NavLink>
        </button>

        <button  onClick={handleDelete} className="rounded-full border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800">
          Delete
        </button>
      </div>
    </article>
  );
}