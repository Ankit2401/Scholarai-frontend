import { useTheme, useAuth } from "../App";
import { usePaper } from "../App";

const NAV_ITEMS = [
  { id: "dashboard", label: "Home",        icon: "⌂" },
  { id: "upload",    label: "Upload",      icon: "↑" },
  { id: "summary",   label: "Summary",     icon: "≡" },
  { id: "qa",        label: "Ask",         icon: "?" },
  { id: "recommend", label: "Discover",    icon: "◈" },
  { id: "history",   label: "History",     icon: "⏱" },
];

export default function Navbar({ page, setPage }) {
  const { dark, setDark } = useTheme();
  const { user, logout }  = useAuth();
  const { paper }         = usePaper();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 border-b transition-all duration-300
      ${dark
        ? "bg-[#0b0f1a]/95 border-[#1e2a3a] backdrop-blur-xl"
        : "bg-[#f8f5f0]/95 border-[#e2ddd5] backdrop-blur-xl"}`}>
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => setPage("dashboard")} className="flex items-center gap-2 group">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
            ${dark ? "bg-amber-500 text-[#0b0f1a]" : "bg-amber-500 text-white"}`}>
            S
          </div>
          <span className={`font-semibold text-base tracking-tight ${dark ? "text-[#e8e2d9]" : "text-[#0f172a]"}`}>
            Scholar<span className="text-amber-500">AI</span>
          </span>
        </button>

        {/* Nav Items */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
                ${page === item.id
                  ? "bg-amber-500 text-white shadow-sm"
                  : dark
                    ? "text-[#8a9ab5] hover:text-[#e8e2d9] hover:bg-[#1e2a3a]"
                    : "text-[#6b7280] hover:text-[#0f172a] hover:bg-[#ede9e3]"}`}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {paper && (
            <span className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-mono
              ${dark ? "bg-emerald-900/40 text-emerald-400 border border-emerald-800" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {paper.paper_id}
            </span>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setDark(d => !d)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all
              ${dark ? "bg-[#1e2a3a] text-amber-400 hover:bg-[#263244]" : "bg-[#ede9e3] text-slate-600 hover:bg-[#e2ddd5]"}`}
            title="Toggle theme">
            {dark ? "☀" : "☾"}
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${dark ? "bg-[#1e2a3a] text-amber-400" : "bg-amber-100 text-amber-700"}`}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <button onClick={logout}
              className={`text-xs font-medium ${dark ? "text-[#5a6a82] hover:text-red-400" : "text-[#9ca3af] hover:text-red-500"} transition-colors`}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
