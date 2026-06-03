import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, Heart, TrendingUp } from 'lucide-react'
import { SongRow } from '../components/music/SongRow'
import { EmptyState } from '../components/ui/EmptyState'
import { GridSkeleton } from '../components/ui/Skeleton'
import { songs } from '../data/mockMusic'
import { usePlayerStore } from '../store/playerStore'
import { searchSongs } from '../utils/search'
import type { SearchFilter } from '../types'
import { cn } from '../utils/cn'

const genres = ['Electronic', 'Synthwave', 'Indie Pop', 'House', 'Ambient']

const filters: { id: SearchFilter; label: string; icon: typeof Search }[] = [
  { id: 'all', label: 'All', icon: Search },
  { id: 'recent', label: 'Recent', icon: Clock },
  { id: 'liked', label: 'Liked', icon: Heart },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
]

export function SearchPage() {
  const searchQuery = usePlayerStore((s) => s.searchQuery)
  const setSearchQuery = usePlayerStore((s) => s.setSearchQuery)
  const searchFilter = usePlayerStore((s) => s.searchFilter)
  const setSearchFilter = usePlayerStore((s) => s.setSearchFilter)
  const likedSongIds = usePlayerStore((s) => s.likedSongIds)
  const recentlyPlayedIds = usePlayerStore((s) => s.recentlyPlayedIds)

  const [debounced, setDebounced] = useState(searchQuery)
  const loading = searchQuery !== debounced

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(searchQuery)
    }, 400)
    return () => clearTimeout(t)
  }, [searchQuery])

  const results = useMemo(
    () => searchSongs(debounced, searchFilter, likedSongIds, recentlyPlayedIds),
    [debounced, searchFilter, likedSongIds, recentlyPlayedIds],
  )

  const showResults = searchQuery.length > 0 || searchFilter !== 'all'

  return (
    <div className="p-4 sm:p-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-4"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Song, artist, album, or genre"
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

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
        {filters.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSearchFilter(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0',
              searchFilter === id
                ? 'bg-[var(--color-accent)] text-black'
                : 'glass hover:bg-white/10',
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {!showResults && (
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

      {showResults && (
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
                description={
                  searchQuery
                    ? `We couldn't find anything for "${searchQuery}" in ${searchFilter === 'all' ? 'the catalog' : searchFilter + ' songs'}.`
                    : `No ${searchFilter} songs to show. Try another filter or search term.`
                }
                actionLabel={searchQuery ? 'Clear search' : undefined}
                onAction={searchQuery ? () => setSearchQuery('') : undefined}
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
                {searchFilter !== 'all' && ` · ${searchFilter}`}
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
