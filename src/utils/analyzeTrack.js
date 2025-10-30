export async function analyzeTrack(trackName) {
    const prompt = `
  You are an F1 race engineer. Analyze the track "${trackName}" 
  and describe its key attributes as JSON:
  {
    "trackType": "street | high-speed | technical | balanced",
    "avgSpeedKph": "numeric value in km/h",
    "cornerCount": "few | moderate | many",
    "recommendedSetup": {
      "downforce": 0-100,
      "suspension": 0-100,
      "tirePressure": 20-50,
      "brakeBias": 40-70
    }
  }
  Return ONLY valid JSON.
  `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
    });

    try {
        const text = response.choices[0].message.content.trim();
        return JSON.parse(text);
    } catch (err) {
        console.error("Failed to parse AI JSON:", err);
        return null;
    }
}
export const analyzeTrack = async (trackName) => {
  const prompt = `
  You are an F1 race engineer. Analyze the track "${trackName}" 
  and describe its key attributes as JSON:
  {
    "trackType": "street | high-speed | technical | balanced",
    "avgSpeedKph": "numeric value in km/h",
    "cornerCount": "few | moderate | many",
    "recommendedSetup": {
      "downforce": 0-100,
      "suspension": 0-100,
      "tirePressure": 20-50,
      "brakeBias": 40-70
    }
  }
  Return ONLY valid JSON.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  try {
    const text = response.choices[0].message.content.trim();
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse AI JSON:", err);
    return null;
  }
};
