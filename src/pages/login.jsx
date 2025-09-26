// src/Login.jsx
import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [strength, setStrength] = useState(0);
  const [remember, setRemember] = useState(false);

  const canvasRef = useRef(null);
  const particles = useRef([]);

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) navigate("/dashboard");
  }, [navigate]);

  // Particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let mouse = { x: null, y: null };
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createParticles = () => {
      particles.current = [];
      for (let i = 0; i < 80; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          dx: (Math.random() - 0.5) * 0.4,
          dy: (Math.random() - 0.5) * 0.4,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (mouse.x && mouse.y) {
          const distX = mouse.x - p.x;
          const distY = mouse.y - p.y;
          const dist = Math.sqrt(distX ** 2 + distY ** 2);
          if (dist < 100) {
            p.x -= distX / 50;
            p.y -= distY / 50;
          }
        }

        if (p.x < 0 || p.x > canvas.width) p.dx = -p.dx;
        if (p.y < 0 || p.y > canvas.height) p.dy = -p.dy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99, 102, 241, 0.5)";
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // ✅ Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://okellobackend-production.up.railway.app/admin/login",
        { email, password }
      );

      const { token, message } = res.data;

      if (remember) {
        localStorage.setItem("authToken", token);
      } else {
        sessionStorage.setItem("authToken", token);
      }

      alert(message || "Login successful!");
      setLoading(false);
      navigate("/dashboard"); // ✅ Redirect
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Invalid email or password");
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

  const checkStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    setStrength(score);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0"></canvas>

      <div className="absolute inset-0 pointer-events-none">
        <div className="w-72 h-72 bg-blue-500 rounded-full opacity-20 blur-3xl absolute -top-16 -left-16 animate-spin-slow"></div>
        <div className="w-96 h-96 bg-purple-500 rounded-full opacity-15 blur-3xl absolute -bottom-20 -right-20 animate-spin-slow"></div>
        <div className="w-60 h-60 bg-pink-500 rounded-full opacity-20 blur-2xl absolute top-1/3 right-1/4 animate-pulse-slow"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-xl opacity-20"></div>

        <div
          className={`relative bg-white p-12 rounded-3xl shadow-2xl transition-transform hover:scale-[1.03] animate-fade-in ${
            error ? "animate-shake" : ""
          }`}
        >
          <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {/* Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className={`peer w-full pl-12 p-4 rounded-xl bg-gray-100 text-gray-800 placeholder-transparent border ${
                  error ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition-all`}
              />
              <label className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-400 text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base transition-all">
                Email
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  checkStrength(e.target.value);
                }}
                placeholder="Password"
                required
                className={`peer w-full p-4 rounded-xl bg-gray-100 text-gray-800 placeholder-transparent border ${
                  error ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition-all`}
              />
              <label className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base transition-all">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {/* Strength */}
            {password && (
              <div className="flex flex-col gap-1">
                <div className="h-2 w-full rounded-xl bg-gray-200">
                  <div
                    className={`h-2 rounded-xl transition-all ${
                      strength === 1
                        ? "w-1/4 bg-red-500"
                        : strength === 2
                        ? "w-1/2 bg-yellow-400"
                        : strength === 3
                        ? "w-3/4 bg-blue-400"
                        : strength === 4
                        ? "w-full bg-green-500"
                        : ""
                    }`}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {strength === 1 && "Weak password"}
                  {strength === 2 && "Fair password"}
                  {strength === 3 && "Good password"}
                  {strength === 4 && "Strong password"}
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm text-center animate-pulse">
                {error}
              </p>
            )}

            {/* Remember + Help */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="rounded border-gray-300 focus:ring-1 focus:ring-blue-500"
                />
                Remember me
              </label>
              <a href="#" className="text-blue-600 hover:underline">
                Need help?
              </a>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-3 transition-all shadow-lg hover:shadow-xl active:scale-95"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-gray-400 text-center mt-6 text-sm">
            Secure login for your professional workspace
          </p>
        </div>

        <style>
          {`
            @keyframes shake { 0%,100% {transform:translateX(0);} 25%{transform:translateX(-5px);} 50%{transform:translateX(5px);} 75%{transform:translateX(-5px);} }
            .animate-shake { animation: shake 0.4s; }

            @keyframes spin-slow { 0%{transform:rotate(0deg);} 100%{transform:rotate(360deg);} }
            .animate-spin-slow { animation: spin-slow 40s linear infinite; }

            @keyframes pulse-slow { 0%,100%{transform:scale(1);} 50%{transform:scale(1.05);} }
            .animate-pulse-slow { animation: pulse-slow 10s ease-in-out infinite; }

            @keyframes fade-in { from {opacity:0; transform: translateY(-20px);} to {opacity:1; transform:translateY(0);} }
            .animate-fade-in { animation: fade-in 0.6s ease forwards; }
          `}
        </style>
      </div>
    </div>
  );
};

export default Login;
