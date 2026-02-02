
import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly when initializing the GoogleGenAI client
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateCaption = async (topic: string): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a viral social media caption for a post about: ${topic}. Use emojis and hashtags. Keep it under 30 words.`,
    });
    return response.text?.trim() || "Exploring new horizons! #vibes";
  } catch (error) {
    console.error("AI Caption Error:", error);
    return "Exploring new horizons! #vibes";
  }
};

export const simulateAIResponse = async (userMessage: string, chatContext: string): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a friendly social media user. Respond naturally to this message: "${userMessage}". Context: ${chatContext}`,
      config: {
        systemInstruction: "Keep responses short, engaging, and casual. Use 1-2 emojis.",
      }
    });
    return response.text?.trim() || "That's awesome! 😊";
  } catch (error) {
    console.error("AI Response Error:", error);
    return "Cool! Let's talk more soon.";
  }
};

export const moderateComment = async (comment: string): Promise<{ isSafe: boolean; reason?: string }> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze if this social media comment is offensive or violates safety guidelines: "${comment}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          },
          required: ["isSafe"]
        }
      }
    });
    const result = JSON.parse(response.text || '{"isSafe":true}');
    return result;
  } catch (error) {
    return { isSafe: true };
  }
};
