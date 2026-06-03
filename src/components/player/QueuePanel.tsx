import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Trash2 } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import { formatTime } from '../../utils/formatTime'
import { cn } from '../../utils/cn'
import { DraggableList } from '../ui/DraggableList'
import { Button } from '../ui/Button'

export const QueuePanel = memo(function QueuePanel() {
  const showQueue = usePlayerStore((s) => s.showQueue)
  const setShowQueue = usePlayerStore((s) => s.setShowQueue)
  const queue = usePlayerStore((s) => s.queue)
  const queueIndex = usePlayerStore((s) => s.queueIndex)
  const playQueue = usePlayerStore((s) => s.playQueue)
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue)
  const reorderQueue = usePlayerStore((s) => s.reorderQueue)
  const clearQueue = usePlayerStore((s) => s.clearQueue)

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
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold">Queue</h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {queue.length} track{queue.length !== 1 ? 's' : ''}
                  {queue[queueIndex] && (
                    <span className="text-[var(--color-accent)]">
                      {' '}
                      · Now: {queue[queueIndex].title}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {queue.length > 1 && (
                  <button
                    type="button"
                    onClick={clearQueue}
                    className="p-2 rounded-full hover:bg-white/10 text-[var(--color-text-muted)]"
                    aria-label="Clear queue"
                    title="Clear queue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowQueue(false)}
                  className="p-2 rounded-full hover:bg-white/10"
                  aria-label="Close queue"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {queue.length === 0 ? (
                <p className="text-center text-[var(--color-text-muted)] py-12">
                  Queue is empty. Play a song or add tracks from the menu.
                </p>
              ) : (
                <DraggableList
                  items={queue}
                  keyExtractor={(song, i) => `${song.id}-${i}`}
                  onReorder={reorderQueue}
                  renderItem={(song, i) => (
                    <div
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl transition-colors flex-1',
                        i === queueIndex
                          ? 'bg-[var(--color-accent)]/15 ring-1 ring-[var(--color-accent)]/30'
                          : 'hover:bg-white/5',
                      )}
                    >
                      {i === queueIndex && (
                        <span className="text-[10px] uppercase font-bold text-[var(--color-accent)] shrink-0">
                          Now
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => playQueue(queue, i)}
                        className="flex items-center gap-3 flex-1 min-w-0 text-left"
                      >
                        <img
                          src={song.coverUrl}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
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
                        <span className="text-xs text-[var(--color-text-muted)] tabular-nums shrink-0">
                          {formatTime(song.duration)}
                        </span>
                      </button>
                      {i !== queueIndex && (
                        <button
                          type="button"
                          onClick={() => removeFromQueue(i)}
                          className="p-2 text-[var(--color-text-muted)] hover:text-white shrink-0"
                          aria-label="Remove from queue"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                />
              )}
            </div>

            <div className="p-4 border-t border-white/10 sm:hidden">
              <Button variant="secondary" className="w-full" onClick={() => setShowQueue(false)}>
                Close
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
})
