import { motion } from 'framer-motion'
import type { Artist } from '../../types'

interface ArtistCardProps {
  artist: Artist
  index?: number
  onClick?: () => void
}

export function ArtistCard({ artist, index = 0, onClick }: ArtistCardProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:glass transition-all min-w-[120px]"
    >
      <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-[var(--color-accent)]/50">
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center">
        <p className="font-semibold text-sm">{artist.name}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{artist.genre}</p>
      </div>
    </motion.button>
  )
}
