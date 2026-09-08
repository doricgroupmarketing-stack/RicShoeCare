import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Extend window type for AI Studio platform APIs
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const getAIClient = () => {
  let apiKey = '';
  if (typeof process !== 'undefined' && process.env) {
    // @ts-ignore
    apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  }
  if (!apiKey && typeof import.meta !== 'undefined' && import.meta.env) {
    apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }
  return new GoogleGenAI({ apiKey });
};

export const checkAIConfiguration = async (): Promise<boolean> => {
  const ai = getAIClient();
  // @ts-ignore
  if (ai.apiKey) {
    return true;
  }
  
  if (typeof window !== 'undefined' && window.aistudio) {
    return await window.aistudio.hasSelectedApiKey();
  }
  
  return false;
};

export const requestAIKey = async (): Promise<void> => {
  if (typeof window !== 'undefined' && window.aistudio) {
    await window.aistudio.openSelectKey();
  }
};

export const analyzeShoeImage = async (base64Image: string, mimeType: string = 'image/jpeg'): Promise<AnalysisResult> => {
  try {
    const ai = getAIClient();
    const prompt = `
      You are an expert professional shoe restorer at RIC Shoe Care. 
      Analyze the uploaded image of the shoe. 
      
      We sell the following RIC Shoe Care products:
      - Premium Leather Polish (for leather shine)
      - Luxury Shoe Cream (for conditioning leather)
      - Suede Renovator Spray (for suede and nubuck)
      - Professional Leather Dye (for restoring color)
      - Essential Cleaning Kit (general cleaning for all shoes)
      - Water & Stain Repellent (protection for all materials)
      - Sole Brightener (for yellowing rubber soles)
      - Premium Horsehair Brush (for buffing)

      Identify the following details:
      1. Shoe Type (e.g., Sneaker, Boot, Formal, Heels).
      2. Primary Material (e.g., Leather, Suede, Canvas, Mesh).
      3. Current Condition (e.g., Good, Needs Cleaning, Scuffed, Heavily Soiled, Yellowing Soles).
      4. Recommend a service package from these options: "Standard Clean" (Basic dirt), "Deep Clean" (Stains/Mud), "Suede Revival" (Delicate suede work), "Sole Restoration" (Yellowing/Damage).
      5. Estimate a price range in USD based on the condition (e.g., $30-$45).
      6. Provide a short reasoning for the recommendation (1 sentence).
      7. recommendedProducts: Select 2 or 3 specific product names from the list above that are best suited for this shoe's material and condition.

      Return the result in strictly valid JSON format matching this schema.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            shoeType: { type: Type.STRING },
            material: { type: Type.STRING },
            condition: { type: Type.STRING },
            recommendedService: { type: Type.STRING },
            estimatedCost: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            recommendedProducts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['shoeType', 'material', 'condition', 'recommendedService', 'estimatedCost', 'reasoning', 'recommendedProducts']
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing shoe:", error);
    throw error;
  }
};

export const createShoeCareChat = () => {
  const ai = getAIClient();
  
  const defaultInstructions = `You are a helpful customer support agent for RIC Shoe Care. You help people book services and answer questions about shoe maintenance. Keep answers short, friendly, and professional. 
      
      CRITICAL: You must ONLY recommend RIC Shoe Care products. Do NOT recommend any other brands, third-party products, or DIY alternatives. If asked for a product recommendation, only suggest products from the RIC Shoe Care line.
      
      We sell the following RIC Shoe Care products:
      - Premium Leather Polish (for leather shine)
      - Luxury Shoe Cream (for conditioning leather)
      - Suede Renovator Spray (for suede and nubuck)
      - Professional Leather Dye (for restoring color)
      - Essential Cleaning Kit (general cleaning for all shoes)
      - Water & Stain Repellent (protection for all materials)
      - Sole Brightener (for yellowing rubber soles)
      - Premium Horsehair Brush (for buffing)
      
      If a user asks about shipping or wholesale, let them know they can use our Smart Logistics Tool on the website to calculate container loading requirements.`;

  let systemInstruction = defaultInstructions;
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('chatbot_instructions');
    if (saved) {
      systemInstruction = saved + "\n\n" + defaultInstructions;
    }
  }

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction
    }
  });
};