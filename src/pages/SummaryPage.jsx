import { useState } from "react";
import { useTheme, usePaper } from "../App";
import { ML_API as API } from "../config";
const FIELDS = [
  { key: "problem",      label: "Problem Statement", icon: "🎯", color: "amber" },
  { key: "methodology",  label: "Methodology",        icon: "⚗",  color: "blue"  },
  { key: "dataset",      label: "Dataset",            icon: "🗄",  color: "violet"},
  { key: "findings",     label: "Key Findings",       icon: "💡", color: "emerald"},
  { key: "limitations",  label: "Limitations",        icon: "⚠",  color: "rose"  },
];

const colorMap = {
  amber:   { dark: "border-amber-800/40 bg-amber-900/10",   light: "border-amber-200 bg-amber-50",   badge: "text-amber-500" },
  blue:    { dark: "border-blue-800/40 bg-blue-900/10",     light: "border-blue-200 bg-blue-50",     badge: "text-blue-500" },
  violet:  { dark: "border-violet-800/40 bg-violet-900/10", light: "border-violet-200 bg-violet-50", badge: "text-violet-500" },
  emerald: { dark: "border-emerald-800/40 bg-emerald-900/10", light: "border-emerald-200 bg-emerald-50", badge: "text-emerald-500" },
  rose:    { dark: "border-rose-800/40 bg-rose-900/10",     light: "border-rose-200 bg-rose-50",     badge: "text-rose-500" },
};

export default function SummaryPage({ setPage }) {
  const { dark }             = useTheme();
  const { paper, summary, setSummary } = usePaper();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const token = localStorage.getItem("scholar_token");

  const fetchSummary = async () => {
    if (!paper) return;
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paper_id: paper.paper_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Summarization failed");
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!paper) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className={`rounded-2xl p-8 text-center border ${dark ? "bg-[#0d1424] border-[#1e2a3a]" : "bg-white border-[#e2ddd5]"}`}>
          <div className="text-4xl mb-4">📄</div>
          <h3 className={`font-semibold mb-2 ${dark ? "text-[#e8e2d9]" : "text-[#0f172a]"}`}>No paper uploaded yet</h3>
          <p className={`text-sm mb-5 ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>Upload a paper first to generate a summary</p>
          <button onClick={() => setPage("upload")}
            className="px-5 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-400 transition-colors">
            Upload Paper
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Summary</h1>
          <p className={`text-sm ${dark ? "text-[#8a9ab5]" : "text-[#6b7280]"}`}>{paper.title}</p>
        </div>
        {!summary && (
          <button onClick={fetchSummary} disabled={loading}
            className="mt-1 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold
              transition-all disabled:opacity-50 flex items-center gap-2">
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? "Generating…" : "Generate Summary"}
          </button>
        )}
        {summary && (
          <button onClick={() => { setSummary(null); fetchSummary(); }} disabled={loading}
            className={`mt-1 text-xs font-medium transition-colors ${dark ? "text-[#5a6a82] hover:text-amber-400" : "text-[#9ca3af] hover:text-amber-600"}`}>
            ↻ Regenerate
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-xl px-4 py-3">
          ⚠ {error}
        </div>
      )}

      {loading && (
        <div className="grid gap-4">
          {FIELDS.map(f => (
            <div key={f.key} className={`rounded-2xl p-5 border animate-pulse h-28
              ${dark ? "bg-[#0d1424] border-[#1e2a3a]" : "bg-white border-[#e2ddd5]"}`} />
          ))}
        </div>
      )}

      {summary && (
        <div className="grid gap-4">
          {FIELDS.map(f => {
            const c = colorMap[f.color];
            return (
              <div key={f.key}
                className={`rounded-2xl p-5 border ${dark ? c.dark : c.light}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span>{f.icon}</span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${c.badge}`}>{f.label}</span>
                </div>
                <p className={`text-sm leading-relaxed ${dark ? "text-[#c8d4e8]" : "text-[#374151]"}`}>
                  {summary[f.key] || "Not available"}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {!summary && !loading && (
        <div className={`rounded-2xl p-10 border text-center ${dark ? "bg-[#0d1424] border-[#1e2a3a]" : "bg-white border-[#e2ddd5]"}`}>
          <p className={`text-sm ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>
            Click "Generate Summary" to analyze this paper
          </p>
        </div>
      )}
    </div>
  );
}
