import { Link, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import { Lock, Mail } from "lucide-react";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import { loginUser } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const data = await loginUser({ email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/home");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "Failed to login");
      } else {
        setErrorMessage("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
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
          placeholder="email@gymtracker.com"
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

        {errorMessage && (
          <p className="mb-4 text-sm text-red-400">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-3 w-full rounded-full bg-[#7aa2ff] px-5 py-4 text-lg font-bold text-black shadow-[0_10px_30px_rgba(122,162,255,0.28)] transition hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "LOGGING IN..." : "LOGIN"}
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