import { NavLink } from "react-router";
import { Pencil, Check } from "lucide-react";
import type { ProgramType } from "../../lib/api";
import { useState, useEffect } from "react";

type Props = {
  program: ProgramType;
  onUpdateProgramName: (newName: string) => void;
  onUpdateProgramDescription: (newDescription: string) => void;
};

export default function ProgramDetailHeader({
  program,
  onUpdateProgramName,
  onUpdateProgramDescription,
}: Props) {
  // state for editing mode + setting name
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(program.name);

  // state for editing mode + setting description
  const [description, setDescription] = useState(program.description || "");
  const [isEditingDescription, setIsEditingDescription] = useState(false);  

  // keep state in sync if name changes
  useEffect(() => {
    setName(program.name);
  }, [program.name]);

  // keep state in sync if description changes
  useEffect(() => {
    setDescription(program.description || "");
  }, [program.description]);

  // save updated name
  const handleSaveName = () => {
    if (!name.trim()) return;

    onUpdateProgramName(name.trim());
    setIsEditing(false);
  };

  // save updated description
  const handleSaveDescription = () => {
    onUpdateProgramDescription(description.trim());
    setIsEditingDescription(false);
  };

  return (
 <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#85ADFF]">
          Program Details
        </p>

        <div className="mt-2 flex items-center gap-3">
          {isEditing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName();
              }}
              autoFocus
              className="rounded-xl border border-zinc-700 bg-[#090d16] px-3 py-2 text-4xl font-bold text-white outline-none focus:border-[#85ADFF]"
            />
          ) : (
            <h1 className="text-4xl font-bold text-white">{program.name}</h1>
          )}

          <button
            onClick={() => {
              if (isEditing) {
                handleSaveName();
              } else {
                setIsEditing(true);
              }
            }}
            className="rounded-full border border-zinc-700 p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            {isEditing ? <Check size={16} /> : <Pencil size={16} />}
          </button>
        </div>

        <div className="mt-2 flex max-w-2xl items-start gap-3">
          {isEditingDescription ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveDescription();
                }
              }}
              autoFocus
              rows={3}
              className="w-full rounded-xl border border-zinc-700 bg-[#090d16] px-3 py-2 text-sm text-zinc-300 outline-none focus:border-[#85ADFF]"
            />
          ) : (
            <p className="text-sm text-zinc-400">
              {program.description || "View and build your training program."}
            </p>
          )}

          <button
            onClick={() => {
              if (isEditingDescription) {
                handleSaveDescription();
              } else {
                setIsEditingDescription(true);
              }
            }}
            className="rounded-full border border-zinc-700 p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            {isEditingDescription ? <Check size={14} /> : <Pencil size={14} />}
          </button>
        </div>
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