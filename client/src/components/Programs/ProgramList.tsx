import ProgramOverviewCard from "./ProgramOverviewCard";
import type { ProgramType } from "../../lib/api";

type Props = {
  programs: ProgramType[];
};

export default function ProgramList({ programs }: Props) {
  if (programs.length === 0) {
    return (
      <div className="rounded-[32px] border border-zinc-800 bg-[#0b0f1a] p-6">
        <h2 className="text-xl font-semibold text-white">No programs yet</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Create your first training program to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {programs.map((program) => (
        <ProgramOverviewCard key={program._id} program={program} />
      ))}
    </div>
  );
}