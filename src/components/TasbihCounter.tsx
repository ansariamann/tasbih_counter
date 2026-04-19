import { useState, useCallback, useEffect, useRef } from "react";
import { RotateCcw, Minus } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import TasbihSettings from "./TasbihSettings";

// Create a gentle pop/tap sound using Web Audio API
const playClickSound = (audioContext: AudioContext | null) => {
  if (!audioContext) return;

  // Main tap sound
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Short pop sound
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    150,
    audioContext.currentTime + 0.04
  );

  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.05
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.05);
};

// Create a gentle chime sound for completion
const playChimeSound = (audioContext: AudioContext | null) => {
  if (!audioContext) return;

  // Play a sequence of pleasant tones
  const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord

  frequencies.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      freq,
      audioContext.currentTime + index * 0.15
    );

    const startTime = audioContext.currentTime + index * 0.15;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.8);
  });
};

const TasbihCounter = () => {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem("tasbih-count");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [target, setTarget] = useState(() => {
    const saved = localStorage.getItem("tasbih-target");
    return saved ? parseInt(saved, 10) : 100;
  });
  const [multiplier, setMultiplier] = useState(() => {
    const saved = localStorage.getItem("tasbih-multiplier");
    return saved ? parseInt(saved, 10) : 1;
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem("tasbih-sound");
    return saved !== "false";
  });
  const [vibrationEnabled, setVibrationEnabled] = useState(() => {
    const saved = localStorage.getItem("tasbih-vibration");
    return saved !== "false";
  });
  const [totalCount, setTotalCount] = useState(() => {
    const saved = localStorage.getItem("tasbih-total");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [resetClickCount, setResetClickCount] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const audioContextRef = useRef<AudioContext | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);

  // Persist settings
  useEffect(() => {
    localStorage.setItem("tasbih-count", count.toString());
  }, [count]);

  useEffect(() => {
    localStorage.setItem("tasbih-total", totalCount.toString());
  }, [totalCount]);

  useEffect(() => {
    localStorage.setItem("tasbih-sound", soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem("tasbih-vibration", vibrationEnabled.toString());
  }, [vibrationEnabled]);

  useEffect(() => {
    localStorage.setItem("tasbih-target", target.toString());
  }, [target]);

  useEffect(() => {
    localStorage.setItem("tasbih-multiplier", multiplier.toString());
  }, [multiplier]);

  const ensureAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Track previous completion state to play chime only once
  const prevIsCompleteRef = useRef(false);

  const progress = Math.min((count / target) * 100, 100);
  const isComplete = count >= target;

  // Play chime when completing
  useEffect(() => {
    if (isComplete && !prevIsCompleteRef.current && soundEnabled) {
      const ctx = ensureAudioContext();
      playChimeSound(ctx);
      // Vibrate on completion
      if (vibrationEnabled && navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }
    }
    prevIsCompleteRef.current = isComplete;
  }, [
    isComplete,
    soundEnabled,
    vibrationEnabled,
    ensureAudioContext,
  ]);

  const increment = useCallback(() => {
    // Clear any pending animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    setCount((prev) => {
      const nextCount = prev + multiplier;
      if (prev < target && nextCount >= target) {
        setTotalCount((t) => t + nextCount);
      }
      return nextCount;
    });
    setIsAnimating(true);

    animationTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false);
    }, 150);

    if (soundEnabled) {
      const ctx = ensureAudioContext();
      playClickSound(ctx);
    }

    // Trigger vibration based on strength
    if (vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [
    soundEnabled,
    vibrationEnabled,
    multiplier,
    target,
    ensureAudioContext,
  ]);

  const decrement = useCallback(() => {
    if (count > 0) {
      const decrementValue = Math.min(count, multiplier);
      setCount((prev) => {
        const nextCount = prev - decrementValue;
        if (prev >= target && nextCount < target) {
          setTotalCount((t) => Math.max(0, t - prev));
        }
        return nextCount;
      });
    }
  }, [count, multiplier, target]);

  const reset = useCallback(() => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    if (count > 0) {
      setCount(0);
      setResetClickCount(1);
      resetTimeoutRef.current = window.setTimeout(() => {
        setResetClickCount(0);
      }, 3000);
    } else if (totalCount > 0) {
      if (resetClickCount === 0) {
        setResetClickCount(1);
        resetTimeoutRef.current = window.setTimeout(() => {
          setResetClickCount(0);
        }, 3000);
      } else {
        setTotalCount(0);
        setResetClickCount(0);
      }
    }
  }, [count, totalCount, resetClickCount]);

  const motionVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: shouldReduceMotion ? 0 : 0.8 },
  };

  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 p-4 select-none">
      {/* Settings Menu */}
      <TasbihSettings
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        multiplier={multiplier}
        setMultiplier={setMultiplier}
        target={target}
        setTarget={setTarget}
        vibrationEnabled={vibrationEnabled}
        setVibrationEnabled={setVibrationEnabled}
      />

      {/* Title */}
      <motion.h1
        className="tasbih-title text-4xl md:text-5xl tracking-wide text-gold gold-inner-glow"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Tasbih
      </motion.h1>

      {/* Main Counter Circle */}
      <motion.button
        type="button"
        onClick={increment}
        aria-label="Increment count"
        className={`relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full counter-glass flex items-center justify-center cursor-pointer select-none ${
          isAnimating ? "counter-pulse" : ""
        } ${isComplete ? "ring-4 ring-gold/30" : ""}`}
        whileTap={{ scale: 0.97 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: 0.2 }}
      >
        {/* Progress Ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="2"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="hsl(var(--gold))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={289}
            strokeDashoffset={289 - (289 * progress) / 100}
            initial={{ strokeDashoffset: 289 }}
            animate={{ strokeDashoffset: 289 - (289 * progress) / 100 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          />
        </svg>

        {/* Count Display */}
        <div className="flex flex-col items-center z-10">
          <motion.span
            className={`text-7xl md:text-9xl font-extralight transition-colors duration-300 ${
              isComplete ? "text-gold" : "text-foreground"
            } ${isAnimating ? "count-animate" : ""}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
          >
            {count}
          </motion.span>
          <span className="text-sm text-muted-foreground mt-2">
            of {target}{" "}
            {multiplier > 1 && (
              <span className="text-gold">({multiplier}x)</span>
            )}
          </span>
        </div>
      </motion.button>
      {/* Controls */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: 0.4 }}
      >
        {/* Decrement */}
        <button
          onClick={decrement}
          disabled={count === 0}
          aria-label="Decrement count"
          className="w-12 h-12 rounded-full glass-card button-depth flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-gold/50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus className="w-5 h-5" />
        </button>

        {/* Reset */}
        <div className="relative flex flex-col items-center">
          <button
            onClick={reset}
            aria-label="Reset count"
            className={`w-14 h-14 rounded-full glass-card button-depth flex items-center justify-center transition-colors ${
              resetClickCount > 0
                ? "text-red-400 border-red-500/50"
                : "text-muted-foreground hover:text-gold hover:border-gold/50"
            }`}
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          
        </div>
      </motion.div>
      {/* Total Counter */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: 0.6 }}
      >
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          Total Dhikr
        </p>
        <p className="text-2xl font-light text-gold gold-glow">
          {totalCount.toLocaleString()}
        </p>
      </motion.div>

      {/* Full Screen Completion Animation */}
      <AnimatePresence>
        {!shouldReduceMotion && isComplete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => setCount(0)}
          >
            {/* Glowing background effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-gold/20 via-transparent to-transparent"
              initial={{ scale: 0 }}
              animate={{ scale: 2 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Particle effects */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gold rounded-full"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: Math.cos((i * 30 * Math.PI) / 180) * 200,
                  y: Math.sin((i * 30 * Math.PI) / 180) * 200,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.3,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Main Arabic text */}
            <motion.div
              className="text-center z-10"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
            >
              <motion.p
                className="text-6xl md:text-8xl font-bold text-gold drop-shadow-[0_0_30px_rgba(212,175,55,0.8)]"
                style={{ fontFamily: "'Amiri', 'Times New Roman', serif" }}
                animate={{
                  textShadow: [
                    "0 0 20px rgba(212,175,55,0.5)",
                    "0 0 40px rgba(212,175,55,0.8)",
                    "0 0 20px rgba(212,175,55,0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                سُبْحَانَ اللَّه
              </motion.p>

              <motion.p
                className="text-sm text-white/50 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Tap anywhere to continue
              </motion.p>
            </motion.div>

            {/* Decorative rings */}
            <motion.div
              className="absolute w-64 h-64 md:w-96 md:h-96 border border-gold/30 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0.5 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <motion.div
              className="absolute w-48 h-48 md:w-72 md:h-72 border border-gold/20 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: 0.3 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      
    </div>
  );
};

export default TasbihCounter;
