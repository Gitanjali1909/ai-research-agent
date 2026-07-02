import React, { useState } from "react";
import { Search } from "lucide-react";

interface QueryBoxProps {
  onSearch: (topic: string, maxQueries: number) => void;
  isLoading: boolean;
}

export default function QueryBox({ onSearch, isLoading }: QueryBoxProps) {
  const [topic, setTopic] = useState("");
  const [maxQueries, setMaxQueries] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    onSearch(topic, maxQueries);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto p-6 rounded-2xl bg-card border border-border/80 shadow-xl transition-all duration-300 hover:border-indigo-500/30"
    >
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="topic" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Research Topic or Question
          </label>
          <div className="relative">
            <input
              id="topic"
              type="text"
              placeholder="e.g. Gemini 1.5 Pro architecture, quantum computing status..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm md:text-base"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="queries-slider" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Number of search queries
              </label>
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                {maxQueries} queries
              </span>
            </div>
            <input
              id="queries-slider"
              type="range"
              min="3"
              max="5"
              step="1"
              value={maxQueries}
              onChange={(e) => setMaxQueries(parseInt(e.target.value))}
              disabled={isLoading}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-55 disabled:cursor-not-allowed"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-1">
              <span>3 (Fast)</span>
              <span>4 (Balanced)</span>
              <span>5 (Thorough)</span>
            </div>
          </div>

          <div className="flex items-end justify-end">
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98] transition-all duration-200 shadow-md shadow-indigo-600/20 disabled:bg-indigo-600/40 disabled:scale-100 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? "Researching..." : "Start Research"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}