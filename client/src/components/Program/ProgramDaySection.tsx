import type { ProgramType } from "../../lib/api";
import ProgramDayCard from "./ProgramDayCard";

type Props = {
  program: ProgramType;
  onDeleteExercise: (dayId: string, exerciseId: string) => void;
  setSelectedDayId: (dayId: string) => void;
  setIsModalOpen: (open: boolean) => void;
  onDeleteDay: (dayId: string) => void;

};


// Renders all program days or a fallback if no days exist
export default function ProgramDaysSection({ program, onDeleteExercise, setSelectedDayId, setIsModalOpen, onDeleteDay }: Props) {

  // Show message when program has no training days yet
  if (program.days.length === 0) {
    return (
      <div className="rounded-[32px] border border-zinc-800 bg-[#0b0f1a] p-6">
        <h2 className="text-xl font-semibold text-white">No days yet</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Add training days to start building this program.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* Loop through each day and render a ProgramDayCard */}
      {/* Pass down handlers so child components can trigger actions in parent */}
      {program.days.map((day) => (
        
        <ProgramDayCard
          key={day._id || `${program._id}-${day.dayOrder}`}
          day={day}
          onDeleteExercise={onDeleteExercise}
          setSelectedDayId={setSelectedDayId}
          setIsModalOpen={setIsModalOpen}
          onDeleteDay={onDeleteDay}
        />
      ))}

    </section>
  );
}