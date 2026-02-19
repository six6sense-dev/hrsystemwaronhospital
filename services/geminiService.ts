import { GoogleGenAI } from "@google/genai";
import { Employee } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateEmployeeBio = async (employee: Employee): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    Create a professional, concise, and inspiring biography (max 120 words) for a hospital employee profile.
    
    Employee Details:
    Name: ${employee.firstName} ${employee.lastName}
    Role: ${employee.role}
    Department: ${employee.department}
    Skills: ${employee.skills.join(', ')}
    Recent Achievements: ${employee.recentAchievements?.join(', ') || 'Consistent performance excellence'}
    
    Tone: Professional, compassionate, and competent.
    Format: Plain text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Bio generation failed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generatePerformanceInsight = async (employee: Employee): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    Analyze the following employee profile and provide a brief performance insight and 2 suggestions for professional growth.
    
    Employee: ${employee.firstName} ${employee.lastName} (${employee.role})
    Department: ${employee.department}
    Rating: ${employee.performanceRating}/5
    Skills: ${employee.skills.join(', ')}
    
    Output Format: HTML (use <ul>, <li>, <strong> tags only for formatting). Keep it brief.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Insight generation failed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};