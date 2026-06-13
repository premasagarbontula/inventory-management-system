import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { auth, setAuth } = useAuth();

  const navigate = useNavigate();
  if (auth?.user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      toast.error("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Enter a valid email");
      return;
    }
    if (!trimmedPassword) {
      toast.error("Password is required");
      return;
    }
    if (trimmedPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const { data } = await API.post("/users/login", {
        email: trimmedEmail,
        password: trimmedPassword,
      });
      setAuth({ user: data.user, loading: false });
      toast.success(data.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920')] flex items-center justify-center bg-cover bg-center px-4">
      <section className="bg-white shadow-lg rounded-xl p-6 sm:p-8 w-full max-w-xs sm:max-w-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 text-center">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-xs font-medium text-slate-600"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-xs font-medium text-slate-600"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-md border border-slate-200 px-3 py-2 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 px-4 py-2 rounded-md bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
          >
            Login
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
