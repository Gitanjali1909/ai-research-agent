import React from "react";

export default function Loader() {
  return (
    <div className="w-full max-w-[680px] mx-auto py-20 flex flex-col items-center justify-center">
      <div className="flex items-center gap-3">
        <span className="w-1 h-1 rounded-full bg-zinc-500 animate-pulse-quiet" />
        <span className="text-xs text-zinc-500 font-medium tracking-wide animate-pulse-quiet">
          Searching and preparing research document...
        </span>
      </div>
    </div>
  );
}