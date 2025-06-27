
import { GoogleGenAI } from "@google/genai";
import type { Example } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is not set. Please set the environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const buildPrompt = (examples: Example[], testInput: string): string => {
  let prompt = "Follow the examples below to generate an output for the final user input.\n\n";

  examples.forEach(ex => {
    prompt += `INPUT: ${ex.input}\nOUTPUT: ${ex.output}\n\n`;
  });

  prompt += `INPUT: ${testInput}\nOUTPUT:`;
  return prompt;
};

export const generateContentWithExamples = async (examples: Example[], testInput: string): Promise<string> => {
  if (!API_KEY) {
    return "Error: API_KEY is not configured. Please set it in your environment variables.";
  }
  
  const fullPrompt = buildPrompt(examples, testInput);

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: fullPrompt,
        config: {
            temperature: 0.2, // Lower temperature for more deterministic, example-following behavior
            topP: 0.9,
            topK: 40,
        }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating content:", error);
    if (error instanceof Error) {
        return `Error: ${error.message}`;
    }
    return "An unknown error occurred while generating content.";
  }
};
