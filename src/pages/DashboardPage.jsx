import { useTheme, useAuth, usePaper } from "../App";

const STEPS = [
  { num: "01", title: "Upload Paper",   desc: "Upload any PDF research paper to get started",       page: "upload",    icon: "📄" },
  { num: "02", title: "Summarize",      desc: "Get a structured AI summary in seconds",              page: "summary",   icon: "📋" },
  { num: "03", title: "Ask Questions",  desc: "Query your paper in plain English",                   page: "qa",        icon: "💬" },
  { num: "04", title: "Discover More",  desc: "Find related papers and expand your reading list",    page: "recommend", icon: "🔍" },
];

export default function DashboardPage({ setPage }) {
  const { dark }       = useTheme();
  const { user }       = useAuth();
  const { paper }      = usePaper();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      {/* Hero */}
      <div className="mb-14">
        <p className={`text-sm font-medium mb-2 ${dark ? "text-amber-400" : "text-amber-600"}`}>
          {greeting()}, {user?.name?.split(" ")[0] || "Researcher"} 👋
        </p>
        <h1 className="text-4xl font-bold mb-3 tracking-tight">
          Your Research<br />
          <span className="text-amber-500">Intelligence Hub</span>
        </h1>
        <p className={`text-base max-w-lg ${dark ? "text-[#8a9ab5]" : "text-[#6b7280]"}`}>
          Upload a paper, ask questions, discover related work — all in one place.
        </p>
      </div>

      {/* Active Paper Banner */}
      {paper ? (
        <div className={`mb-10 rounded-2xl p-5 border flex items-center justify-between
          ${dark ? "bg-emerald-900/20 border-emerald-800/40" : "bg-emerald-50 border-emerald-200"}`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-1
              ${dark ? "text-emerald-400" : "text-emerald-700"}`}>Active Paper</p>
            <p className={`font-semibold ${dark ? "text-[#e8e2d9]" : "text-[#0f172a]"}`}>{paper.title}</p>
            <p className={`text-xs mt-0.5 font-mono ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>
              ID: {paper.paper_id} · {paper.num_chunks} chunks
            </p>
          </div>
          <div className="flex gap-2">
            {["summary","qa","recommend"].map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all
                  ${dark ? "bg-[#1e2a3a] text-[#c8d4e8] hover:bg-emerald-800/40" : "bg-white text-[#374151] hover:bg-emerald-100"}`}>
                {p === "qa" ? "Ask" : p === "recommend" ? "Discover" : "Summarize"}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={`mb-10 rounded-2xl p-5 border-2 border-dashed flex items-center gap-4
          ${dark ? "border-[#1e2a3a]" : "border-[#e2ddd5]"}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl
            ${dark ? "bg-[#1a2335]" : "bg-amber-50"}`}>📄</div>
          <div>
            <p className={`font-semibold ${dark ? "text-[#e8e2d9]" : "text-[#0f172a]"}`}>No paper loaded yet</p>
            <p className={`text-xs ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>Upload a PDF to unlock all features</p>
          </div>
          <button onClick={() => setPage("upload")}
            className="ml-auto px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-400 transition-colors">
            Upload Now
          </button>
        </div>
      )}

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map(step => (
          <button key={step.num} onClick={() => setPage(step.page)}
            className={`text-left p-5 rounded-2xl border transition-all duration-200 group hover:-translate-y-0.5
              ${dark
                ? "bg-[#111827] border-[#1e2a3a] hover:border-amber-500/40 hover:bg-[#141d2e]"
                : "bg-white border-[#e2ddd5] hover:border-amber-400 hover:shadow-md"}`}>
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl">{step.icon}</span>
              <span className={`text-xs font-bold font-mono ${dark ? "text-[#2d3f55]" : "text-[#d1ccc4]"}`}>
                {step.num}
              </span>
            </div>
            <h3 className={`font-semibold mb-1.5 text-sm group-hover:text-amber-500 transition-colors
              ${dark ? "text-[#e8e2d9]" : "text-[#0f172a]"}`}>{step.title}</h3>
            <p className={`text-xs leading-relaxed ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>{step.desc}</p>
          </button>
        ))}
      </div>

      {/* Quick links */}
      <div className="mt-8 flex items-center gap-4">
        <button onClick={() => setPage("history")}
          className={`flex items-center gap-2 text-sm font-medium transition-colors
            ${dark ? "text-[#5a6a82] hover:text-amber-400" : "text-[#9ca3af] hover:text-amber-600"}`}>
          ⏱ View session history
        </button>
       
      </div>
    </div>
  );
}
