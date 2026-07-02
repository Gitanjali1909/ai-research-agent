import React, { useState } from "react";
import { ResearchReport } from "@/types";
import { Copy, Check, FileDown, ExternalLink, BookOpen, Layers, Lightbulb, Compass } from "lucide-react";

interface ReportViewProps {
  data: ResearchReport;
}

export default function ReportView({ data }: ReportViewProps) {
  const [copied, setCopied] = useState(false);

  const getMarkdown = () => {
    return `# Research Report: ${data.topic}\n\n` +
      `## Overview\n${data.overview}\n\n` +
      `## Key Insights\n${data.key_insights.map((k) => `- ${k}`).join("\n")}\n\n` +
      `## Comparisons & Analysis\n${data.comparisons.map((c) => `- ${c}`).join("\n")}\n\n` +
      `## Conclusion\n${data.conclusion}\n\n` +
      `## Sources\n${data.sources.map((s) => `- [${s.title}](${s.url})`).join("\n")}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy report:", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 animate-fadeIn print:shadow-none print:border-none">
      <div className="flex justify-between items-center mb-4 print:hidden gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
          Analysis Ready
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-border text-slate-300 hover:text-white rounded-xl text-xs hover:border-slate-700 transition-all active:scale-95"
            title="Copy Report as Markdown"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-border text-slate-300 hover:text-white rounded-xl text-xs hover:border-slate-700 transition-all active:scale-95"
            title="Export report to PDF / Print"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      <article className="p-8 md:p-10 rounded-2xl bg-card border border-border/80 shadow-2xl space-y-8 print:p-0 print:bg-white print:text-black">
        <div className="border-b border-border/80 pb-6 print:border-slate-300">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight print:text-black print:text-2xl">
            {data.topic}
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-mono print:text-slate-600">
            Synthesized by Autonomous Research Agent
          </p>
        </div>

        <section className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400 print:text-slate-800 print:text-xs">
            <BookOpen className="w-4 h-4 text-indigo-400 print:hidden" />
            Overview
          </h3>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed print:text-slate-800">
            {data.overview}
          </p>
        </section>

        {data.key_insights && data.key_insights.length > 0 && (
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400 print:text-slate-800 print:text-xs">
              <Lightbulb className="w-4 h-4 text-indigo-400 print:hidden" />
              Key Insights
            </h3>
            <ul className="grid grid-cols-1 gap-3 md:gap-4">
              {data.key_insights.map((insight, idx) => (
                <li 
                  key={idx} 
                  className="p-4 rounded-xl bg-slate-900/40 border border-border/40 text-slate-300 text-sm leading-relaxed flex gap-3 print:bg-slate-50 print:border-slate-200 print:text-slate-800"
                >
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold print:border print:border-slate-300">
                    {idx + 1}
                  </span>
                  <div>{insight}</div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {data.comparisons && data.comparisons.length > 0 && (
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400 print:text-slate-800 print:text-xs">
              <Layers className="w-4 h-4 text-indigo-400 print:hidden" />
              Comparisons & Analysis
            </h3>
            <ul className="space-y-2">
              {data.comparisons.map((comp, idx) => (
                <li 
                  key={idx}
                  className="list-disc list-inside text-slate-300 text-sm leading-relaxed pl-1 marker:text-indigo-400 print:text-slate-800"
                >
                  {comp}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400 print:text-slate-800 print:text-xs">
            <Compass className="w-4 h-4 text-indigo-400 print:hidden" />
            Conclusion & Outlook
          </h3>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed print:text-slate-800">
            {data.conclusion}
          </p>
        </section>

        {data.sources && data.sources.length > 0 && (
          <section className="border-t border-border/80 pt-6 space-y-3 print:border-slate-300">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 print:text-slate-800">
              Retrieved References
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:grid-cols-1">
              {data.sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-border/80 text-xs text-slate-400 hover:text-white hover:border-indigo-500/30 transition-all print:bg-white print:border-none print:p-0 print:text-indigo-600 print:underline"
                >
                  <span className="truncate pr-3 font-medium max-w-[200px] sm:max-w-none">
                    {source.title}
                  </span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0 text-slate-600 group-hover:text-indigo-400 transition-colors print:hidden" />
                </a>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}