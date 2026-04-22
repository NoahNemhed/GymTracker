import { NavLink } from "react-router";
import { Pencil } from "lucide-react";
import type { ProgramType } from "../../lib/api";

type Props = {
  program: ProgramType;
};

export default function ProgramDetailHeader({ program }: Props) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#85ADFF]">
          Program Details
        </p>

        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-4xl font-bold text-white">{program.name}</h1>
          <button className="rounded-full border border-zinc-700 p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-white">
            <Pencil size={16} />
          </button>
        </div>

        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          {program.description || "View and build your training program."}
        </p>
      </div>

      <NavLink
        to="/programs"
        className="rounded-full border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800"
      >
        Back to Programs
      </NavLink>
    </div>
  );
}