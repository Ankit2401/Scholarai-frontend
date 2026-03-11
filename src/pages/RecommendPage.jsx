import { useState } from "react";
import { useTheme, usePaper } from "../App";
import { ML_API as API } from "../config";
export default function RecommendPage({ setPage }) {
  const { dark }         = useTheme();
  const { paper }        = usePaper();
  const [recs, setRecs]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const token = localStorage.getItem("scholar_token");

  const fetch_ = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paper_id: paper.paper_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Recommendations failed");
      setRecs(data.recommendations);
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
          <div className="text-4xl mb-4">🔍</div>
          <h3 className={`font-semibold mb-2 ${dark ? "text-[#e8e2d9]" : "text-[#0f172a]"}`}>No paper loaded</h3>
          <p className={`text-sm mb-5 ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>Upload a paper to discover related work</p>
          <button onClick={() => setPage("upload")}
            className="px-5 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-400 transition-colors">
            Upload Paper
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Related Papers</h1>
          <p className={`text-sm ${dark ? "text-[#8a9ab5]" : "text-[#6b7280]"}`}>{paper.title}</p>
        </div>
        <button onClick={fetch_} disabled={loading}
          className="mt-1 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold
            transition-all disabled:opacity-50 flex items-center gap-2">
          {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {recs ? "↻ Refresh" : loading ? "Searching…" : "Find Related Work"}
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-xl px-4 py-3">
          ⚠ {error}
        </div>
      )}

      {loading && (
        <div className="grid gap-4">
          {[1,2,3].map(i => (
            <div key={i} className={`rounded-2xl p-6 border animate-pulse h-36
              ${dark ? "bg-[#0d1424] border-[#1e2a3a]" : "bg-white border-[#e2ddd5]"}`} />
          ))}
        </div>
      )}

      {recs && (
        <div className="grid gap-4">
          {recs.map((rec, i) => (
            <a key={i} href={rec.url} target="_blank" rel="noreferrer"
              className={`group block rounded-2xl p-6 border transition-all duration-200 hover:-translate-y-0.5
                ${dark
                  ? "bg-[#0d1424] border-[#1e2a3a] hover:border-amber-500/40 hover:bg-[#111827]"
                  : "bg-white border-[#e2ddd5] hover:border-amber-400 hover:shadow-md"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm mb-2 group-hover:text-amber-500 transition-colors
                    ${dark ? "text-[#e8e2d9]" : "text-[#0f172a]"}`}>
                    {rec.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`text-xs ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>
                      {rec.authors?.slice(0, 3).join(", ")}{rec.authors?.length > 3 ? " et al." : ""}
                    </span>
                    {rec.year && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                        ${dark ? "bg-[#1a2335] text-[#8a9ab5]" : "bg-[#f0ede8] text-[#6b7280]"}`}>
                        {rec.year}
                      </span>
                    )}
                    {rec.citation_count != null && (
                      <span className={`text-xs flex items-center gap-1 ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>
                        ◈ {rec.citation_count} citations
                      </span>
                    )}
                    {rec.relevance_score != null && (
                      <span className={`text-xs font-medium text-amber-500`}>
                        {(rec.relevance_score * 100).toFixed(0)}% match
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed line-clamp-2 ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>
                    {rec.abstract}
                  </p>
                </div>
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm
                  transition-colors group-hover:bg-amber-500 group-hover:text-white
                  ${dark ? "bg-[#1a2335] text-[#5a6a82]" : "bg-[#f0ede8] text-[#9ca3af]"}`}>
                  ↗
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {!recs && !loading && (
        <div className={`rounded-2xl p-10 border text-center ${dark ? "bg-[#0d1424] border-[#1e2a3a]" : "bg-white border-[#e2ddd5]"}`}>
          <p className={`text-sm ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>
            Click "Find Related Work" to discover papers similar to yours
          </p>
        </div>
      )}
    </div>
  );
}
