// utils/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest", // Updated model
});

const generationConfig = {
  temperature: 0.7, // Adjusted for more focused responses
  topP: 0.9,
  topK: 32,
  maxOutputTokens: 4096,
};

export async function generateInterviewQuestions(params) {
  const { role, experience, count = 10, type = "standard" } = params;
  
  const prompt = `
    Generate ${count} ${type === "advanced" ? "complex scenario-based" : ""} 
    interview questions for a ${experience}-level ${role} position.
    
    For each question, provide:
    1. The question text
    2. Category (technical/behavioral/general)
    3. Difficulty (easy/medium/hard)
    4. A model answer (2-3 paragraphs)
    5. 3-5 evaluation criteria
    
    ${type === "advanced" ? "Include 2 potential follow-up questions for each main question." : ""}
    
    Format as JSON with this structure:
    {
      "questions": [
        {
          "text": "...",
          "category": "...",
          "difficulty": "...",
          "modelAnswer": "...",
          "evaluationCriteria": ["...", "..."],
          ${type === "advanced" ? `"followUps": ["...", "..."]` : ''}
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean and parse the response
    const jsonString = text.replace(/```json|```/g, '');
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate questions");
  }
}