import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { AtSign, Lock, Shield, User } from "lucide-react";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <AuthCard
      title="GYMTRACKER"
      subtitle="Create your account and start building your training plan."
      variant="register"
    >
      <form onSubmit={handleSubmit}>
        <InputField
          label="Your Name"
          placeholder="John doe"
          value={username}
          onChange={setUsername}
          icon={User}
        />

        <InputField
          label="Email Address"
          type="email"
          placeholder="athlete@gymtracker.com"
          value={email}
          onChange={setEmail}
          icon={AtSign}
        />

        <InputField
          label="Secure Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          icon={Lock}
        />

        <InputField
          label="Verify Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={setConfirmPassword}
          icon={Shield}
        />

        <button
          type="submit"
          className="mt-3 w-full rounded-full bg-[#7aa2ff] px-5 py-4 text-lg font-bold text-black shadow-[0_10px_30px_rgba(122,162,255,0.28)] transition hover:scale-[1.01] hover:opacity-95"
        >
          CREATE ACCOUNT
        </button>
      </form>

      <p className="mt-7 text-center text-base text-zinc-400">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[#7aa2ff]">
          Back to login
        </Link>
      </p>
    </AuthCard>
  );
}