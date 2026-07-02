export interface Source {
  title: string;
  url: string;
}

export interface ResearchReport {
  topic: string;
  overview: string;
  key_insights: string[];
  comparisons: string[];
  conclusion: string;
  sources: Source[];
}