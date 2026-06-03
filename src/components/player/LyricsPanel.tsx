import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import { useActiveLyric } from '../../hooks/useActiveLyric'
import { cn } from '../../utils/cn'

export function LyricsPanel() {
  const showLyrics = usePlayerStore((s) => s.showLyrics)
  const setShowLyrics = usePlayerStore((s) => s.setShowLyrics)
  const currentSong = usePlayerStore((s) => s.currentSong)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const activeIndex = useActiveLyric(currentSong?.lyrics, currentTime)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showLyrics || activeIndex < 0) return
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeIndex, showLyrics])

  const lyrics = currentSong?.lyrics ?? []

  return (
    <AnimatePresence>
      {showLyrics && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setShowLyrics(false)}
          />
          <motion.aside
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 right-0 bottom-0 max-h-[70vh] glass-strong z-50 rounded-t-3xl flex flex-col safe-bottom"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <div>
                <h2 className="text-lg font-bold">Lyrics</h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {currentSong?.title ?? 'No track'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLyrics(false)}
                className="p-2 rounded-full hover:bg-white/10"
                aria-label="Close lyrics"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-8 py-6 space-y-4 text-center"
            >
              {lyrics.length === 0 ? (
                <p className="text-[var(--color-text-muted)] py-12">
                  No lyrics available for this track
                </p>
              ) : (
                lyrics.map((line, i) => (
                  <motion.p
                    key={i}
                    animate={{
                      opacity: i === activeIndex ? 1 : 0.35,
                      scale: i === activeIndex ? 1.05 : 1,
                    }}
                    className={cn(
                      'text-lg sm:text-xl font-medium transition-colors duration-300',
                      i === activeIndex
                        ? 'text-[var(--color-accent)]'
                        : 'text-white',
                    )}
                  >
                    {line.text}
                  </motion.p>
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
