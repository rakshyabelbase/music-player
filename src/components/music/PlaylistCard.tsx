import { motion } from 'framer-motion'
import { ListMusic } from 'lucide-react'
import type { Playlist } from '../../types'
import { usePlayerStore } from '../../store/playerStore'

interface PlaylistCardProps {
  playlist: Playlist
  index?: number
}

export function PlaylistCard({ playlist, index = 0 }: PlaylistCardProps) {
  const setSelectedPlaylistId = usePlayerStore((s) => s.setSelectedPlaylistId)
  const setActiveNav = usePlayerStore((s) => s.setActiveNav)

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      onClick={() => {
        setSelectedPlaylistId(playlist.id)
        setActiveNav('playlists')
      }}
      className="group w-full p-3 rounded-2xl text-left hover:glass transition-all"
    >
      <div className="relative aspect-square mb-3 overflow-hidden rounded-xl bg-gradient-to-br from-[var(--color-accent-secondary)]/40 to-[var(--color-accent)]/20">
        <img
          src={playlist.coverUrl}
          alt={playlist.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute bottom-2 right-2 glass p-1.5 rounded-full">
          <ListMusic className="w-4 h-4" />
        </div>
      </div>
      <p className="font-semibold truncate text-sm">{playlist.title}</p>
      <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
        {playlist.songIds.length} songs
      </p>
    </motion.button>
  )
}
