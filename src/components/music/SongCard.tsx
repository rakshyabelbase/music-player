import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import type { Song } from '../../types'
import { usePlayerStore } from '../../store/playerStore'
import { cn } from '../../utils/cn'
import { Equalizer } from './Equalizer'

interface SongCardProps {
  song: Song
  playlist?: Song[]
  index?: number
  variant?: 'grid' | 'compact'
}

export function SongCard({ song, playlist, index = 0, variant = 'grid' }: SongCardProps) {
  const playSong = usePlayerStore((s) => s.playSong)
  const currentSong = usePlayerStore((s) => s.currentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const isActive = currentSong?.id === song.id
  const isCurrentPlaying = isActive && isPlaying

  if (variant === 'compact') {
    return (
      <motion.button
        type="button"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ x: 4 }}
        onClick={() => playSong(song, playlist)}
        className={cn(
          'flex items-center gap-3 w-full p-2 rounded-xl text-left transition-colors',
          isActive ? 'bg-[var(--color-accent)]/10 ring-1 ring-[var(--color-accent)]/30' : 'hover:bg-white/5',
        )}
      >
        <img
          src={song.coverUrl}
          alt=""
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium truncate', isActive && 'text-[var(--color-accent)]')}>
            {song.title}
          </p>
          <p className="text-sm text-[var(--color-text-muted)] truncate">{song.artistName}</p>
        </div>
        {isCurrentPlaying && <Equalizer isPlaying />}
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <button
        type="button"
        onClick={() => playSong(song, playlist)}
        className={cn(
          'w-full p-3 rounded-2xl text-left transition-all duration-300',
          isActive
            ? 'glass ring-1 ring-[var(--color-accent)]/40 glow-accent'
            : 'hover:glass',
        )}
      >
        <div className="relative aspect-square mb-3 overflow-hidden rounded-xl">
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <motion.div
            initial={false}
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-[var(--color-accent)] flex items-center justify-center shadow-lg"
            >
              <Play className="w-5 h-5 text-black fill-black ml-0.5" />
            </motion.div>
          </motion.div>
          {isCurrentPlaying && (
            <div className="absolute bottom-2 right-2 glass px-2 py-1 rounded-full">
              <Equalizer isPlaying />
            </div>
          )}
        </div>
        <p className={cn('font-semibold truncate text-sm', isActive && 'text-[var(--color-accent)]')}>
          {song.title}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
          {song.artistName}
        </p>
      </button>
    </motion.div>
  )
}
