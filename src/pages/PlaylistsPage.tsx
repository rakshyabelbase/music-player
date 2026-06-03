import { motion } from 'framer-motion'
import { Play, ArrowLeft } from 'lucide-react'
import { SectionHeader } from '../components/layout/SectionHeader'
import { PlaylistCard } from '../components/music/PlaylistCard'
import { SongRow } from '../components/music/SongRow'
import { Button } from '../components/ui/Button'
import { playlists, getPlaylistById, getSongsByIds } from '../data/mockMusic'
import { usePlayerStore } from '../store/playerStore'
import { formatTime } from '../utils/formatTime'

export function PlaylistsPage() {
  const selectedPlaylistId = usePlayerStore((s) => s.selectedPlaylistId)
  const setSelectedPlaylistId = usePlayerStore((s) => s.setSelectedPlaylistId)
  const playQueue = usePlayerStore((s) => s.playQueue)

  const playlist = selectedPlaylistId
    ? getPlaylistById(selectedPlaylistId)
    : null
  const tracks = playlist ? getSongsByIds(playlist.songIds) : []
  const totalDuration = tracks.reduce((acc, s) => acc + s.duration, 0)

  if (playlist) {
    return (
      <div className="p-4 sm:p-6 pb-8">
        <button
          type="button"
          onClick={() => setSelectedPlaylistId(null)}
          className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to playlists
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-6 mb-8"
        >
          <img
            src={playlist.coverUrl}
            alt={playlist.title}
            className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-cover shadow-2xl glow-accent shrink-0"
          />
          <div className="flex flex-col justify-end">
            <p className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              Playlist
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold mb-2">{playlist.title}</h1>
            <p className="text-[var(--color-text-muted)] mb-4">{playlist.description}</p>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              {playlist.createdBy} · {tracks.length} songs · {formatTime(totalDuration)}
            </p>
            <Button
              variant="primary"
              onClick={() => tracks.length && playQueue(tracks, 0)}
            >
              <Play className="w-4 h-4 fill-current" />
              Play all
            </Button>
          </div>
        </motion.div>

        <div className="space-y-1">
          {tracks.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              index={i}
              playlist={tracks}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 pb-8">
      <SectionHeader
        title="Playlists"
        subtitle="Curated collections for every mood"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {playlists.map((p, i) => (
          <PlaylistCard key={p.id} playlist={p} index={i} />
        ))}
      </div>
    </div>
  )
}
