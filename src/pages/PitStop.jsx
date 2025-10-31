export { default } from './PitStop2'

// This file now re-exports the working PitStop2 component
// (old implementation removed to avoid parse errors)
/* removed */
// Removed getMedal function and related logic
// export kept above: `export { default } from './PitStop2'`
// (old implementation removed to avoid parse errors)
/* removed */
    // use authoritative refs updated by RAF for exact values
    const curProgress = progressRef.current
    const distance = Math.abs(curProgress - targetCenterRef.current)
    const halfWidth = targetWidthRef.current / 2

    if (distance <= halfWidth) {
      const relative = 1 - distance / halfWidth // 1..0
      const stepScore = Math.round(relative * 100)
      setScore(prev => prev + stepScore)
      setHits(h => h + 1)
      setFeedback('HIT +' + stepScore)
    } else {
      setScore(prev => Math.max(0, prev - 8))
      setFeedback('MISS -8')
    }

    setAttempts(a => a + 1)

    // shrink target a bit after each action to increase difficulty
    const nw = Math.max(targetMinWidth, targetWidthRef.current - shrinkPerStep)
    targetWidthRef.current = nw
    setTargetWidth(nw)

    // clear feedback after a short delay (use ref for cleanup)
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current)
    feedbackTimeoutRef.current = window.setTimeout(() => setFeedback(''), 700)

    // move to next step and reset progress; advance RAF timing
    setStepIndex(s => (s + 1) % STEPS.length)
    startTsRef.current = performance.now()
    progressRef.current = 0
    setProgress(0)
    if (!running) {
      // ensure any scheduled frame is cancelled
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      return
    }

    // initialize timing
    startTsRef.current = performance.now()
    setProgress(0)
    progressRef.current = 0
    lastProgressUpdateRef.current = 0


    const tick = (ts) => {
      const elapsed = ts - startTsRef.current
      const p = Math.min(1, elapsed / stepDuration)
      // update refs used for hit detection immediately
      progressRef.current = p

      // move the target smoothly using a sine wave based on time and current step
      const t = ts / 600 // speed factor
      const center = 0.5 + Math.sin(t + stepIndex) * movementAmplitude
      const boundedCenter = Math.max(0.1, Math.min(0.9, center))
      targetCenterRef.current = boundedCenter

      // update DOM directly for smooth visuals (avoid React re-render each frame)
      try {
        if (indicatorRef.current) indicatorRef.current.style.left = `${p * 100}%`
        if (targetRef.current) {
          targetRef.current.style.left = `${boundedCenter * 100}%`
          targetRef.current.style.width = `${targetWidthRef.current * 100}%`
          targetRef.current.style.transform = 'translateX(-50%)'
        }
      } catch (e) {
        // ignore if DOM nodes not present yet
      }

      // throttle React state progress updates to ~10fps so UI shows progress number without heavy rerenders
      if (!lastProgressUpdateRef.current || ts - lastProgressUpdateRef.current > 100) {
        setProgress(p)
        lastProgressUpdateRef.current = ts
      }

      if (p >= 1) {
        // missed: increment attempts and shrink target slightly to increase difficulty
        setAttempts(a => a + 1)
        const nw = Math.max(targetMinWidth, targetWidthRef.current - shrinkPerStep)
        targetWidthRef.current = nw
        setTargetWidth(nw)
        // advance and restart timing
        setStepIndex(s => (s + 1) % STEPS.length)
        startTsRef.current = ts
        // reset progress state quickly
        setProgress(0)
        progressRef.current = 0
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [running])

  function advanceStep() {
    setProgress(0)
    setStepIndex(s => (s + 1) % STEPS.length)
  }

  function handleAction() {
    if (!running) return

    // compute precise current progress from timing reference to avoid stale state
  // use the authoritative progressRef (kept in RAF loop) to avoid timing mismatch
  const curProgress = progressRef.current
  const distance = Math.abs(curProgress - targetCenterRef.current)
    const halfWidth = targetWidthRef.current / 2

    if (distance <= halfWidth) {
      const relative = 1 - distance / halfWidth // 1..0
      const stepScore = Math.round(relative * 100)
      setScore(prev => prev + stepScore)
      setHits(h => h + 1)
      setFeedback('HIT +'+stepScore)
    } else {
      setScore(prev => Math.max(0, prev - 8))
      setFeedback('MISS -8')
    }

    setAttempts(a => a + 1)
    // shrink target a bit after each action to increase difficulty
    setTargetWidth(w => {
      const nw = Math.max(targetMinWidth, w - shrinkPerStep)
      targetWidthRef.current = nw
      return nw
    })

    // clear feedback after a short delay
    window.setTimeout(() => setFeedback(''), 700)

    // move to next step and reset progress
    // set startTsRef so RAF progress continues from new start
    setStepIndex(s => (s + 1) % STEPS.length)
    startTsRef.current = now
    setProgress(0)
  }

  function startRun() {
    setScore(0)
    setAttempts(0)
    setHits(0)
    setStepIndex(0)
    // reset dynamic target and refs
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
        <p className="text-white/60 mb-4">Timing game — click the action when the moving bar is centered. Complete the sequence fast for a top score. Built with Framer Motion for smooth animations.</p>

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
                <div className="relative h-5 bg-white/6 rounded-full overflow-hidden">
                  {/* dynamic target area */}
                  <div
                    className="absolute top-0 bottom-0 bg-white/10 rounded"
                    style={{
                      left: `${targetCenter * 100}%`,
                      width: `${targetWidth * 100}%`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                  {/* moving indicator */}
                  <motion.div
                    className="absolute top-0 left-0 w-3 h-5 bg-red-400 rounded"
                    // place indicator using left + translateX(-50%) so it's centered on the position
                    style={{ left: `${progress * 100}%`, transform: 'translateX(-50%)' }}
                  />
                </div>
                <p className="text-xs text-white/50 mt-2">Progress: {percentProgress}%</p>
              </div>

              <div className="flex gap-3 items-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={handleAction}
                  className={`px-6 py-3 rounded-xl bg-green-600/80 text-white font-semibold ${!running ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  ACTION
                </motion.button>

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
                <li>Click ACTION when the bar is as close to the center area as possible.</li>
                <li>Complete all steps quickly to get a higher score multiplier.</li>
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
