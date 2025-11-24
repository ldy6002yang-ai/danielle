import { GoogleGenAI, Type } from "@google/genai";

// Initialize the client. API_KEY must be in process.env
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeTextSelection = async (text: string): Promise<{ pinyin: string; translation: string; culturalContext: string }> => {
  if (!process.env.API_KEY) {
    return {
      pinyin: "Error",
      translation: "API Key missing",
      culturalContext: "Please configure your environment variable."
    };
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Analyze the following Chinese text fragment within the context of an article about Chinese Character Simplification.
    Text: "${text}"
    
    Provide:
    1. Pinyin with tone marks.
    2. English translation.
    3. A brief cultural or etymological note explaining why this word/phrase is significant in the context of language evolution or the specific argument being made.
    
    Return JSON.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pinyin: { type: Type.STRING },
            translation: { type: Type.STRING },
            culturalContext: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      pinyin: result.pinyin || '',
      translation: result.translation || '',
      culturalContext: result.culturalContext || ''
    };

  } catch (error) {
    console.error("Gemini analysis error:", error);
    return {
      pinyin: "Error",
      translation: "Could not analyze",
      culturalContext: "Please try again."
    };
  }
};

export const checkQuizAnswer = async (question: string, userAnswer: string, contextText: string): Promise<{ isCorrect: boolean; feedback: string }> => {
  if (!process.env.API_KEY) return { isCorrect: false, feedback: "API Key missing" };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context Article: ${contextText}
      
      Question: ${question}
      User Answer: ${userAnswer}
      
      Evaluate the user's answer based STRICTLY on the text provided. 
      Is it correct? Provide specific feedback citing the text.
      
      Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING }
          }
        }
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { isCorrect: false, feedback: "Error checking answer." };
  }
};

export const chatWithTutor = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history,
    config: {
      systemInstruction: "You are a helpful and knowledgeable Chinese language tutor. The user is reading an article about the history and necessity of simplifying Chinese characters (Traditional vs Simplified). Help them understand vocabulary, grammar structures, and the historical arguments presented in the text. Be encouraging and concise."
    }
  });

  const result = await chat.sendMessage({ message: newMessage });
  return result.text;
};

export const generateCulturalComparison = async (character: string): Promise<{ traditional: string; simplified: string; explanation: string }> => {
   if (!process.env.API_KEY) return { traditional: "?", simplified: "?", explanation: "API Key missing" };

   const response = await ai.models.generateContent({
     model: 'gemini-2.5-flash',
     contents: `Compare the Traditional and Simplified forms of the concept/character related to: "${character}". 
     If the input is a concept (like "Love"), pick a representative character (like 愛 vs 爱).
     Explain the visual difference and the logic behind the simplification (e.g., phonetic substitution, removal of components).
     
     Return JSON.`,
     config: {
       responseMimeType: "application/json",
       responseSchema: {
          type: Type.OBJECT,
          properties: {
            traditional: { type: Type.STRING, description: "The Traditional character" },
            simplified: { type: Type.STRING, description: "The Simplified character" },
            explanation: { type: Type.STRING, description: "Brief explanation of change" }
          }
       }
     }
   });
   
   return JSON.parse(response.text || '{}');
}