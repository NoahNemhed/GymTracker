import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <AuthCard
      title="GYMTRACKER"
      subtitle="Plan your training. Track your progress."
      variant="login"
    >
      <form onSubmit={handleSubmit}>
        <InputField
          label="Email Address"
          type="email"
          placeholder="athlete@gymtracker.com"
          value={email}
          onChange={setEmail}
          icon={Mail}
        />

        <InputField
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          icon={Lock}
        />

        <button
          type="submit"
          className="mt-3 w-full rounded-full bg-[#7aa2ff] px-5 py-4 text-lg font-bold text-black shadow-[0_10px_30px_rgba(122,162,255,0.28)] transition hover:scale-[1.01] hover:opacity-95"
        >
          LOGIN
        </button>
      </form>

      <p className="mt-7 text-center text-base text-zinc-400">
        New to the platform?{" "}
        <Link to="/register" className="font-semibold text-[#7aa2ff]">
          Create Account
        </Link>
      </p>
    </AuthCard>
  );
}