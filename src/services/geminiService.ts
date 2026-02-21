import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface SyllabusRequest {
  title: string;
  level: string;
  targetAudience: string;
  duration: string;
}

export async function generateSyllabus(req: SyllabusRequest) {
  const prompt = `Generate a comprehensive, industry-aligned syllabus for a course titled "${req.title}".
  Level: ${req.level}
  Target Audience: ${req.targetAudience}
  Duration: ${req.duration}

  The syllabus should include:
  1. Course Overview
  2. Learning Objectives (aligned with industry standards)
  3. Weekly Breakdown (Modules)
  4. Required Tools/Technologies
  5. Assessment Methods
  6. Industry Certifications it aligns with (if applicable)

  Format the output as a structured Markdown document.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // Using the latest flash model
    contents: prompt,
  });

  return response.text;
}
