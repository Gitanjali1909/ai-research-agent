import React, { useState } from "react";
import { ResearchReport } from "@/types";
import { Copy, Check } from "lucide-react";

interface ReportViewProps {
  data: ResearchReport;
}

export default function ReportView({ data }: ReportViewProps) {
  const [copied, setCopied] = useState(false);

  const getMarkdown = () => {
    return `# ${data.topic}\n\n` +
      `${data.overview}\n\n` +
      `## Key Insights\n${data.key_insights.map((k) => `- ${k}`).join("\n")}\n\n` +
      `## Analysis & Trade-offs\n${data.comparisons.map((c) => `- ${c}`).join("\n")}\n\n` +
      `## Conclusion\n${data.conclusion}\n\n` +
      `## References\n${data.sources.map((s, idx) => `[${idx + 1}] ${s.title}: ${s.url}`).join("\n")}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getDomain = (urlString: string) => {
    try {
      return new URL(urlString).hostname.replace("www.", "");
    } catch {
      return "link";
    }
  };

  return (
    <div className="w-full max-w-[680px] mx-auto space-y-10 py-4 animate-fadeIn print:space-y-6">
      <div className="flex items-center justify-between text-xs text-zinc-500 pb-2 print:hidden">
        <span className="font-mono">Document Synthesis</span>
        <div className="flex gap-4">
          <button
            onClick={handleCopy}
            className="hover:text-zinc-300 transition-colors flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-zinc-400" />
                <span>Copied</span>
              </>
            ) : (
              <span>Copy text</span>
            )}
          </button>
          <button
            onClick={() => window.print()}
            className="hover:text-zinc-300 transition-colors"
          >
            Print
          </button>
        </div>
      </div>

      <article className="space-y-8 text-zinc-300 leading-relaxed text-[15px] font-normal print:text-black">
        <header className="space-y-2 border-b border-zinc-900/60 pb-6 print:border-zinc-300">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-100 print:text-black">
            {data.topic}
          </h1>
        </header>

        <section className="space-y-3">
          <p className="text-zinc-300 leading-relaxed print:text-zinc-800">
            {data.overview}
          </p>
        </section>

        <hr className="border-zinc-900/40 print:border-zinc-200" />

        {data.key_insights && data.key_insights.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
              Key Findings
            </h2>
            <ul className="space-y-3.5">
              {data.key_insights.map((insight, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="text-zinc-600 font-mono text-[13px] select-none pt-0.5">
                    {idx + 1}.
                  </span>
                  <span className="text-zinc-300 print:text-zinc-800">{insight}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <hr className="border-zinc-900/40 print:border-zinc-200" />

        {data.comparisons && data.comparisons.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
              Analysis & Trade-offs
            </h2>
            <ul className="space-y-3 pl-5 list-disc marker:text-zinc-700">
              {data.comparisons.map((comp, idx) => (
                <li key={idx} className="text-zinc-300 print:text-zinc-800 pl-1">
                  {comp}
                </li>
              ))}
            </ul>
          </section>
        )}

        <hr className="border-zinc-900/40 print:border-zinc-200" />

        <section className="space-y-3">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
            Outlook
          </h2>
          <p className="text-zinc-300 leading-relaxed print:text-zinc-800">
            {data.conclusion}
          </p>
        </section>

        {data.sources && data.sources.length > 0 && (
          <section className="pt-8 border-t border-zinc-900/60 mt-12 print:border-zinc-300">
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-4">
              References
            </h2>
            <ol className="space-y-2">
              {data.sources.map((source, idx) => (
                <li key={idx} className="text-xs text-zinc-400">
                  <span className="font-mono text-zinc-600 mr-2">[{idx + 1}]</span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-zinc-200 underline underline-offset-4 decoration-zinc-800/80 hover:decoration-zinc-600 transition-colors"
                  >
                    {source.title}
                  </a>
                  <span className="text-zinc-600 ml-1 font-mono">({getDomain(source.url)})</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </article>
    </div>
  );
}