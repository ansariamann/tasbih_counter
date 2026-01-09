import { useState } from "react";
import {
  Menu,
  Volume2,
  VolumeX,
  Hash,
  Target,
  Vibrate,
  X,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const MULTIPLIER_OPTIONS = [1, 2, 3];
const TARGET_PRESETS = [33, 100, 313];

interface TasbihSettingsProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  multiplier: number;
  setMultiplier: (multiplier: number) => void;
  target: number;
  setTarget: (target: number) => void;
  vibrationEnabled: boolean;
  setVibrationEnabled: (enabled: boolean) => void;
}

const TasbihSettings = ({
  soundEnabled,
  setSoundEnabled,
  multiplier,
  setMultiplier,
  target,
  setTarget,
  vibrationEnabled,
  setVibrationEnabled,
}: TasbihSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customTarget, setCustomTarget] = useState("");
  const [customMultiplier, setCustomMultiplier] = useState("");
  const [showCustomTarget, setShowCustomTarget] = useState(false);
  const [showCustomMultiplier, setShowCustomMultiplier] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleCustomTarget = () => {
    const value = parseInt(customTarget, 10);
    if (value > 0) {
      setTarget(value);
      setCustomTarget("");
      setShowCustomTarget(false);
    }
  };

  const handleCustomMultiplier = () => {
    const value = parseInt(customMultiplier, 10);
    if (value > 0 && value <= 100) {
      setMultiplier(value);
      setCustomMultiplier("");
      setShowCustomMultiplier(false);
    }
  };

  const panelVariants = {
    initial: { x: shouldReduceMotion ? 0 : "100%" },
    animate: { x: 0 },
    exit: { x: shouldReduceMotion ? 0 : "100%" },
    transition: { type: "spring", damping: 25, stiffness: 300 },
  };

  return (
    <>
      {/* Settings Toggle Button - Fixed position */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open settings"
        className="fixed top-6 right-6 w-10 h-10 flex items-center justify-center text-white/70 hover:text-gold transition-all z-30"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="frost p-6 fixed right-0 top-0 h-full w-80 max-w-[85vw] z-50 overflow-y-auto"
              variants={panelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition="transition"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-light text-gold tracking-wider">
                  Settings
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close settings"
                  className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                {/* Target Selection */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="w-5 h-5 text-gold" />
                    <span className="text-sm">Target count</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TARGET_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setTarget(preset)}
                        aria-label={`Set target count to ${preset}`}
                        className={`px-4 py-2 rounded-lg text-sm transition-all ${
                          target === preset
                            ? "bg-gold/20 text-gold border border-gold/30"
                            : "glass-card hover:border-gold/30 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowCustomTarget(!showCustomTarget)}
                      aria-label="Set custom target count"
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        !TARGET_PRESETS.includes(target)
                          ? "bg-gold/20 text-gold border border-gold/30"
                          : "glass-card hover:border-gold/30 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {!TARGET_PRESETS.includes(target) ? target : "Custom"}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showCustomTarget && (
                      <motion.div
                        className="flex gap-2 mt-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <input
                          type="number"
                          value={customTarget}
                          onChange={(e) => setCustomTarget(e.target.value)}
                          placeholder="Enter target"
                          aria-label="Custom target value"
                          className="flex-1 px-3 py-2 rounded-lg glass-card text-sm bg-transparent border-gold/20 focus:border-gold/50 focus:outline-none"
                          min="1"
                        />
                        <button
                          onClick={handleCustomTarget}
                          aria-label="Set custom target"
                          className="px-4 py-2 rounded-lg bg-gold/20 text-gold text-sm hover:bg-gold/30 transition-all"
                        >
                          Set
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-gold/10 my-6" />

                {/* Count Multiplier */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Hash className="w-5 h-5 text-gold" />
                    <span className="text-sm">Count per click</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {MULTIPLIER_OPTIONS.map((option) => (
                      <button
                        key={option}
                        onClick={() => setMultiplier(option)}
                        aria-label={`Set count per click to ${option}`}
                        className={`px-4 py-2 rounded-lg text-sm transition-all ${
                          multiplier === option
                            ? "bg-gold/20 text-gold border border-gold/30"
                            : "glass-card hover:border-gold/30 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {option}x
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setShowCustomMultiplier(!showCustomMultiplier)
                      }
                      aria-label="Set custom count per click"
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        !MULTIPLIER_OPTIONS.includes(multiplier)
                          ? "bg-gold/20 text-gold border border-gold/30"
                          : "glass-card hover:border-gold/30 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {!MULTIPLIER_OPTIONS.includes(multiplier)
                        ? `${multiplier}x`
                        : "Custom"}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showCustomMultiplier && (
                      <motion.div
                        className="flex gap-2 mt-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <input
                          type="number"
                          value={customMultiplier}
                          onChange={(e) => setCustomMultiplier(e.target.value)}
                          placeholder="Enter value"
                          aria-label="Custom multiplier value"
                          className="flex-1 px-3 py-2 rounded-lg glass-card text-sm bg-transparent border-gold/20 focus:border-gold/50 focus:outline-none"
                          min="1"
                          max="100"
                        />
                        <button
                          onClick={handleCustomMultiplier}
                          aria-label="Set custom multiplier"
                          className="px-4 py-2 rounded-lg bg-gold/20 text-gold text-sm hover:bg-gold/30 transition-all"
                        >
                          Set
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-gold/10 my-6" />

                {/* Sound Toggle */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {soundEnabled ? (
                        <Volume2 className="w-5 h-5 text-gold" />
                      ) : (
                        <VolumeX className="w-5 h-5 text-muted-foreground" />
                      )}
                      <span className="text-sm">Sound</span>
                    </div>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      aria-label={
                        soundEnabled ? "Disable sound" : "Enable sound"
                      }
                      className={`w-12 h-6 rounded-full transition-all ${
                        soundEnabled ? "bg-gold/30" : "bg-muted"
                      } relative`}
                    >
                      <motion.div
                        className={`w-5 h-5 rounded-full absolute top-0.5 ${
                          soundEnabled ? "bg-gold" : "bg-muted-foreground"
                        }`}
                        animate={{
                          left: soundEnabled ? "calc(100% - 22px)" : "2px",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    </button>
                  </div>
                </div>

                {/* Vibration */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Vibrate
                        className={`w-5 h-5 ${
                          vibrationEnabled
                            ? "text-gold"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span className="text-sm">Vibration</span>
                    </div>
                    <button
                      onClick={() => setVibrationEnabled(!vibrationEnabled)}
                      aria-label={
                        vibrationEnabled ? "Disable vibration" : "Enable vibration"
                      }
                      className={`w-12 h-6 rounded-full transition-all ${
                        vibrationEnabled ? "bg-gold/30" : "bg-muted"
                      } relative`}
                    >
                      <motion.div
                        className={`w-5 h-5 rounded-full absolute top-0.5 ${
                          vibrationEnabled ? "bg-gold" : "bg-muted-foreground"
                        }`}
                        animate={{
                          left: vibrationEnabled ? "calc(100% - 22px)" : "2px",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default TasbihSettings;
