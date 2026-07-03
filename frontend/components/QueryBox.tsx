import React, { useState } from "react";
import { Sliders } from "lucide-react";

interface QueryBoxProps {
  onSearch: (topic: string, maxQueries: number) => void;
  isLoading: boolean;
}

export default function QueryBox({ onSearch, isLoading }: QueryBoxProps) {
  const [topic, setTopic] = useState("");
  const [maxQueries, setMaxQueries] = useState(3);
  const [showConfig, setShowConfig] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    onSearch(topic, maxQueries);
  };

  return (
    <div className="w-full max-w-[680px] mx-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-1.5 transition-all duration-200 focus-within:border-zinc-700"
      >
        <div className="flex items-center gap-3 px-3">
          <input
            id="topic-input"
            type="text"
            placeholder="Search topic or ask a question..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
            required
            aria-label="Search topic"
            className="flex-1 bg-transparent py-2.5 text-zinc-200 placeholder-zinc-500 focus:outline-none text-[15px] disabled:opacity-60"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              disabled={isLoading}
              aria-label="Toggle research depth settings"
              className={`p-2 rounded-lg text-zinc-500 hover:text-zinc-350 hover:bg-zinc-900/60 transition-all ${
                showConfig ? "bg-zinc-900 text-zinc-300" : ""
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="px-4 py-2 bg-zinc-200 text-zinc-900 text-xs font-semibold rounded-lg hover:bg-zinc-100 disabled:bg-zinc-900 disabled:text-zinc-600 transition-all active:scale-[0.98]"
            >
              {isLoading ? "Searching" : "Search"}
            </button>
          </div>
        </div>

        {showConfig && (
          <div className="border-t border-zinc-900/60 mt-1.5 pt-3 pb-2 px-3 animate-fadeIn">
            <div className="flex items-center justify-between gap-4">
              
              {/* proper label added */}
              <label
                htmlFor="depth-range"
                className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider"
              >
                Research Depth
              </label>

              <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                <input
                  id="depth-range"
                  type="range"
                  min="3"
                  max="5"
                  step="1"
                  value={maxQueries}
                  onChange={(e) => setMaxQueries(parseInt(e.target.value))}
                  disabled={isLoading}
                  aria-label="Select research depth"
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-300"
                />

                <span className="text-[11px] font-mono font-medium text-zinc-400 w-10 text-right">
                  {maxQueries} q
                </span>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}