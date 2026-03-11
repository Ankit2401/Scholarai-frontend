import { useState, useRef, useEffect } from "react";
import { useTheme, usePaper } from "../App";
import { ML_API as API } from "../config";
const SAMPLE_QS = [
  "What is the main contribution of this paper?",
  "What dataset was used in the experiments?",
  "What are the limitations of this work?",
  "How does this approach compare to prior work?",
];

export default function QAPage({ setPage }) {
  const { dark }         = useTheme();
  const { paper }        = usePaper();
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef = useRef();
  const token = localStorage.getItem("scholar_token");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ask = async (question = input.trim()) => {
    if (!question || !paper) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text: question }]);
    setLoading(true);
    try {
      const res = await fetch(`${API}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paper_id: paper.paper_id, question }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Q&A failed");
      setMessages(m => [...m, { role: "assistant", text: data.answer, citations: data.citations }]);
    } catch (err) {
      setMessages(m => [...m, { role: "error", text: err.message }]);
    } finally {
      setLoading(false);
    }
  };

  if (!paper) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className={`rounded-2xl p-8 text-center border ${dark ? "bg-[#0d1424] border-[#1e2a3a]" : "bg-white border-[#e2ddd5]"}`}>
          <div className="text-4xl mb-4">💬</div>
          <h3 className={`font-semibold mb-2 ${dark ? "text-[#e8e2d9]" : "text-[#0f172a]"}`}>No paper loaded</h3>
          <p className={`text-sm mb-5 ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>Upload a paper to start asking questions</p>
          <button onClick={() => setPage("upload")}
            className="px-5 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-400 transition-colors">
            Upload Paper
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1 tracking-tight">Ask Questions</h1>
        <p className={`text-sm ${dark ? "text-[#8a9ab5]" : "text-[#6b7280]"}`}>{paper.title}</p>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 overflow-y-auto rounded-2xl border p-4 mb-4 space-y-4
        ${dark ? "bg-[#0d1424] border-[#1e2a3a]" : "bg-white border-[#e2ddd5]"}`}
        style={{ minHeight: 0 }}>

        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <div className="text-4xl mb-4">🔬</div>
            <p className={`font-medium mb-1 ${dark ? "text-[#e8e2d9]" : "text-[#0f172a]"}`}>Ask anything about this paper</p>
            <p className={`text-sm mb-6 ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>Try one of these questions:</p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-md">
              {SAMPLE_QS.map(q => (
                <button key={q} onClick={() => ask(q)}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all
                    ${dark ? "bg-[#1a2335] hover:bg-[#1e2a3a] text-[#8a9ab5] hover:text-[#c8d4e8] border border-[#1e2a3a]"
                           : "bg-[#f8f5f0] hover:bg-amber-50 text-[#6b7280] hover:text-[#374151] border border-[#e2ddd5]"}`}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "user" ? (
              <div className="max-w-xs px-4 py-2.5 rounded-2xl rounded-tr-sm bg-amber-500 text-white text-sm">
                {msg.text}
              </div>
            ) : msg.role === "error" ? (
              <div className="max-w-lg px-4 py-2.5 rounded-2xl bg-red-900/20 border border-red-800/30 text-red-400 text-sm">
                ⚠ {msg.text}
              </div>
            ) : (
              <div className={`max-w-lg rounded-2xl rounded-tl-sm p-4 border
                ${dark ? "bg-[#111827] border-[#1e2a3a]" : "bg-[#f8f5f0] border-[#e2ddd5]"}`}>
                <p className={`text-sm leading-relaxed mb-3 ${dark ? "text-[#c8d4e8]" : "text-[#374151]"}`}>
                  {msg.text}
                </p>
                {msg.citations?.length > 0 && (
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? "text-[#5a6a82]" : "text-[#9ca3af]"}`}>
                      Sources
                    </p>
                    <div className="space-y-1.5">
                      {msg.citations.map((c, ci) => (
                        <div key={ci} className={`text-xs px-3 py-1.5 rounded-lg font-mono
                          ${dark ? "bg-[#1a2335] text-[#8a9ab5]" : "bg-white border border-[#e2ddd5] text-[#6b7280]"}`}>
                          [{ci + 1}] {c}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className={`px-4 py-3 rounded-2xl rounded-tl-sm border
              ${dark ? "bg-[#111827] border-[#1e2a3a]" : "bg-[#f8f5f0] border-[#e2ddd5]"}`}>
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <span key={i} className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={`flex gap-2 p-1 rounded-2xl border ${dark ? "bg-[#0d1424] border-[#1e2a3a]" : "bg-white border-[#e2ddd5]"}`}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && ask()}
          placeholder="Ask a question about this paper…"
          className={`flex-1 px-4 py-2.5 bg-transparent outline-none text-sm
            ${dark ? "text-[#e8e2d9] placeholder-[#3d4f63]" : "text-[#0f172a] placeholder-[#9ca3af]"}`}
        />
        <button
          onClick={() => ask()}
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold
            transition-colors disabled:opacity-40 disabled:cursor-not-allowed m-1">
          Send
        </button>
      </div>
    </div>
  );
}
