"use client";

import { useState, useEffect } from "react";
import { getResearch } from "@/lib/api";
import { ResearchReport } from "@/types";
import QueryBox from "@/components/QueryBox";
import ReportView from "@/components/ReportView";
import Loader from "@/components/Loader";
import { History, Trash2, Cpu, AlertCircle } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ResearchReport[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("research_history");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load research history:", e);
    }
  }, []);

  const saveToHistory = (newReport: ResearchReport) => {
    try {
      const filteredHistory = history.filter(
        (item) => item.topic.toLowerCase() !== newReport.topic.toLowerCase()
      );
      const updatedHistory = [newReport, ...filteredHistory].slice(0, 3);
      setHistory(updatedHistory);
      localStorage.setItem("research_history", JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save research history:", e);
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
      setError(err.message || "An unexpected error occurred while executing the research agent pipeline.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (selectedReport: ResearchReport) => {
    setReport(selectedReport);
    setError(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("research_history");
  };

  return (
    <main className="min-h-screen py-10 px-4 md:px-8 max-w-5xl mx-auto space-y-8 print:py-0 print:px-0">
      <header className="flex items-center justify-between border-b border-border/60 pb-6 print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 md:text-2xl">
              Research Agent Backend Console
            </h1>
            <p className="text-xs text-slate-400">
              Multi-step intelligence pipeline using OpenAI, Tavily & ChromaDB
            </p>
          </div>
        </div>
      </header>

      <div className="print:hidden">
        <QueryBox onSearch={handleSearch} isLoading={loading} />
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm flex gap-3 max-w-2xl mx-auto print:hidden animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-0.5">Execution Failed</h4>
            <p className="leading-relaxed opacity-90">{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="print:hidden">
          <Loader />
        </div>
      )}

      {report && !loading && (
        <ReportView data={report} />
      )}

      {history.length > 0 && !loading && (
        <section className="border-t border-border/40 pt-8 max-w-2xl mx-auto print:hidden animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <History className="w-4 h-4 text-slate-500" />
              Recent Research History
            </h3>
            <button
              onClick={handleClearHistory}
              className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-2.5">
            {history.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectHistory(item)}
                className={`w-full text-left p-3 rounded-xl border text-sm transition-all flex justify-between items-center group ${
                  report?.topic.toLowerCase() === item.topic.toLowerCase()
                    ? "bg-indigo-500/5 border-indigo-500/30 text-indigo-300"
                    : "bg-slate-900/40 border-border/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <span className="truncate pr-4 font-medium">{item.topic}</span>
                <span className="text-[10px] uppercase font-semibold text-slate-600 group-hover:text-indigo-400 transition-colors">
                  Load Report
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}