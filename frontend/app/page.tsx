"use client";

import { useState, useEffect } from "react";
import { getResearch } from "@/lib/api";
import { ResearchReport } from "@/types";
import QueryBox from "@/components/QueryBox";
import ReportView from "@/components/ReportView";
import Loader from "@/components/Loader";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ResearchReport[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("research_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveToHistory = (newReport: ResearchReport) => {
    try {
      const filtered = history.filter(
        (item) => item.topic.toLowerCase() !== newReport.topic.toLowerCase()
      );
      const updated = [newReport, ...filtered].slice(0, 3);
      setHistory(updated);
      localStorage.setItem("research_history", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async (topic: string, maxQueries: number) => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const data = await getResearch(topic, maxQueries);
      setReport(data);
      saveToHistory(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during search pipeline execution.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col font-sans">
      {/* Small elegant header */}
      <header className="py-6 px-6 border-b border-zinc-900/40 print:hidden">
        <div className="max-w-[680px] mx-auto flex items-center justify-between">
          <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase select-none">
            Research
          </span>
          {/* Explicitly labeled single last search link */}
          {history.length > 0 && !loading && (
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 select-none">
              <span>Last search:</span>
              <button
                onClick={() => { setReport(history[0]); setError(null); }}
                className={`transition-colors text-left ${
                  report?.topic.toLowerCase() === history[0].topic.toLowerCase()
                    ? "text-zinc-300 underline underline-offset-4 decoration-zinc-650"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                title={history[0].topic}
              >
                <span className="max-w-[150px] truncate block">{history[0].topic}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 w-full max-w-[680px] mx-auto px-4 md:px-0 py-16 flex flex-col gap-10">
        <div className="space-y-6 print:hidden">
          {!report && !loading && (
            <div className="space-y-1.5 animate-fadeIn">
              <h2 className="text-xl font-normal text-zinc-300">
                New Synthesis
              </h2>
              <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
                Query planning, Tavily search aggregation, and vector retrieval report compile.
              </p>
            </div>
          )}
          <QueryBox onSearch={handleSearch} isLoading={loading} />
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/20 text-zinc-400 text-[13px] flex gap-3 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-zinc-650 pt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-zinc-350">Search Failed</h4>
              <p className="leading-relaxed opacity-95">{error}</p>
            </div>
          </div>
        )}

        {loading && <Loader />}

        {report && !loading && <ReportView data={report} />}
      </main>
    </div>
  );
}