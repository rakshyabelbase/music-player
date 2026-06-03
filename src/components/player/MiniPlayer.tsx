import { memo, useCallback } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { Heart, ListOrdered, Mic2, Maximize2 } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { formatTime } from '../../utils/formatTime'
import { ProgressBar } from '../ui/ProgressBar'
import { PlayerControls } from './PlayerControls'
import { Equalizer } from '../music/Equalizer'
import { cn } from '../../utils/cn'

interface MiniPlayerProps {
  onSeek: (time: number) => void
}

const SWIPE_UP_THRESHOLD = -80

export const MiniPlayer = memo(function MiniPlayer({ onSeek }: MiniPlayerProps) {
  const isMobile = useIsMobile()
  const currentSong = usePlayerStore((s) => s.currentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const duration = usePlayerStore((s) => s.duration)
  const bufferProgress = usePlayerStore((s) => s.bufferProgress)
  const isLoading = usePlayerStore((s) => s.isLoading)
  const setFullPlayerOpen = usePlayerStore((s) => s.setFullPlayerOpen)
  const setShowQueue = usePlayerStore((s) => s.setShowQueue)
  const setShowLyrics = usePlayerStore((s) => s.setShowLyrics)
  const isLiked = usePlayerStore((s) => s.isLiked)
  const toggleLike = usePlayerStore((s) => s.toggleLike)

  const dragY = useMotionValue(0)
  const opacity = useTransform(dragY, [0, -120], [1, 0.6])

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.y < SWIPE_UP_THRESHOLD || info.velocity.y < -400) {
        setFullPlayerOpen(true)
      }
      dragY.set(0)
    },
    [setFullPlayerOpen, dragY],
  )

  return (
    <AnimatePresence>
      {currentSong && (
        <motion.footer
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          style={isMobile ? { opacity } : undefined}
          drag={isMobile ? 'y' : false}
          dragConstraints={{ top: -160, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={isMobile ? handleDragEnd : undefined}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-30 glass-strong border-t border-white/10 safe-bottom',
            'md:left-[240px] lg:left-[260px]',
            isMobile && 'touch-pan-y',
          )}
        >
          {isMobile && (
            <div className="flex justify-center pt-2 pb-0">
              <div className="w-10 h-1 rounded-full bg-white/20" aria-hidden />
            </div>
          )}

          <div className="relative">
            <div
              className="absolute inset-x-0 top-0 h-1 bg-white/10 pointer-events-none"
              aria-hidden
            >
              <div
                className="h-full bg-white/25 transition-[width] duration-300"
                style={{ width: `${bufferProgress * 100}%` }}
              />
            </div>
            <ProgressBar
              value={currentTime}
              max={duration || currentSong.duration}
              onSeek={onSeek}
              className="h-1 rounded-none relative z-10"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3">
            <button
              type="button"
              onClick={() => setFullPlayerOpen(true)}
              className="flex items-center gap-3 flex-1 min-w-0 text-left group touch-manipulation"
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
                {isLoading && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
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
                onClick={() => toggleLike(currentSong.id)}
                className="p-2 rounded-full hover:bg-white/10 touch-manipulation"
                aria-label="Like"
              >
                <Heart
                  className={cn(
                    'w-4 h-4',
                    isLiked(currentSong.id)
                      ? 'fill-[var(--color-accent)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-muted)]',
                  )}
                />
              </button>
              <button
                type="button"
                onClick={() => setShowLyrics(true)}
                className="p-2 rounded-full hover:bg-white/10 text-[var(--color-text-muted)] hover:text-white touch-manipulation"
                aria-label="Lyrics"
              >
                <Mic2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowQueue(true)}
                className="p-2 rounded-full hover:bg-white/10 text-[var(--color-text-muted)] hover:text-white touch-manipulation"
                aria-label="Queue"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setFullPlayerOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 text-[var(--color-text-muted)] hover:text-white touch-manipulation md:hidden"
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
})
