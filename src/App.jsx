import { useState, useEffect, createContext, useContext } from "react";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import SummaryPage from "./pages/SummaryPage";
import QAPage from "./pages/QAPage";
import RecommendPage from "./pages/RecommendPage";
import HistoryPage from "./pages/HistoryPage";
import Navbar from "./components/Navbar";
// ─── Contexts ───────────────────────────────────────────────────────────────
export const ThemeContext = createContext();
export const AuthContext = createContext();
export const PaperContext = createContext();

export function useTheme() { return useContext(ThemeContext); }
export function useAuth()  { return useContext(AuthContext);  }
export function usePaper() { return useContext(PaperContext); }

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark]     = useState(() => localStorage.getItem("theme") !== "light");
  const [page, setPage]     = useState("dashboard");
  const [user, setUser]     = useState(() => {
    try { return JSON.parse(localStorage.getItem("scholar_user")); } catch { return null; }
  });
  const [paper, setPaper]   = useState(null); // { paper_id, title, num_chunks }
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const login = (userData, token) => {
    localStorage.setItem("scholar_user", JSON.stringify(userData));
    localStorage.setItem("scholar_token", token);
    setUser(userData);
    setPage("dashboard");
  };

  const logout = () => {
    localStorage.removeItem("scholar_user");
    localStorage.removeItem("scholar_token");
    setUser(null);
    setPaper(null);
    setSummary(null);
    setPage("auth");
  };

  if (!user) {
    return (
      <ThemeContext.Provider value={{ dark, setDark }}>
        <AuthContext.Provider value={{ user, login, logout }}>
          <div className={dark ? "dark" : ""}>
            <AuthPage />
          </div>
        </AuthContext.Provider>
      </ThemeContext.Provider>
    );
  }

  const pages = { dashboard: DashboardPage, upload: UploadPage, summary: SummaryPage, qa: QAPage, recommend: RecommendPage, history: HistoryPage };
  const CurrentPage = pages[page] || DashboardPage;

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        <PaperContext.Provider value={{ paper, setPaper, summary, setSummary }}>
          <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-[#0b0f1a] text-[#e8e2d9]" : "bg-[#f8f5f0] text-[#0f172a]"}`}>
            <Navbar page={page} setPage={setPage} />
            <main className="pt-16">
              <CurrentPage setPage={setPage} />
            </main>
          </div>
        </PaperContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
