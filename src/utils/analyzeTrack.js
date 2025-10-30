import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const analyzeTrack = async (trackName) => {
  const prompt = `
You are a senior Formula 1 race engineer with deep experience in telemetry, setup optimization, and aerodynamics.

Analyze the racing circuit called "${trackName}" and output a comprehensive technical breakdown in **strict, valid JSON** only.
No markdown, no comments, no explanations — just valid JSON.

Schema:
{
  "trackType": "street" | "high-speed" | "technical" | "balanced",
  "trackLengthKm": number,          // realistic length in km
  "lapCount": number,               // typical F1 race lap count
  "avgSpeedKph": number,            // realistic average lap speed
  "cornerCount": number,            // exact or approximate number
  "cornerComplexity": "low" | "medium" | "high", // how technical corners are
  "straightLengthM": number,        // length of main straight
  "elevationChangeM": number,       // total elevation change in meters
  "tireWearLevel": "low" | "medium" | "high",
  "fuelConsumptionLevel": "low" | "medium" | "high",
  "recommendedSetup": {
    "aeroBalance": number,          // percentage front vs rear, e.g., 55 means more front bias
    "downforce": number,            // 0–100
    "drag": number,                 // 0–100
    "suspension": number,           // 0–100 (stiffness)
    "antiRollBar": number,          // 0–100
    "rideHeightFront": number,      // mm
    "rideHeightRear": number,       // mm
    "tirePressureFront": number,    // 20–50 psi
    "tirePressureRear": number,     // 20–50 psi
    "brakeBias": number,            // 40–70
    "differential": {
      "onThrottle": number,         // 0–100
      "offThrottle": number         // 0–100
    },
    "gearRatios": "short" | "medium" | "long"
  },
  "idealWeatherSetup": {
    "dry": { "downforce": number, "tirePressure": number },
    "wet": { "downforce": number, "tirePressure": number }
  },
  "recommendedTireCompound": "soft" | "medium" | "hard",
  "drsZones": number,
  "ersUsageStrategy": "balanced" | "aggressive" | "conservative",
  "overtakeDifficulty": "easy" | "medium" | "hard",
  "notes": "string with short tactical advice for setup or driving style"
}

Guidelines:
- Base your values on realistic F1 knowledge of that circuit type.
- Maintain internal consistency between all parameters.
- Provide believable engineering-grade precision.
- Return ONLY valid JSON (no markdown or prose).
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.35, // lower temp for more accuracy and realism
    });

    const raw = response.choices?.[0]?.message?.content?.trim();
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error("❌ Failed to analyze track:", err);
    return null;
  }
};
