import { motion } from 'framer-motion'
import { Heart, Play } from 'lucide-react'
import { SectionHeader } from '../components/layout/SectionHeader'
import { SongRow } from '../components/music/SongRow'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { getSongsByIds } from '../data/mockMusic'
import { usePlayerStore } from '../store/playerStore'
import { formatTime } from '../utils/formatTime'

export function LikedSongsPage() {
  const likedSongIds = usePlayerStore((s) => s.likedSongIds)
  const playQueue = usePlayerStore((s) => s.playQueue)
  const likedSongs = getSongsByIds(likedSongIds)
  const totalDuration = likedSongs.reduce((acc, s) => acc + s.duration, 0)

  if (likedSongs.length === 0) {
    return (
      <div className="p-4 sm:p-6">
        <EmptyState
          icon={Heart}
          title="No liked songs yet"
          description="Tap the heart on any track to save it here."
          actionLabel="Browse library"
          onAction={() => usePlayerStore.getState().setActiveNav('library')}
        />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-6 mb-8 p-6 rounded-2xl bg-gradient-to-br from-[var(--color-accent-secondary)]/30 to-[var(--color-accent)]/20 glass"
      >
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] flex items-center justify-center shrink-0">
          <Heart className="w-16 h-16 text-white fill-white" />
        </div>
        <div className="flex flex-col justify-end">
          <p className="text-sm uppercase tracking-wider mb-2">Playlist</p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-2">Liked Songs</h1>
          <p className="text-[var(--color-text-muted)] mb-4">
            {likedSongs.length} songs · {formatTime(totalDuration)}
          </p>
          <Button variant="primary" onClick={() => playQueue(likedSongs, 0)}>
            <Play className="w-4 h-4 fill-current" />
            Play all
          </Button>
        </div>
      </motion.div>

      <SectionHeader title="All liked tracks" />
      <div className="space-y-1">
        {likedSongs.map((song, i) => (
          <SongRow
            key={song.id}
            song={song}
            index={i}
            playlist={likedSongs}
          />
        ))}
      </div>
    </div>
  )
}
