import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProgramDetailHeader from "../components/Program/ProgramDetailHeader";
import ProgramSummaryCards from "../components/Program/ProgramSummaryCard";
import ProgramDaysSection from "../components/Program/ProgramDaySection";
import { getProgramById } from "../lib/api";
import type { ProgramType } from "../lib/api";

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [program, setProgram] = useState<ProgramType | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) {
        setErrorMessage("Missing program id");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");
        const data = await getProgramById(id);
        setProgram(data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data?.message || "Failed to fetch program"
          );
        } else {
          setErrorMessage("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#05070f] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {loading && (
          <div className="rounded-[32px] border border-zinc-800 bg-[#0b0f1a] p-6">
            <p className="text-zinc-300">Loading program...</p>
          </div>
        )}

        {errorMessage && !loading && (
          <div className="rounded-[32px] border border-red-900 bg-red-950/40 p-6">
            <p className="text-red-300">{errorMessage}</p>
          </div>
        )}

        {!loading && !errorMessage && program && (
          <div className="space-y-6">
            <ProgramDetailHeader program={program} />
            <ProgramSummaryCards program={program} />
            <ProgramDaysSection program={program} />
          </div>
        )}
      </main>
    </div>
  );
}