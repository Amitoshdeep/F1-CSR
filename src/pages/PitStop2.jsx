import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const STEPS = ["Jack", "Front Left", "Front Right", "Rear Left", "Rear Right", "Release"];

function getMedal(pct) {
  if (pct >= 90) return "🏆 Pit Master";
  if (pct >= 70) return "🥇 Pro";
  if (pct >= 50) return "🥈 Skilled";
  return "🥉 Rookie";
}

export default function PitStop() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hits, setHits] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [target, setTarget] = useState({ center: 0.5, width: 0.25 });

  const rafRef = useRef(null);
  const startTime = useRef(0);

  // Easier tuning for kids
  const stepDuration = 1400; // slower movement
  const movementSpeed = 0.25;
  const shrinkRate = 0.015;
  const minWidth = 0.08;

  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    startTime.current = performance.now();

    const animate = (ts) => {
      const elapsed = ts - startTime.current;
      let p = (elapsed % stepDuration) / stepDuration; // loops between 0 → 1
      setProgress(p);

      // smooth left-right oscillation for target
      const newCenter = 0.5 + Math.sin(ts / 1000 + stepIndex) * movementSpeed;
      setTarget((prev) => ({ ...prev, center: Math.max(0.15, Math.min(0.85, newCenter)) }));

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [running, stepIndex]);

  const handleAction = () => {
    if (!running) return;

    const dist = Math.abs(progress - target.center);
    const half = target.width / 2;

    // ✅ make the detection more forgiving (kids friendly)
    const tolerance = 0.04;
    if (dist <= half + tolerance) {
      const accuracy = 1 - dist / (half + tolerance);
      const points = Math.round(accuracy * 100);
      setScore((s) => s + points);
      setHits((h) => h + 1);
      setFeedback(`🎯 Nice Hit! +${points}`);
    } else {
      setScore((s) => Math.max(0, s - 10));
      setFeedback("❌ Miss -10");
    }

    setAttempts((a) => a + 1);
    setTarget((t) => ({
      ...t,
      width: Math.max(minWidth, t.width - shrinkRate),
    }));
    setStepIndex((i) => (i + 1) % STEPS.length);
    startTime.current = performance.now();
    setProgress(0);

    setTimeout(() => setFeedback(""), 800);
  };

  const startRun = () => {
    setScore(0);
    setHits(0);
    setAttempts(0);
    setTarget({ center: 0.5, width: 0.25 });
    setStepIndex(0);
    setRunning(true);
  };

  const stopRun = () => {
    setRunning(false);
    setProgress(0);
  };

  const accuracy = attempts ? Math.round((hits / attempts) * 100) : 0;

  return (
    <div className="flex flex-col items-center p-6 w-full min-h-screen text-white">
      <div className="max-w-3xl w-full bg-white/5 p-6 rounded-2xl">
        <h1 className="text-3xl font-bold mb-2">🏎️ Pit Stop Challenge</h1>
        <p className="text-white/60 mb-5">
          Press <strong>ACTION</strong> when the red bar is inside the green zone!
        </p>

        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <div className="flex justify-between mb-2">
            <p className="text-sm text-white/60">
              Step: <strong>{STEPS[stepIndex]}</strong>
            </p>
            <p className="text-sm text-white/60">
              Score: <strong>{score}</strong>
            </p>
          </div>

          <div className="relative h-8 bg-white/10 rounded-full overflow-hidden">
            {/* Target zone */}
            <div
              className="absolute top-0 bottom-0 bg-green-400/30 rounded"
              style={{
                left: `${target.center * 100}%`,
                width: `${target.width * 100}%`,
                transform: "translateX(-50%)",
              }}
            ></div>

            {/* Moving red indicator */}
            <motion.div
              className="absolute top-0 w-4 h-8 bg-red-500 rounded"
              style={{ left: `${progress * 100}%`, transform: "translateX(-50%)" }}
            />
          </div>

          <p className="text-center mt-2 text-lg font-semibold">
            {feedback || "Tap ACTION at the right time!"}
          </p>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAction}
            disabled={!running}
            className={`px-6 py-3 rounded-xl font-bold text-white ${
              running ? "bg-green-600 hover:bg-green-700" : "bg-green-600/40 cursor-not-allowed"
            }`}
          >
            ACTION
          </motion.button>

          {!running ? (
            <motion.button whileTap={{ scale: 0.95 }} onClick={startRun} className="px-4 py-3 bg-white/10 rounded-lg">
              ▶️ Start
            </motion.button>
          ) : (
            <motion.button whileTap={{ scale: 0.95 }} onClick={stopRun} className="px-4 py-3 bg-white/10 rounded-lg">
              ⏹ Stop
            </motion.button>
          )}
        </div>

        <div className="mt-6 bg-white/5 p-3 rounded-lg text-sm">
          <p>Attempts: {attempts}</p>
          <p>Hits: {hits}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Medal: {getMedal(accuracy)}</p>
        </div>

        <div className="mt-5 text-sm text-white/70">
          <h3 className="font-semibold mb-1">How to Play</h3>
          <ul className="list-disc ml-5 space-y-1">
            <li>Click “Start” to begin your pit stop.</li>
            <li>Press “ACTION” when the red bar is inside the green zone.</li>
            <li>Be quick and accurate to score more points!</li>
          </ul>
        </div>

        <div className="mt-6 flex gap-2">
          <NavLink to="/" className="px-3 py-2 bg-white/10 rounded">
            Back
          </NavLink>
          <NavLink to="/setup" className="px-3 py-2 bg-white/10 rounded">
            Car Setup
          </NavLink>
        </div>
      </div>
    </div>
  );
}
