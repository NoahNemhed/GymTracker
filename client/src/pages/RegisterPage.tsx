import { Link, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import { AtSign, Lock, Shield, User } from "lucide-react";
import AuthCard from "../components/Auth/AuthCard";
import InputField from "../components/Auth/InputField";
import { registerUser } from "../lib/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedUsername) {
      setErrorMessage("Name is required");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const data = await registerUser({
        username: trimmedUsername,
        email: trimmedEmail,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/home");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "Failed to register");
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
          placeholder="JohnDoe@hotmail.com"
          value={email}
          onChange={setEmail}
          icon={AtSign}
        />

        <InputField
          label="Password"
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

        {errorMessage && (
          <p className="mb-4 text-sm text-red-400">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-3 w-full rounded-full bg-[#7aa2ff] px-5 py-4 text-lg font-bold text-black shadow-[0_10px_30px_rgba(122,162,255,0.28)] transition hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
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