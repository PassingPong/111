
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, FullPrediction, FutureForecast, ChartResponse, PastEvent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Schemas ---

const palaceSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    earthBranch: { type: Type.STRING },
    heavenStem: { type: Type.STRING },
    ageRange: { type: Type.STRING },
    majorStars: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          brightness: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["major"] }
        }
      }
    },
    minorStars: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["minor", "bad"] }
        }
      }
    }
  }
};

const chartSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    palaces: { type: Type.ARRAY, items: palaceSchema },
    fiveElement: { type: Type.STRING },
    lifeMaster: { type: Type.STRING },
    bodyMaster: { type: Type.STRING }
  }
};

const pastEventSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    year: { type: Type.STRING },
    description: { type: Type.STRING, description: "Specific event description." },
    type: { type: Type.STRING, enum: ['career', 'love', 'health', 'wealth', 'family'] },
    impact: { type: Type.STRING, enum: ['good', 'bad', 'neutral'], description: "Was this event positive or negative?" }
  }
};

const analysisSectionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 short, evocative keywords (2-4 chars each)" },
    content: { type: Type.STRING, description: "Warm, human-like detailed explanation without jargon." },
    score: { type: Type.INTEGER }
  }
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    personality: analysisSectionSchema,
    family: analysisSectionSchema,
    academics: analysisSectionSchema,
    career: analysisSectionSchema,
    wealth: analysisSectionSchema,
    love: analysisSectionSchema,
    health: analysisSectionSchema,
    pastEvents: {
      type: Type.ARRAY,
      items: pastEventSchema,
      description: "List 4-5 specific years with likely significant events for verification."
    }
  },
  required: ["personality", "family", "academics", "career", "wealth", "love", "health", "pastEvents"]
};

const fullResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    chart: chartSchema,
    analysis: analysisSchema
  },
  required: ["chart", "analysis"]
};

const monthlyFortuneSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    year: { type: Type.INTEGER },
    solarMonth: { type: Type.INTEGER },
    lunarMonth: { type: Type.STRING, description: "e.g. 农历正月" },
    rating: { type: Type.STRING, enum: ['极佳', '好', '平', '差', '极差'] },
    tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 key themes for the month" },
    content: { type: Type.STRING, description: "Detailed prediction specific to current situation." },
    luckyGuides: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 2-3 things suitable to do (宜)" },
    unluckyGuides: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 2-3 things to avoid (忌)" }
  }
};

const futureForecastSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    yearSummary: { type: Type.STRING, description: "Overall summary for the coming year" },
    months: { type: Type.ARRAY, items: monthlyFortuneSchema }
  }
};

// --- API Calls ---

export const generatePrediction = async (input: UserInput): Promise<FullPrediction> => {
  const prompt = `
    Role: Experienced Ziwei Doushu Consultant & Psychologist.
    Task: Analyze the chart for a modern user.
    
    User: ${input.name}, ${input.gender}, Born: ${input.birthDate} at ${input.birthTime}, Place: ${input.birthPlace}.

    Requirements:
    1. **Analysis**: Provide a breakdown for Personality, Career, Wealth, Love, Family, Academics, and HEALTH.
       - **Tags**: Give 3-4 short, punchy keywords for each section (e.g., "天生领袖", "晚婚大吉").
       - **Content**: Write in a warm, empathetic, and modern tone. Avoid overly obscure ancient terms. Explain *what it means* for their life.
    2. **Verification**: Identify 4-5 specific years in the past where major events happened (Career change, Breakup, Marriage, Surgery, Windfall). 
       - State clearly if the event was Good or Bad (impact).
       - These must be distinct events for the user to verify.

    Output JSON matching the schema. Use Simplified Chinese.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: fullResponseSchema,
        temperature: 0.7,
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("Empty response");
    return JSON.parse(text) as FullPrediction;
  } catch (error) {
    console.error("Analysis Error", error);
    throw error;
  }
};

export const generateFutureForecast = async (
  chart: ChartResponse, 
  input: UserInput, 
  verifiedEvents: PastEvent[]
): Promise<FutureForecast> => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const dateString = `${currentYear}年${currentMonth}月${currentDate.getDate()}日`;

  const prompt = `
    Role: Expert Fortune Teller.
    Current Date: ${dateString}.
    
    Task: Predict the fortune for the NEXT 12 MONTHS (Starting from the current month or next month).

    Context:
    - User: ${input.name}, ${input.gender}, Born ${input.birthDate}.
    - Confirmed Past: The user has CONFIRMED the following events occurred, making the chart accurate:
      ${JSON.stringify(verifiedEvents.map(e => `${e.year}: ${e.description} (${e.impact})`))}

    Output Requirements:
    1. **Timeline**: Generate exactly 12 items, one for each month starting now.
    2. **Detail**: For each month, provide:
       - Solar Year & Month.
       - Lunar Month (e.g., 农历冬月).
       - Rating (极佳, 好, 平, 差, 极差).
       - Tags (Keywords).
       - Content (Specific prediction, avoid generic advice).
       - Lucky Guides (Yi - What to do).
       - Unlucky Guides (Ji - What to avoid).
    
    Tone: Practical, actionable, and specific.
    Output JSON. Simplified Chinese.
  `;

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: futureForecastSchema,
        temperature: 0.7,
      }
    });
    const text = response.text;
    if (!text) throw new Error("Empty response");
    return JSON.parse(text) as FutureForecast;
  } catch (error) {
    console.error("Forecast Error", error);
    throw error;
  }
};
