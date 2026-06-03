import { motion } from 'framer-motion'
import type { Album } from '../../types'
import { getSongsByIds } from '../../data/mockMusic'
import { usePlayerStore } from '../../store/playerStore'

interface AlbumCardProps {
  album: Album
  index?: number
}

export function AlbumCard({ album, index = 0 }: AlbumCardProps) {
  const playSong = usePlayerStore((s) => s.playSong)

  const handlePlay = () => {
    const tracks = getSongsByIds(album.trackIds)
    if (tracks[0]) playSong(tracks[0], tracks)
  }

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      onClick={handlePlay}
      className="group w-full p-3 rounded-2xl text-left hover:glass transition-all"
    >
      <div className="relative aspect-square mb-3 overflow-hidden rounded-xl">
        <img
          src={album.coverUrl}
          alt={album.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <p className="font-semibold truncate text-sm">{album.title}</p>
      <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
        {album.artistName} · {album.year}
      </p>
    </motion.button>
  )
}
