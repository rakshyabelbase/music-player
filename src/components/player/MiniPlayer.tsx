import { AnimatePresence, motion } from 'framer-motion'
import { Heart, ListOrdered, Mic2, Maximize2 } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import { formatTime } from '../../utils/formatTime'
import { ProgressBar } from '../ui/ProgressBar'
import { PlayerControls } from './PlayerControls'
import { Equalizer } from '../music/Equalizer'
import { cn } from '../../utils/cn'

interface MiniPlayerProps {
  onSeek: (time: number) => void
}

export function MiniPlayer({ onSeek }: MiniPlayerProps) {
  const currentSong = usePlayerStore((s) => s.currentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const duration = usePlayerStore((s) => s.duration)
  const setFullPlayerOpen = usePlayerStore((s) => s.setFullPlayerOpen)
  const setShowQueue = usePlayerStore((s) => s.setShowQueue)
  const setShowLyrics = usePlayerStore((s) => s.setShowLyrics)
  const isLiked = usePlayerStore((s) => s.isLiked)
  const toggleLike = usePlayerStore((s) => s.toggleLike)

  return (
    <AnimatePresence>
      {currentSong && (
        <motion.footer
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-30 glass-strong border-t border-white/10 safe-bottom md:left-[240px] lg:left-[260px]"
        >
          <ProgressBar
            value={currentTime}
            max={duration || currentSong.duration}
            onSeek={onSeek}
            className="h-1 rounded-none"
          />

          <div className="flex items-center gap-3 px-4 py-2 sm:py-3">
            <button
              type="button"
              onClick={() => setFullPlayerOpen(true)}
              className="flex items-center gap-3 flex-1 min-w-0 text-left group"
            >
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0">
                <motion.img
                  src={currentSong.coverUrl}
                  alt=""
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={
                    isPlaying
                      ? { duration: 20, repeat: Infinity, ease: 'linear' }
                      : { duration: 0.5 }
                  }
                  className="w-full h-full rounded-lg object-cover"
                />
                {isPlaying && (
                  <div className="absolute -inset-1 rounded-lg ring-2 ring-[var(--color-accent)]/50 animate-pulse pointer-events-none" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate group-hover:text-[var(--color-accent)] transition-colors">
                  {currentSong.title}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] truncate flex items-center gap-2">
                  {currentSong.artistName}
                  {isPlaying && <Equalizer isPlaying className="hidden sm:flex" />}
                </p>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs text-[var(--color-text-muted)] tabular-nums shrink-0">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration || currentSong.duration)}</span>
            </div>

            <PlayerControls size="sm" showShuffleRepeat={false} />

            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={() => currentSong && toggleLike(currentSong.id)}
                className="p-2 rounded-full hover:bg-white/10"
                aria-label="Like"
              >
                <Heart
                  className={cn(
                    'w-4 h-4',
                    currentSong && isLiked(currentSong.id)
                      ? 'fill-[var(--color-accent)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-muted)]',
                  )}
                />
              </button>
              <button
                type="button"
                onClick={() => setShowLyrics(true)}
                className="p-2 rounded-full hover:bg-white/10 text-[var(--color-text-muted)] hover:text-white"
                aria-label="Lyrics"
              >
                <Mic2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowQueue(true)}
                className="p-2 rounded-full hover:bg-white/10 text-[var(--color-text-muted)] hover:text-white"
                aria-label="Queue"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setFullPlayerOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 text-[var(--color-text-muted)] hover:text-white"
                aria-label="Expand player"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.footer>
      )}
    </AnimatePresence>
  )
}
