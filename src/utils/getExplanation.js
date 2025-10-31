import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_KEY,
  dangerouslyAllowBrowser: true,
});

export const getExplanation = async (setup) => {
  const prompt = `
  You're an expert F1 race engineer and analyst.
  Explain why this F1 car setup is optimal for ${setup.track} in ${setup.weather} conditions.
  Your response should sound confident, technical, and slightly cinematic — like commentary from a high-end F1 documentary or telemetry debrief.

  Guidelines:
  - Write in **short, impactful bullet points** only (no numbering, no markdown).
  - Each line should feel sharp, professional, and insightful — avoid filler words.
  - Mention aspects like:
    - Aerodynamic balance & downforce distribution
    - Tire wear, grip window, and temperature control
    - Handling behavior (understeer, oversteer, responsiveness)
    - Braking efficiency & traction on corner exits
    - Overall performance trade-offs for the given track and weather
  - Keep it concise but vivid — under 250 words.
  - Avoid generic lines like “this setup is great”; every bullet should reveal something meaningful about the car's behavior.

  Here’s the setup data for analysis:
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
    //text = text.replace(/\*\*/g, ""); // remove markdown bold
    //text = text.replace(/\*/g, "•");  // turn * bullets into proper bullet symbols

    return text;
  } catch (err) {
    console.error("❌ Failed to fetch AI explanation:", err);
    throw err;
  }
};
