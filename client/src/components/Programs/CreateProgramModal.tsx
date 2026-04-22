import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { createProgram } from "../../lib/api";
import type { ProgramType } from "../../lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (program: ProgramType) => void;
};

export default function CreateProgramModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState<
    "hypertrophy" | "strength" | "endurance" | "general_fitness">("hypertrophy");
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  // retrive signed in user
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  if (!open) return null;

  const resetForm = () => {
    setName("");
    setDescription("");
    setGoal("hypertrophy");
    setDaysPerWeek(3);
    setIsActive(false);
    setErrorMessage("");
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Program name is required");
      return;
    }

    try {
      setIsSubmitting(true);

      const newProgram = await createProgram({
        userId: user?._id,
        name: name.trim(),
        description: description.trim(),
        goal,
        daysPerWeek,
        isActive,
        days: [],
      });

      onCreated(newProgram);
      resetForm();
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Failed to create program"
        );
      } else {
        setErrorMessage("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-xl rounded-[32px] border border-zinc-800 bg-[#0b0f1a] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#85ADFF]">
              Create Program
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              New Training Program
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="rounded-full border border-zinc-700 p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Program Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Push Pull Legs"
              className="w-full rounded-2xl border border-zinc-700 bg-[#090d16] px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-[#85ADFF]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="6-day hypertrophy split focused on upper body progression."
              rows={4}
              className="w-full rounded-2xl border border-zinc-700 bg-[#090d16] px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-[#85ADFF]"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Goal
              </label>
              <select
                value={goal}
                onChange={(e) =>
                  setGoal(
                    e.target.value as
                      | "hypertrophy"
                      | "strength"
                      | "endurance"
                      | "general_fitness"
                  )
                }
                className="w-full rounded-2xl border border-zinc-700 bg-[#090d16] px-4 py-3 text-white outline-none focus:border-[#85ADFF]"
              >
                <option value="hypertrophy">Hypertrophy</option>
                <option value="strength">Strength</option>
                <option value="endurance">Endurance</option>
                <option value="general_fitness">General Fitness</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Days Per Week
              </label>
              <input
                type="number"
                min={1}
                max={7}
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                className="w-full rounded-2xl border border-zinc-700 bg-[#090d16] px-4 py-3 text-white outline-none focus:border-[#85ADFF]"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-[#090d16]"
            />
            Set as active program
          </label>

          {errorMessage && (
            <p className="text-sm text-red-400">{errorMessage}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[#85ADFF] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating..." : "Create Program"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}