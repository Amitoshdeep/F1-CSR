import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const getExplanation = async (setup) => {
  const prompt = `Explain why this F1 car setup is optimal for ${setup.track} in ${setup.weather} weather:
${JSON.stringify(setup, null, 2)}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content;
};
