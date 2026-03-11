import { useState, useRef } from "react";
import { useTheme, usePaper } from "../App";

import { ML_API, AUTH_API } from "../config";
const API = ML_API;
export default function UploadPage({ setPage }) {
  const { dark }           = useTheme();
  const { setPaper }       = usePaper();
  const [file, setFile]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [meta, setMeta] = useState({ authors: null, year: null });
  const inputRef = useRef();

  const token = localStorage.getItem("scholar_token");

  const handleFile = f => {
    if (!f) return;
    if (!f.name.endsWith(".pdf")) return setError("Only PDF files are accepted.");
    setFile(f); setError(""); setResult(null);
  };
  const fetchMeta = async (paper_id) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const [authorsRes, yearRes] = await Promise.all([
    fetch(`${API}/ask`, {
      method: "POST",
      headers,
      body: JSON.stringify({ paper_id, question: "Who are the authors of this paper? List only their names." }),
    }),
    fetch(`${API}/ask`, {
      method: "POST",
      headers,
      body: JSON.stringify({ paper_id, question: "What year appears in this paper? Look for a 4-digit number starting with 20 or 19 near the title, authors, or copyright notice. Reply with only the year number." }),
    }),
  ]);

  const authorsData = await authorsRes.json();
  const yearData    = await yearRes.json();

  setMeta({
    authors: authorsData.answer || null,
    year:    yearData.answer    || null,
  });
};

  const upload = async () => {
    if (!file) return setError("Please select a PDF file.");
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Upload failed");
      setResult(data);
      setPaper(data);
      fetchMeta(data.paper_id);
  // Save to Node history backend
  await fetch(`${AUTH_API}/history`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ paper_id: data.paper_id, title: data.title, num_chunks: data.num_chunks, message: data.message }),
  });
      // Save to history in localStorage
      const hist = JSON.parse(localStorage.getItem("scholar_history") || "[]");
      hist.unshift({ ...data, uploaded_at: new Date().toISOString() });
      localStorage.setItem("scholar_history", JSON.stringify(hist.slice(0, 50)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Upload Paper</h1>
        <p className={`text-sm ${dark ? "text-[#8a9ab5]" : "text-[#6b7280]"}`}>
          Upload a PDF research paper to begin analysis
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => !file && inputRef.current.click()}
        className={`rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
          flex flex-col items-center justify-center p-12 mb-6 text-center
          ${dragOver
            ? "border-amber-500 bg-amber-500/5"
            : file
              ? dark ? "border-emerald-700 bg-emerald-900/10" : "border-emerald-400 bg-emerald-50"
              : dark ? "border-[#1e2a3a] hover:border-[#2d4060] bg-[#0d1424]" : "border-[#e2ddd5] hover:border-amber-300 bg-white"}`}>
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />

        {file ? (
          <>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4
              ${dark ? "bg-emerald-900/40" : "bg-emerald-100"}`}>📄</div>
            <p className={`font-semibold mb-1 ${dark ? "text-[#e8e2d9]" : "text-[#0f172a]"}`}>{file.name}</p>
            <p className={`text-sm ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>
              {(file.size / 1024).toFixed(0)} KB
            </p>
            <button
              onClick={e => { e.stopPropagation(); setFile(null); setResult(null); }}
              className={`mt-3 text-xs font-medium ${dark ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-600"}`}>
              Remove
            </button>
          </>
        ) : (
          <>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4
              ${dark ? "bg-[#1a2335]" : "bg-amber-50"}`}>☁</div>
            <p className={`font-semibold mb-1 ${dark ? "text-[#e8e2d9]" : "text-[#0f172a]"}`}>
              Drop your PDF here
            </p>
            <p className={`text-sm ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>
              or click to browse — PDF only
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-xl px-4 py-3">
          ⚠ {error}
        </div>
      )}

      <button
        onClick={upload}
        disabled={!file || loading}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-150
          shadow-lg disabled:opacity-40 disabled:cursor-not-allowed
          ${dark
            ? "bg-amber-500 hover:bg-amber-400 text-[#0b0f1a] shadow-amber-500/20"
            : "bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/25"}`}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing paper…
          </span>
        ) : "Upload & Ingest Paper"}
      </button>

      {/* Success Result */}
      {result && (
        <div className={`mt-6 rounded-2xl p-6 border ${dark ? "bg-[#0d1424] border-[#1e2a3a]" : "bg-white border-[#e2ddd5]"}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-emerald-500">✓</span>
            <span className={`font-semibold text-sm ${dark ? "text-emerald-400" : "text-emerald-700"}`}>
              Paper ingested successfully
            </span>
          </div>
          <p className={`font-semibold text-base mb-3 ${dark ? "text-[#e8e2d9]" : "text-[#0f172a]"}`}>
            {result.title}
          </p>
          <div className="flex items-center gap-4 mb-5">
            <div className={`text-xs font-mono px-2.5 py-1 rounded-lg ${dark ? "bg-[#1a2335] text-[#8a9ab5]" : "bg-[#f0ede8] text-[#6b7280]"}`}>
              ID: {result.paper_id}
            </div>
            <div className={`text-xs font-mono px-2.5 py-1 rounded-lg ${dark ? "bg-[#1a2335] text-[#8a9ab5]" : "bg-[#f0ede8] text-[#6b7280]"}`}>
              {result.num_chunks} chunks
            </div>
          </div>
          <p className={`text-xs mb-4 ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>{result.message}</p>
          {meta.authors && (
          <p className={`text-xs mb-1 ${dark ? "text-[#8a9ab5]" : "text-[#6b7280]"}`}>
              ✍ {meta.authors}
          </p>
          )}
          {meta.year && (
            <p className={`text-xs font-mono font-medium mb-3 ${dark ? "text-amber-400" : "text-amber-600"}`}>
                📅 {meta.year}
            </p>
            )}
          <div className="flex gap-2">
            {[
              { label: "Summarize", page: "summary" },
              { label: "Ask Questions", page: "qa" },
              { label: "Find Related", page: "recommend" },
            ].map(btn => (
              <button key={btn.page} onClick={() => setPage(btn.page)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                  ${dark ? "bg-[#1e2a3a] text-[#c8d4e8] hover:bg-amber-500/20 hover:text-amber-400" : "bg-[#f0ede8] text-[#374151] hover:bg-amber-100"}`}>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
