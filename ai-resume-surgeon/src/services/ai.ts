import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult, ChatMessage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeResume(fileBase64: string, mimeType: string, jobDescription?: string): Promise<AnalysisResult> {
  const prompt = `You are an expert technical recruiter and ATS (Applicant Tracking System) analyzer.
Analyze the provided resume${jobDescription ? ` against the following job description:\n\n${jobDescription}\n\n` : '.'}

Provide a comprehensive analysis in JSON format matching the schema.
Be critical, professional, and highly specific. Do not give generic advice.
For rewrites, ensure the new bullet point uses strong action verbs, quantifies impact where possible, and sounds highly professional.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              data: fileBase64,
              mimeType: mimeType,
            }
          },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          atsScore: { type: Type.INTEGER, description: "Score from 0 to 100" },
          recruiterScore: { type: Type.INTEGER, description: "Score from 0 to 100" },
          scoreExplanation: { type: Type.STRING },
          strengths: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                point: { type: Type.STRING },
                reasoning: { type: Type.STRING }
              },
              required: ["point", "reasoning"]
            }
          },
          weaknesses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                point: { type: Type.STRING },
                reasoning: { type: Type.STRING }
              },
              required: ["point", "reasoning"]
            }
          },
          keywords: {
            type: Type.OBJECT,
            properties: {
              matched: { type: Type.ARRAY, items: { type: Type.STRING } },
              missing: { type: Type.ARRAY, items: { type: Type.STRING } },
              matchPercentage: { type: Type.INTEGER }
            },
            required: ["matched", "missing", "matchPercentage"]
          },
          rewrites: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                rewritten: { type: Type.STRING },
                reasoning: { type: Type.STRING }
              },
              required: ["original", "rewritten", "reasoning"]
            }
          },
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING },
                whyItMatters: { type: Type.STRING }
              },
              required: ["step", "whyItMatters"]
            }
          }
        },
        required: ["atsScore", "recruiterScore", "scoreExplanation", "strengths", "weaknesses", "keywords", "rewrites", "suggestions"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as AnalysisResult;
}

export async function chatWithMentor(history: ChatMessage[], message: string, resumeContext: string): Promise<string> {
  const contents = history.map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));
  contents.push({ role: 'user', parts: [{ text: message }] });

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: contents,
    config: {
      systemInstruction: `You are an expert Career Mentor and Resume Consultant. 
You have just analyzed the user's resume. 
Resume Context: ${resumeContext}
Answer the user's questions professionally, providing actionable, specific advice. Keep responses concise but highly valuable. Format your response in Markdown.`,
    }
  });

  return response.text || "I'm sorry, I couldn't generate a response.";
}
