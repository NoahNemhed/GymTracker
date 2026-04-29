import { Pencil, Plus } from "lucide-react";
import type { ProgramType } from "../../lib/api";

type Props = {
  program: ProgramType;
  onAddDay: () => void;
};

export default function ProgramSummaryCards({ program, onAddDay  }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-[28px] border border-zinc-800 bg-[#0b0f1a] p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
            Goal
          </p>

        </div>
        <p className="mt-2 text-lg font-semibold capitalize text-white">
          {program.goal.replace("_", " ")}
        </p>
      </div>

      <div className="rounded-[28px] border border-zinc-800 bg-[#0b0f1a] p-5">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
          Days Per Week
        </p>
        <p className="mt-2 text-lg font-semibold text-white">
          {program.days.length}
        </p>
      </div>

      <div className="rounded-[28px] border border-zinc-800 bg-[#0b0f1a] p-5">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
          Status
        </p>
        <p className="mt-2 text-lg font-semibold text-white">
          {program.isActive ? "Active" : "Inactive"}
        </p>
      </div>

      <div className="rounded-[28px] border border-zinc-800 bg-[#0b0f1a] p-5">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
          Actions
        </p>
        <button
          onClick={onAddDay}
          disabled={program.days.length >= 7}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#85ADFF] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} />
          Add Day
        </button>
      </div>
    </div>
  );
}