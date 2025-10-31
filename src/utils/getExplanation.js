import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_KEY,
  dangerouslyAllowBrowser: true,
});

export const getExplanation = async (setup) => {
  const prompt = `
Explain why this F1 car setup is optimal for ${setup.track} in ${setup.weather} weather.
Respond in short bullet points only — no markdown, no bold formatting.
Focus on:
- Aerodynamic balance
- Tire wear and temperature
- Handling and stability
- Braking and traction
- Make Bullet Points

Keep it clear, technical, and under 400 words.
Here’s the setup data:
${JSON.stringify(setup, null, 2)}
`;

  try {
    const res = await openai.chat.completions.create({
      model: "nvidia/nemotron-nano-12b-v2-vl:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800, // ~400 words
    });

    let text = res.choices[0].message.content.trim();

    // Basic cleanup: remove asterisks or unwanted markdown
    text = text.replace(/\*\*/g, ""); // remove markdown bold
    text = text.replace(/\*/g, "•");  // turn * bullets into proper bullet symbols

    return text;
  } catch (err) {
    console.error("❌ Failed to fetch AI explanation:", err);
    throw err;
  }
};
