import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProgramList from "../components/Programs/ProgramList";
import CreateProgramModal from "../components/Programs/CreateProgramModal"
import { getPrograms, deleteProgram } from "../lib/api";
import type { ProgramType } from "../lib/api";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // fetch all program
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getPrograms();
        setPrograms(data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data?.message || "Failed to fetch programs"
          );
        } else {
          setErrorMessage("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // handle create new program
  const handleCreated = (newProgram: ProgramType) => {
    setPrograms((prevPrograms) => {
      // copy existing programs
      let updatedPrograms = [...prevPrograms];

      // if new program is active → turn all others off
      if (newProgram.isActive) {
        updatedPrograms = updatedPrograms.map((program) => {
          return {
            ...program,
            isActive: false,
          };
        });
      }

      // add new program at the top
      return [newProgram, ...updatedPrograms];
    });
  };

  // handle delete program
  const handleDelete = async (id: string) => {
    try {
      await deleteProgram(id);

      setPrograms((prevPrograms) => {
        const updatedPrograms = [];

        for (let program of prevPrograms) {
          if (program._id !== id) {
            updatedPrograms.push(program);
          }
        }

        return updatedPrograms;
      });

    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Failed to delete program"
        );
      } else {
        setErrorMessage("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#05070f] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#85ADFF]">
              Training
            </p>
            <h1 className="mt-2 text-4xl font-bold text-white">Programs</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Manage your workout programs and choose your active training split.
            </p>
          </div>

          <button className="rounded-full bg-[#85ADFF] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90" onClick={() => setIsCreateOpen(true)}>
            Create Program
          </button>
        </div>

        {loading && (
          <div className="rounded-[32px] border border-zinc-800 bg-[#0b0f1a] p-6">
            <p className="text-zinc-300">Loading programs...</p>
          </div>
        )}

        {errorMessage && !loading && (
          <div className="rounded-[32px] border border-red-900 bg-red-950/40 p-6">
            <p className="text-red-300">{errorMessage}</p>
          </div>
        )}

        {!loading && !errorMessage && <ProgramList programs={programs} onDelete={handleDelete} />}

        <CreateProgramModal
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreated={handleCreated}
        />
      </main>
    </div>
  );
}