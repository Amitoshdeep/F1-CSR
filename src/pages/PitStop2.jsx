import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

const STEPS = ['Jack', 'Front Left', 'Front Right', 'Rear Left', 'Rear Right', 'Release']

function getMedal(pct) {
  if (pct >= 90) return '🏆 Pro Pit Crew'
  if (pct >= 75) return '🥇 Expert'
  if (pct >= 50) return '🥈 Competent'
  return '🥉 Rookie'
}

export default function PitStop() {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [hits, setHits] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [targetWidth, setTargetWidth] = useState(0.22)
  const [targetCenter, setTargetCenter] = useState(0.5)
  const [feedback, setFeedback] = useState('')

  const rafRef = useRef(null)
  const startTsRef = useRef(0)
  const progressRef = useRef(0)
  const targetCenterRef = useRef(0.5)
  const targetWidthRef = useRef(0.22)
  const lastProgressUpdateRef = useRef(0)
  const feedbackTimeoutRef = useRef(null)

  const indicatorRef = useRef(null)
  const targetRef = useRef(null)

  // tuning
  const stepDuration = 900 // ms per step
  const movementAmplitude = 0.32
  const shrinkPerStep = 0.03
  const targetMinWidth = 0.06

  useEffect(() => {
    // cleanup on unmount
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!running) {
      // stop loop
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      return
    }

    // initialize refs
    startTsRef.current = performance.now()
    progressRef.current = 0
    lastProgressUpdateRef.current = 0
    targetCenterRef.current = targetCenter
    targetWidthRef.current = targetWidth

    const tick = (ts) => {
      const elapsed = ts - startTsRef.current
      const p = Math.min(1, elapsed / stepDuration)
      progressRef.current = p

      // moving center: sine wave plus step offset (makes each step feel different)
      const t = ts / 700
      const center = 0.5 + Math.sin(t + stepIndex * 0.9) * movementAmplitude
      const boundedCenter = Math.max(0.1, Math.min(0.9, center))
      targetCenterRef.current = boundedCenter

      // update DOM for smooth visuals
      try {
        if (indicatorRef.current) indicatorRef.current.style.left = `${p * 100}%`
        if (targetRef.current) {
          targetRef.current.style.left = `${boundedCenter * 100}%`
          targetRef.current.style.width = `${targetWidthRef.current * 100}%`
          targetRef.current.style.transform = 'translateX(-50%)'
        }
      } catch (e) {
        // ignore missing nodes during initial render
      }

      // occasional React state updates for readable UI (throttle ~10fps)
      if (!lastProgressUpdateRef.current || ts - lastProgressUpdateRef.current > 100) {
        setProgress(p)
        setTargetCenter(targetCenterRef.current)
        lastProgressUpdateRef.current = ts
      }

      if (p >= 1) {
        // step timed out -> count as attempt, shrink target slightly
        setAttempts(a => a + 1)
        const nw = Math.max(targetMinWidth, targetWidthRef.current - shrinkPerStep)
        targetWidthRef.current = nw
        setTargetWidth(nw)
        setStepIndex(s => (s + 1) % STEPS.length)
        startTsRef.current = ts
        progressRef.current = 0
        setProgress(0)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [running, stepIndex, targetWidth])

  function handleAction() {
    if (!running) return

    const curProgress = progressRef.current
    const curCenter = targetCenterRef.current
    const curWidth = targetWidthRef.current
    const half = curWidth / 2
    const dist = Math.abs(curProgress - curCenter)

    if (dist <= half) {
      // near center -> score scaled 0..100
      const relative = 1 - dist / half
      const stepScore = Math.round(relative * 100)
      setScore(s => s + stepScore)
      setHits(h => h + 1)
      setFeedback('HIT +' + stepScore)
    } else {
      setScore(s => Math.max(0, s - 8))
      setFeedback('MISS -8')
    }

    setAttempts(a => a + 1)

    // shrink target after action
    setTargetWidth(w => {
      const nw = Math.max(targetMinWidth, w - shrinkPerStep)
      targetWidthRef.current = nw
      return nw
    })

    // clear feedback shortly
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current)
    feedbackTimeoutRef.current = window.setTimeout(() => setFeedback(''), 700)

    // advance to next step and restart timing
    setStepIndex(s => (s + 1) % STEPS.length)
    startTsRef.current = performance.now()
    progressRef.current = 0
    setProgress(0)
  }

  function startRun() {
    setScore(0)
    setAttempts(0)
    setHits(0)
    setStepIndex(0)
    setTargetWidth(0.22)
    targetWidthRef.current = 0.22
    setTargetCenter(0.5)
    targetCenterRef.current = 0.5
    startTsRef.current = performance.now()
    setRunning(true)
  }

  function stopRun() {
    setRunning(false)
    setProgress(0)
  }

  const percentProgress = Math.round(progress * 100)
  const average = attempts ? Math.round((score / (attempts || 1)) * 5) : 0
  const accuracyPct = attempts ? Math.round((hits / attempts) * 100) : 0

  return (
    <div className="flex flex-col gap-6 p-4 min-h-full w-full">
      <div className="commonBg max-w-4xl w-full p-6">
        <h2 className="font-azonix text-2xl mb-2">Pit Stop Challenge</h2>
        <p className="text-white/60 mb-4">Timing game — click ACTION when the moving indicator lines up with the shrinking target. Uses requestAnimationFrame + refs for frame-accurate hit detection.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-white/50">Current Step</p>
                  <h3 className="text-lg font-semibold">{STEPS[stepIndex]}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/50">Score</p>
                  <p className="text-xl font-bold">{score}</p>
                  {feedback && (
                    <p className={`mt-1 text-sm font-semibold ${feedback.startsWith('HIT') ? 'text-green-300' : 'text-red-300'}`}>{feedback}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-white/50 mb-1">Timing Window</p>
                <div className="relative h-6 bg-white/6 rounded-full overflow-hidden">
                  <div ref={targetRef} className="absolute top-0 bottom-0 bg-white/10 rounded" style={{ left: `${targetCenter * 100}%`, width: `${targetWidth * 100}%`, transform: 'translateX(-50%)' }} />
                  <div ref={indicatorRef} className="absolute top-0 left-0 w-3 h-6 bg-red-400 rounded" style={{ left: `${progress * 100}%`, transform: 'translateX(-50%)' }} />
                </div>
                <p className="text-xs text-white/50 mt-2">Progress: {percentProgress}%</p>
              </div>

              <div className="flex gap-3 items-center">
                <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }} onClick={handleAction} className={`px-6 py-3 rounded-xl bg-green-600/80 text-white font-semibold ${!running ? 'opacity-60 cursor-not-allowed' : ''}`}>ACTION</motion.button>

                {!running ? (
                  <motion.button whileTap={{ scale: 0.95 }} onClick={startRun} className="px-4 py-2 rounded-lg bg-white/10">Start Run</motion.button>
                ) : (
                  <motion.button whileTap={{ scale: 0.95 }} onClick={stopRun} className="px-4 py-2 rounded-lg bg-white/10">Stop</motion.button>
                )}

                <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setScore(0); setAttempts(0); setHits(0) }} className="px-3 py-2 rounded-lg bg-white/6">Reset Score</motion.button>
              </div>

            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {STEPS.map((s, i) => (
                <div key={s} className={`p-3 rounded-lg text-center ${i === stepIndex ? 'bg-white/6 border border-white/10' : 'bg-transparent'}`}>
                  <p className="text-sm text-white/50">{s}</p>
                  <p className="font-semibold mt-1">{i + 1}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="p-4 bg-white/5 rounded-lg">
            <h4 className="font-semibold">Run Summary</h4>
            <div className="mt-3 text-sm space-y-2 text-white/60">
              <p>Attempts: <strong className="text-white">{attempts}</strong></p>
              <p>Successful Hits: <strong className="text-white">{hits}</strong></p>
              <p>Hit %: <strong className="text-white">{accuracyPct}%</strong></p>
              <p>Average per attempt: <strong className="text-white">{average}</strong></p>
              <p className="mt-2">Medal: <strong className="text-white">{getMedal(accuracyPct)}</strong></p>
            </div>

            <div className="mt-5">
              <h5 className="font-semibold">How to Play</h5>
              <ol className="text-sm text-white/60 list-decimal ml-5 mt-2 space-y-1">
                <li>Press Start Run to begin the sequence.</li>
                <li>Click ACTION when the indicator overlaps the center target area.</li>
                <li>Targets shrink over time — stay accurate to keep score high.</li>
              </ol>
            </div>

            <div className="mt-6 flex gap-2">
              <NavLink to="/" className="px-3 py-2 bg-white/10 rounded">Back</NavLink>
              <NavLink to="/setup" className="px-3 py-2 bg-white/10 rounded">Car Setup</NavLink>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
