import { NavLink } from "react-router";
import type { ProgramType } from "../../lib/api";

type Props = {
  program: ProgramType | undefined;
};

const formatExerciseName = (value: string) => {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function ActiveProgramCard({ program }: Props) {
  if (!program) {
    return (
      <div className="mt-8 rounded-[40px] border border-zinc-800 bg-[#0b0f1a] p-6">
        <h2 className="text-xl font-semibold text-white">
          No active program
        </h2>
        <p className="mt-2 text-zinc-400">
          Create or activate a program to start training.
        </p>

        <NavLink
          to="/programs"
          className="mt-4 inline-block rounded-full bg-[#85ADFF] px-5 py-2.5 text-sm font-semibold text-black"
        >
          Go to Programs
        </NavLink>
      </div>
    );
  }

  return (
    <div className="relative mt-8 rounded-[40px] border border-zinc-800 bg-gradient-to-br from-gray-950 via-[#0b0f1a] to-black p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
      
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-20 blur-3xl">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,#85ADFF,transparent_60%)]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#85ADFF]">
              Current active program
            </p>
            <h2 className="mt-2 text-4xl font-bold text-white">
              {program.name}
            </h2>
          </div>

          <NavLink
            to="/programs"
            className="mt-2 text-sm font-medium text-zinc-300 transition hover:text-white"
          >
            View All →
          </NavLink>
        </div>

        {/* Carousel */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar">
          {program.days.map((day) => (
            <article
              key={day._id || `${program._id}-${day.dayOrder}`}
              className="h-[500px] w-[340px] flex-shrink-0 snap-start rounded-[34px] border border-zinc-800 bg-[#090b12] p-6"
            >
              <div className="flex h-full flex-col">
                
                {/* Day header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-[34px] font-bold text-white">
                      {day.name}
                    </h3>
                    <p className="mt-3 truncate text-base text-zinc-400">
                      {day.focus}
                    </p>
                  </div>

                  <span className="flex h-10 flex-shrink-0 items-center rounded-md bg-zinc-800 px-3 text-xs font-semibold uppercase text-zinc-200">
                    {day.exercises?.length || 0} ex
                  </span>
                </div>

                {/* Exercises */}
                <div className="mt-8 flex-1 space-y-4">
                  {day.exercises?.slice(0, 3).map((exercise) => (
                    <div
                      key={exercise._id || `${day.dayOrder}-${exercise.order}`}
                      className="flex h-[64px] items-center justify-between gap-4 rounded-full bg-white/[0.03] px-5"
                    >
                      <span className="min-w-0 flex-1 truncate text-lg text-zinc-100">
                        {formatExerciseName(exercise.exerciseId)}
                      </span>

                      <span className="flex-shrink-0 text-lg font-semibold text-[#85ADFF]">
                        {exercise.targetSets} × {exercise.repRange}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button className="mt-8 h-[64px] w-full rounded-full bg-[#85ADFF] px-6 text-lg font-semibold text-[#0b0f1a] shadow-[0_10px_30px_rgba(133,173,255,0.18)] transition hover:opacity-90">
                  Start Workout
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}