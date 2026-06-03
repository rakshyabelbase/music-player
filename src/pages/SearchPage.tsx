import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { SongRow } from '../components/music/SongRow'
import { EmptyState } from '../components/ui/EmptyState'
import { GridSkeleton } from '../components/ui/Skeleton'
import { searchSongs, songs } from '../data/mockMusic'
import { usePlayerStore } from '../store/playerStore'

const genres = ['Electronic', 'Synthwave', 'Indie Pop', 'House', 'Ambient']

export function SearchPage() {
  const searchQuery = usePlayerStore((s) => s.searchQuery)
  const setSearchQuery = usePlayerStore((s) => s.setSearchQuery)
  const [debounced, setDebounced] = useState(searchQuery)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => {
      setDebounced(searchQuery)
      setLoading(false)
    }, 400)
    return () => clearTimeout(t)
  }, [searchQuery])

  const results = useMemo(() => searchSongs(debounced), [debounced])

  return (
    <div className="p-4 sm:p-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Artists, songs, albums, or genres"
          className="w-full pl-12 pr-12 py-4 rounded-2xl glass text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 transition-shadow"
          autoFocus
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
            aria-label="Clear search"
          >
            <X className="w-5 h-5 text-[var(--color-text-muted)]" />
          </button>
        )}
      </motion.div>

      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Browse genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre, i) => (
                <motion.button
                  key={genre}
                  type="button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchQuery(genre)}
                  className="px-4 py-2 rounded-full glass text-sm font-medium hover:bg-white/10"
                >
                  {genre}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Popular searches</h3>
            <div className="space-y-1">
              {songs.slice(0, 5).map((song, i) => (
                <SongRow key={song.id} song={song} index={i} />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {searchQuery && (
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" exit={{ opacity: 0 }}>
              <GridSkeleton count={4} />
            </motion.div>
          ) : results.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EmptyState
                icon={Search}
                title="No results found"
                description={`We couldn't find anything for "${searchQuery}". Try a different search.`}
                actionLabel="Clear search"
                onAction={() => setSearchQuery('')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm text-[var(--color-text-muted)] mb-4">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-1">
                {results.map((song, i) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <SongRow song={song} index={i} playlist={results} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
