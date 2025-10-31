import React, { useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)) }

function CarSetup() {
  // Simple interactive demo showing trade-off between downforce and top speed
  const [downforce, setDownforce] = useState(50) // percent
  const [dragCoeff, setDragCoeff] = useState(0.32) // coefficient
  const [weight, setWeight] = useState(752) // kg (typical F1 car)

  const results = useMemo(() => {
    // Very simplified physics-ish model for demonstration only
    // topSpeed ~ power / drag => we'll pretend power is constant and inversely affected by drag
    // downforce increases cornering grip but adds drag; we show lap compromise metrics

    const aeroDrag = dragCoeff + downforce * 0.0012 // arbitrary coupling
    const topSpeed = clamp(360 / aeroDrag, 200, 380) // km/h simulated

    // lateral grip proxy increases with downforce
    const lateralGrip = clamp(1 + downforce * 0.01, 1, 3)

    // cornering lap time factor (lower is better) — simple proxy
    const corneringFactor = (1 / lateralGrip) * (1 + (weight - 750) / 1500)

    // straights factor based on top speed
    const straightsFactor = (380 - topSpeed) / 180 // smaller is better

    // combined score: lower is better (simulated lap time)
    const lapScore = 60 * (1 + corneringFactor + straightsFactor) // arbitrary scale

    return { topSpeed: Math.round(topSpeed), lateralGrip: lateralGrip.toFixed(2), lapScore: lapScore.toFixed(2), aeroDrag: aeroDrag.toFixed(3) }
  }, [downforce, dragCoeff, weight])

  return (
    <div className="flex flex-col gap-6 p-10 min-h-full w-full">
      <div className="commonBg max-w-[1040px] w-full p-6 mt-10">
        <h2 className="font-azonix text-2xl mb-4">Car Setup — Aero Playground</h2>

        <p className="text-white/60 mb-4">
          Explore how downforce and drag influence top speed, grip and a simplified lap score.
          This interactive demo is educational — a playful approximation, not a racing simulator.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-white/50">Downforce: {downforce}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={downforce}
              onChange={(e) => setDownforce(Number(e.target.value))}
              className="w-full"
            />

            <label className="text-sm text-white/50 mt-4">Base Drag Coefficient: {dragCoeff}</label>
            <input
              type="range"
              min="0.25"
              max="0.45"
              step="0.005"
              value={dragCoeff}
              onChange={(e) => setDragCoeff(Number(e.target.value))}
              className="w-full"
            />

            <label className="text-sm text-white/50 mt-4">Car Weight: {weight} kg</label>
            <input
              type="range"
              min="700"
              max="800"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-semibold">Simulated Metrics</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>Top Speed (sim): <strong>{results.topSpeed} km/h</strong></li>
                <li>Lateral Grip (proxy): <strong>{results.lateralGrip}</strong></li>
                <li>Aero Drag (proxy): <strong>{results.aeroDrag}</strong></li>
                <li>Lap Score (lower better): <strong>{results.lapScore}</strong></li>
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold">Quick Tips</h4>
              <ol className="text-sm list-decimal ml-5 mt-2 text-white/60 space-y-2">
                <li>Higher downforce improves cornering but increases drag and reduces top speed.</li>
                <li>Lower drag helps on high-speed tracks (Monza, Baku). Add downforce for twisty tracks (Monaco, Hungary).</li>
                <li>Adjust weight distribution and ride height together with aero to tune balance.</li>
              </ol>
            </div>

            <div className="mt-6 flex gap-3">
              <NavLink to="/" className="px-4 py-2 bg-white/10 rounded-lg">Back</NavLink>
              <NavLink to="/results" className="px-4 py-2 bg-white/10 rounded-lg">Generate Setup</NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarSetup
