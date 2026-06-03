import { motion } from 'framer-motion'
import { Play, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { usePlayerStore } from '../store/playerStore'
import { songs } from '../data/mockMusic'

const visualizerBars = Array.from({ length: 32 }, (_, i) => {
  const seed = Math.sin(i * 12.9898) * 43758.5453
  const random = seed - Math.floor(seed)

  return {
    height: `${30 + random * 70}%`,
    duration: 1 + random,
  }
})

export function LandingPage() {
  const enterApp = usePlayerStore((s) => s.enterApp)
  const playSong = usePlayerStore((s) => s.playSong)

  const handleStart = () => {
    enterApp()
    if (songs[0]) playSong(songs[0])
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[var(--color-surface)]">
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-25 blur-[150px]"
        style={{
          background:
            'conic-gradient(from 180deg, var(--color-accent), var(--color-accent-secondary), var(--color-accent))',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center px-6 max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
        >
          <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
          <span className="text-sm text-[var(--color-text-muted)]">
            Premium streaming experience
          </span>
        </motion.div>

        <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 tracking-tight">
          <span className="text-gradient">Feel every</span>
          <br />
          <motion.span
            className="text-[var(--color-accent)]"
            animate={{
              textShadow: [
                '0 0 20px var(--color-accent-glow)',
                '0 0 40px var(--color-accent-glow)',
                '0 0 20px var(--color-accent-glow)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            beat
          </motion.span>
        </h1>

        <p className="text-lg text-[var(--color-text-muted)] mb-10 max-w-md mx-auto">
          Immersive sound, stunning visuals, and seamless control. Your music,
          elevated.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="lg" onClick={handleStart}>
            <Play className="w-5 h-5 fill-current" />
            Start Listening
          </Button>
          <Button variant="secondary" size="lg" onClick={enterApp}>
            Explore Library
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex justify-center gap-1 h-12 items-end"
        >
          {visualizerBars.map((bar, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-gradient-to-t from-[var(--color-accent)] to-transparent"
              animate={{ height: ['20%', bar.height, '20%'] }}
              transition={{
                duration: bar.duration,
                repeat: Infinity,
                delay: i * 0.05,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
