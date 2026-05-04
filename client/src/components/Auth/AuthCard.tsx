import type { ReactNode } from "react";
import { Dumbbell } from "lucide-react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  variant?: "login" | "register";
};

export default function AuthCard({
  title,
  subtitle,
  children,
}: AuthCardProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_28%),linear-gradient(to_right,_#05070b,_#0d1118_45%,_#111111_100%)]" />
      <div className="absolute left-[-120px] top-[80px] h-[380px] w-[380px] rounded-full bg-[#3B82F6]/10 blur-[120px]" />
      <div className="absolute bottom-[-120px] right-[140px] h-[320px] w-[320px] rounded-full bg-[#A858B0]/10 blur-[120px]" />


      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-[36px] border border-white/5 bg-[#171717]/95 px-10 py-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#7aa2ff] shadow-[0_0_35px_rgba(122,162,255,0.35)]">
              <Dumbbell className="h-9 w-9 text-black" />
            </div>

            <h1 className="text-3xl sm:text-5xl font-black italic tracking-tight">{title}</h1>
            <p className="mx-auto mt-4 max-w-xs text-lg leading-8 text-zinc-400">
              {subtitle}
            </p>
          </div>

          {children}


        </div>
      </div>
    </div>
  );
}
