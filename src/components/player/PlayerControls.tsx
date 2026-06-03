import { memo } from 'react'
import { motion } from 'framer-motion'
import {
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Shuffle,
  Repeat,
  Repeat1,
} from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import { cn } from '../../utils/cn'

interface PlayerControlsProps {
  size?: 'sm' | 'lg'
  showShuffleRepeat?: boolean
}

export const PlayerControls = memo(function PlayerControls({
  size = 'sm',
  showShuffleRepeat = true,
}: PlayerControlsProps) {
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const shuffle = usePlayerStore((s) => s.shuffle)
  const repeatMode = usePlayerStore((s) => s.repeatMode)
  const togglePlay = usePlayerStore((s) => s.togglePlay)
  const next = usePlayerStore((s) => s.next)
  const previous = usePlayerStore((s) => s.previous)
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle)
  const setRepeatMode = usePlayerStore((s) => s.setRepeatMode)

  const cycleRepeat = () => {
    const modes = ['off', 'all', 'one'] as const
    const idx = modes.indexOf(repeatMode)
    setRepeatMode(modes[(idx + 1) % modes.length])
  }

  const playSize = size === 'lg' ? 'w-16 h-16' : 'w-10 h-10'
  const iconSize = size === 'lg' ? 'w-7 h-7' : 'w-5 h-5'
  const smallIcon = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6">
      {showShuffleRepeat && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={toggleShuffle}
          className={cn(
            'p-2 rounded-full transition-colors',
            shuffle ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] hover:text-white',
          )}
          aria-label="Shuffle"
          aria-pressed={shuffle}
        >
          <Shuffle className={smallIcon} />
        </motion.button>
      )}

      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={previous}
        className="text-[var(--color-text-muted)] hover:text-white p-2"
        aria-label="Previous"
      >
        <SkipBack className={iconSize} fill="currentColor" />
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={togglePlay}
        className={cn(
          playSize,
          'rounded-full bg-white flex items-center justify-center text-black shadow-xl hover:scale-105 transition-transform',
        )}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className={cn(iconSize, 'fill-current')} />
        ) : (
          <Play className={cn(iconSize, 'fill-current ml-0.5')} />
        )}
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={next}
        className="text-[var(--color-text-muted)] hover:text-white p-2"
        aria-label="Next"
      >
        <SkipForward className={iconSize} fill="currentColor" />
      </motion.button>

      {showShuffleRepeat && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={cycleRepeat}
          className={cn(
            'p-2 rounded-full transition-colors',
            repeatMode !== 'off'
              ? 'text-[var(--color-accent)]'
              : 'text-[var(--color-text-muted)] hover:text-white',
          )}
          aria-label={`Repeat: ${repeatMode}`}
        >
          {repeatMode === 'one' ? (
            <Repeat1 className={smallIcon} />
          ) : (
            <Repeat className={smallIcon} />
          )}
        </motion.button>
      )}
    </div>
  )
})
