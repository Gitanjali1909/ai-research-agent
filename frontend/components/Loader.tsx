import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Loader() {
  const steps = [
    "Planning targeted search queries...",
    "Executing Tavily web searches in parallel...",
    "Deduplicating and cleaning retrieved web pages...",
    "Splitting content and generating OpenAI embeddings...",
    "Indexing content chunks in ChromaDB vector store...",
    "Performing semantic retrieval against query topic...",
    "Synthesizing insights and generating structured JSON report..."
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 border border-border/80 rounded-2xl bg-card shadow-lg transition-all duration-500 max-w-2xl mx-auto my-8">
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute w-16 h-16 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500 relative z-10" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-100 mb-2 tracking-tight">
        Agent Executing Research
      </h3>
      
      <div className="w-full max-w-xs bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
        <div 
          className="bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      <p className="text-indigo-400 font-medium text-sm text-center animate-pulse min-h-[20px]">
        {steps[currentStep]}
      </p>
      
      <p className="text-xs text-slate-500 mt-4 max-w-md text-center leading-relaxed">
        Please wait. The multi-step agent is querying external databases, vectorizing findings, and generating a structured report.
      </p>
    </div>
  );
}