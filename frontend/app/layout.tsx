import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Research Agent",
  description: "An autonomous agent executing multi-step research pipeline with Tavily, ChromaDB and OpenAI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen text-slate-100 selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}