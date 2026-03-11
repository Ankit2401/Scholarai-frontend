import { useState } from "react";
import { useTheme, useAuth } from "../App";

import { AUTH_API as API } from "../config";
export default function AuthPage() {
  const { dark } = useTheme();
  const { login } = useAuth();
  const [mode, setMode]       = useState("login"); // "login" | "register"
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setError("");
    if (!form.email || !form.password) return setError("Please fill all fields.");
    if (mode === "register" && !form.name) return setError("Name is required.");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Authentication failed");
      login(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex ${dark ? "bg-[#0b0f1a] text-[#e8e2d9]" : "bg-[#f8f5f0] text-[#0f172a]"}`}>

      {/* Left Panel – Brand */}
      <div className={`hidden lg:flex flex-col justify-between w-1/2 p-16
        ${dark ? "bg-[#0d1424] border-r border-[#1e2a3a]" : "bg-amber-500"}`}>
        <div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl mb-12
            ${dark ? "bg-amber-500 text-[#0b0f1a]" : "bg-white text-amber-600"}`}>S</div>
          <h1 className={`text-5xl font-bold leading-tight mb-4
            ${dark ? "text-white" : "text-white"}`}>
            Research,<br />
            <span className={dark ? "text-amber-400" : "text-amber-900"}>Reimagined.</span>
          </h1>
          <p className={`text-lg leading-relaxed max-w-sm ${dark ? "text-[#8a9ab5]" : "text-amber-100"}`}>
            Upload any academic paper. Get instant summaries, ask questions, and discover related work — powered by AI.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Papers Analyzed", val: "12K+" },
            { label: "Questions Answered", val: "48K+" },
            { label: "Researchers", val: "2.1K+" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-4 ${dark ? "bg-[#1a2335] border border-[#263244]" : "bg-amber-400/40"}`}>
              <div className={`text-2xl font-bold mb-1 ${dark ? "text-amber-400" : "text-white"}`}>{s.val}</div>
              <div className={`text-xs ${dark ? "text-[#6b7b94]" : "text-amber-100"}`}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel – Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className={`text-sm ${dark ? "text-[#8a9ab5]" : "text-[#6b7280]"}`}>
              {mode === "login"
                ? "Sign in to continue your research"
                : "Join thousands of researchers using ScholarAI"}
            </p>
          </div>

          <div className="space-y-4">
            {mode === "register" && (
              <div>
                <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider
                  ${dark ? "text-[#8a9ab5]" : "text-[#6b7280]"}`}>Full Name</label>
                <input
                  name="name" value={form.name} onChange={handle}
                  placeholder="Dr. Jane Smith"
                  className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all
                    focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
                    ${dark
                      ? "bg-[#111827] border-[#1e2a3a] text-[#e8e2d9] placeholder-[#3d4f63]"
                      : "bg-white border-[#e2ddd5] text-[#0f172a] placeholder-[#9ca3af]"}`}
                />
              </div>
            )}

            <div>
              <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider
                ${dark ? "text-[#8a9ab5]" : "text-[#6b7280]"}`}>Email</label>
              <input
                name="email" type="email" value={form.email} onChange={handle}
                placeholder="researcher@university.edu"
                className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all
                  focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
                  ${dark
                    ? "bg-[#111827] border-[#1e2a3a] text-[#e8e2d9] placeholder-[#3d4f63]"
                    : "bg-white border-[#e2ddd5] text-[#0f172a] placeholder-[#9ca3af]"}`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider
                ${dark ? "text-[#8a9ab5]" : "text-[#6b7280]"}`}>Password</label>
              <input
                name="password" type="password" value={form.password} onChange={handle}
                placeholder="••••••••"
                onKeyDown={e => e.key === "Enter" && submit()}
                className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all
                  focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
                  ${dark
                    ? "bg-[#111827] border-[#1e2a3a] text-[#e8e2d9] placeholder-[#3d4f63]"
                    : "bg-white border-[#e2ddd5] text-[#0f172a] placeholder-[#9ca3af]"}`}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">
                <span>⚠</span> {error}
              </div>
            )}

            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm
                transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40">
              {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </div>

          <p className={`mt-6 text-center text-sm ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setMode(m => m === "login" ? "register" : "login"); setError(""); }}
              className="text-amber-500 font-semibold hover:text-amber-400">
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
