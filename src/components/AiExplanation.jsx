import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_KEY,
  dangerouslyAllowBrowser: true,
});

const loadingPhrases = [
  "Balancing downforce coefficients...",
  "Simulating tire degradation patterns...",
  "Optimizing brake migration ratios...",
  "Analyzing suspension stiffness vs. traction...",
  "Calculating aerodynamic load through corners...",
  "Mapping traction curves and grip balance...",
  "Predicting thermal behavior under stress...",
];

export default function AiExplanation({ setup }) {
  const [loading, setLoading] = useState(true);
  const [aiText, setAiText] = useState("");
  const [status, setStatus] = useState(loadingPhrases[0]);

  // cycle through telemetry messages
  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % loadingPhrases.length;
      setStatus(loadingPhrases[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const fetchExplanation = async () => {
      const prompt = `
      You're an expert F1 race engineer and analyst.
      Explain why this F1 car setup is optimal for ${setup.track} in ${setup.weather} conditions.
      Your response should sound confident, technical, and slightly cinematic — like commentary from a high-end F1 documentary or telemetry debrief.

      Guidelines:
      - Short, impactful bullet points only (no markdown)
      - Focus on:
        - Aerodynamic balance & downforce
        - Tire wear & temperature control
        - Handling behavior (understeer, oversteer)
        - Braking efficiency & traction
      - Every line should sound like real telemetry insight.
      - Keep it concise but vivid — under 250 words.

      Here’s the setup data:
      ${JSON.stringify(setup, null, 2)}
      `;

      try {
        // --- stream real-time response if supported ---
        const res = await openai.chat.completions.create({
          model: "nvidia/nemotron-nano-12b-v2-vl:free",
          messages: [{ role: "user", content: prompt }],
          stream: true,
        });

        let text = "";
        for await (const chunk of res) {
          const token = chunk.choices?.[0]?.delta?.content || "";
          text += token;

          // 🧹 cleanup markdown as it streams
          let cleaned = text
            .replace(/\*\*/g, "") // remove markdown bold
            .replace(/\*/g, "•"); // turn * into bullets

          setAiText(cleaned);
        }

        setLoading(false);
      } catch (err) {
        console.error("❌ AI fetch failed, using fallback:", err);

        // fallback if stream fails — instant text fetch
        const res = await openai.chat.completions.create({
          model: "nvidia/nemotron-nano-12b-v2-vl:free",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 600,
        });

        let text = res.choices[0].message.content.trim();

        // 🧹 cleanup markdown for fallback too
        text = text.replace(/\*\*/g, "").replace(/\*/g, "•");

        setAiText(text);
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [setup]);

  return (
    <div className="flex flex-col gap-6 items-center text-gray-100 font-light">
      {loading ? (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-sm italic text-center"
        >
          {status}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="whitespace-pre-line text-base leading-relaxed text-gray-200 max-w-6xl"
        >
          {aiText}
        </motion.div>
      )}
    </div>
  );
}
