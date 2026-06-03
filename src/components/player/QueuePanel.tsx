import { AnimatePresence, motion } from 'framer-motion'
import { X, GripVertical } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import { formatTime } from '../../utils/formatTime'
import { cn } from '../../utils/cn'

export function QueuePanel() {
  const showQueue = usePlayerStore((s) => s.showQueue)
  const setShowQueue = usePlayerStore((s) => s.setShowQueue)
  const queue = usePlayerStore((s) => s.queue)
  const queueIndex = usePlayerStore((s) => s.queueIndex)
  const playQueue = usePlayerStore((s) => s.playQueue)
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue)

  return (
    <AnimatePresence>
      {showQueue && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setShowQueue(false)}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-strong z-50 flex flex-col safe-bottom"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold">Queue</h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {queue.length} tracks
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowQueue(false)}
                className="p-2 rounded-full hover:bg-white/10"
                aria-label="Close queue"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {queue.length === 0 ? (
                <p className="text-center text-[var(--color-text-muted)] py-12">
                  Queue is empty
                </p>
              ) : (
                queue.map((song, i) => (
                  <motion.div
                    key={`${song.id}-${i}`}
                    layout
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl transition-colors',
                      i === queueIndex
                        ? 'bg-[var(--color-accent)]/15 ring-1 ring-[var(--color-accent)]/30'
                        : 'hover:bg-white/5',
                    )}
                  >
                    <GripVertical className="w-4 h-4 text-[var(--color-text-muted)] shrink-0 hidden sm:block" />
                    <button
                      type="button"
                      onClick={() => playQueue(queue, i)}
                      className="flex items-center gap-3 flex-1 min-w-0 text-left"
                    >
                      <img
                        src={song.coverUrl}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'font-medium truncate',
                            i === queueIndex && 'text-[var(--color-accent)]',
                          )}
                        >
                          {song.title}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)] truncate">
                          {song.artistName}
                        </p>
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)] tabular-nums">
                        {formatTime(song.duration)}
                      </span>
                    </button>
                    {i !== queueIndex && (
                      <button
                        type="button"
                        onClick={() => removeFromQueue(i)}
                        className="p-2 text-[var(--color-text-muted)] hover:text-white"
                        aria-label="Remove from queue"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
