import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyA1uYtTQwYpwmSONQbbMqJLBncGfVElLE0";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export class GeminiService {
  static async generateTripPlan(
    prompt: string,
    location: { lat: number; lng: number; name: string }
  ) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const context = `Location: ${location.name} (${location.lat}, ${location.lng})`;
      const fullPrompt = `Given this location: ${context}

${prompt}

Please provide a brief itinerary with estimated timings and activities. Format the response as a timeline with emojis. Output in plain text format as i cant render markdown.`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating trip plan:", error);
      throw error;
    }
  }
}
