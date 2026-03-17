export interface AnalysisResult {
  atsScore: number;
  recruiterScore: number;
  scoreExplanation: string;
  strengths: { point: string; reasoning: string }[];
  weaknesses: { point: string; reasoning: string }[];
  keywords: {
    matched: string[];
    missing: string[];
    matchPercentage: number;
  };
  rewrites: {
    original: string;
    rewritten: string;
    reasoning: string;
  }[];
  suggestions: {
    step: string;
    whyItMatters: string;
  }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
