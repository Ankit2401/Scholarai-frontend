import { useState, useEffect } from "react";
import { useTheme, usePaper } from "../App";
import { AUTH_API } from "../config";
export default function HistoryPage({ setPage }) {
  const { dark } = useTheme();
  const { setPaper } = usePaper();
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("scholar_token");
    fetch(`${AUTH_API}/history`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => setHistory(data.history || []))
    .catch(() => {
      // fallback to localStorage if Node server is down
      const raw = localStorage.getItem("scholar_history");
      if (raw) try { setHistory(JSON.parse(raw)); } catch {}
    });
}, []);

  const clearHistory = () => {
    localStorage.removeItem("scholar_history");
    setHistory([]);
  };

  const restore = (item) => {
    setPaper({ paper_id: item.paper_id, title: item.title, num_chunks: item.num_chunks });
    setPage("dashboard");
  };

  const filtered = history.filter(h =>
    h.title?.toLowerCase().includes(search.toLowerCase()) ||
    h.paper_id?.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Session History</h1>
          <p className={`text-sm ${dark ? "text-[#8a9ab5]" : "text-[#6b7280]"}`}>
            {history.length} paper{history.length !== 1 ? "s" : ""} analyzed this session
          </p>
        </div>
        {history.length > 0 && (
          <button onClick={clearHistory}
            className={`text-xs font-medium mt-2 transition-colors
              ${dark ? "text-[#5a6a82] hover:text-red-400" : "text-[#9ca3af] hover:text-red-500"}`}>
            Clear history
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className="mb-5">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or ID…"
            className={`w-full max-w-sm px-4 py-2.5 rounded-xl text-sm border outline-none transition-all
              focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500
              ${dark
                ? "bg-[#0d1424] border-[#1e2a3a] text-[#e8e2d9] placeholder-[#3d4f63]"
                : "bg-white border-[#e2ddd5] text-[#0f172a] placeholder-[#9ca3af]"}`}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className={`rounded-2xl p-12 border text-center ${dark ? "bg-[#0d1424] border-[#1e2a3a]" : "bg-white border-[#e2ddd5]"}`}>
          <div className="text-4xl mb-4">⏱</div>
          <h3 className={`font-semibold mb-2 ${dark ? "text-[#e8e2d9]" : "text-[#0f172a]"}`}>
            {search ? "No results found" : "No history yet"}
          </h3>
          <p className={`text-sm mb-5 ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>
            {search ? "Try a different search term" : "Uploaded papers will appear here"}
          </p>
          {!search && (
            <button onClick={() => setPage("upload")}
              className="px-5 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-400 transition-colors">
              Upload a Paper
            </button>
          )}
        </div>
      ) : (
        <div className={`rounded-2xl border overflow-hidden ${dark ? "border-[#1e2a3a]" : "border-[#e2ddd5]"}`}>
          {/* Table Header */}
          <div className={`grid grid-cols-12 px-5 py-3 text-xs font-semibold uppercase tracking-wider
            ${dark ? "bg-[#0d1424] text-[#5a6a82] border-b border-[#1e2a3a]" : "bg-[#f8f5f0] text-[#9ca3af] border-b border-[#e2ddd5]"}`}>
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Paper ID</div>
            <div className="col-span-2 text-center">Chunks</div>
            <div className="col-span-2">Uploaded</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {/* Table Rows */}
          {filtered.map((item, i) => (
            <div key={i}
              className={`grid grid-cols-12 px-5 py-4 items-center transition-colors
                ${i < filtered.length - 1 ? (dark ? "border-b border-[#1e2a3a]" : "border-b border-[#f0ede8]") : ""}
                ${dark ? "bg-[#0b0f1a] hover:bg-[#0d1424]" : "bg-white hover:bg-[#fdf9f5]"}`}>

              <div className="col-span-5 pr-3">
                <p className={`text-sm font-medium leading-tight truncate ${dark ? "text-[#e8e2d9]" : "text-[#0f172a]"}`}>
                  {item.title || "Untitled"}
                </p>
                {item.message && (
                  <p className={`text-xs mt-0.5 ${dark ? "text-[#3d4f63]" : "text-[#d1ccc4]"}`}>
                    {item.message}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${dark ? "bg-[#1a2335] text-[#5a6a82]" : "bg-[#f0ede8] text-[#9ca3af]"}`}>
                  {item.paper_id}
                </span>
              </div>

              <div className={`col-span-2 text-center text-sm ${dark ? "text-[#8a9ab5]" : "text-[#6b7280]"}`}>
                {item.num_chunks}
              </div>

              <div className={`col-span-2 text-xs ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>
                {item.uploaded_at ? fmt(item.uploaded_at) : "—"}
              </div>

              <div className="col-span-1 flex justify-end">
                <button onClick={() => restore(item)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors
                    ${dark ? "text-amber-400 hover:bg-amber-500/10" : "text-amber-600 hover:bg-amber-50"}`}>
                  Load
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MongoDB note */}
      <div className={`mt-6 rounded-xl p-4 border text-xs ${dark ? "bg-[#0d1424] border-[#1e2a3a] text-[#5a6a82]" : "bg-[#f8f5f0] border-[#e2ddd5] text-[#9ca3af]"}`}>
        💾 History is currently stored in browser session storage. Connect the <code className="font-mono">GET /api/history</code> endpoint from your MongoDB backend to persist across sessions.
      </div>
    </div>
  );
}
