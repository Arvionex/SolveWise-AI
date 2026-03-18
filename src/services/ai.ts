import { GoogleGenAI, Type } from "@google/genai";
import { AISolution } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function solveProblem(problem: string, category: string): Promise<AISolution> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Problem: ${problem}\nCategory: ${category}`,
    config: {
      systemInstruction: `You are an expert AI Problem Solver. Analyze the user's problem and provide a structured solution.
      
      RULES:
      1. Detect the language of the user's input (Hindi or English).
      2. Respond in the SAME language as the input.
      3. Use simple, clear, and easy-to-understand language.
      
      Include:
      1. A brief summary of the problem.
      2. 3-4 possible causes.
      3. Step-by-step solution instructions.
      4. Estimated repair cost in Indian Rupees (INR) if applicable.
      5. The type of service worker needed (e.g., Electrician, Plumber, Technician) if professional help is required.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          causes: { type: Type.ARRAY, items: { type: Type.STRING } },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          cost: { type: Type.STRING },
          worker_type: { type: Type.STRING }
        },
        required: ["summary", "causes", "steps", "cost"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function detectProblemFromImage(base64Image: string, mimeType: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      { inlineData: { data: base64Image, mimeType } },
      { text: "Identify the problem in this image. Describe it briefly." }
    ]
  });
  return response.text;
}
