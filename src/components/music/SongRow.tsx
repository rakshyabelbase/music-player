import { motion } from 'framer-motion'
import { Heart, MoreHorizontal, Play } from 'lucide-react'
import type { Song } from '../../types'
import { usePlayerStore } from '../../store/playerStore'
import { formatTime } from '../../utils/formatTime'
import { cn } from '../../utils/cn'
import { Equalizer } from './Equalizer'

interface SongRowProps {
  song: Song
  index: number
  playlist?: Song[]
  showIndex?: boolean
}

export function SongRow({ song, index, playlist, showIndex = true }: SongRowProps) {
  const playSong = usePlayerStore((s) => s.playSong)
  const currentSong = usePlayerStore((s) => s.currentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const isLiked = usePlayerStore((s) => s.isLiked)
  const toggleLike = usePlayerStore((s) => s.toggleLike)
  const duration = usePlayerStore((s) => s.duration)
  const currentTime = usePlayerStore((s) => s.currentTime)

  const isActive = currentSong?.id === song.id
  const isCurrentPlaying = isActive && isPlaying
  const displayDuration =
    isActive && duration > 0 ? formatTime(duration) : formatTime(song.duration)

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className={cn(
        'group grid grid-cols-[auto_1fr_auto_auto] sm:grid-cols-[40px_48px_1fr_120px_80px_auto] items-center gap-3 sm:gap-4 px-3 py-2 rounded-xl transition-colors',
        isActive
          ? 'bg-[var(--color-accent)]/10 ring-1 ring-[var(--color-accent)]/25'
          : 'hover:bg-white/5',
      )}
    >
      <div className="hidden sm:flex items-center justify-center w-10 text-sm text-[var(--color-text-muted)]">
        {isCurrentPlaying ? (
          <Equalizer isPlaying />
        ) : showIndex ? (
          <span className="group-hover:hidden">{index + 1}</span>
        ) : null}
        {!isCurrentPlaying && showIndex && (
          <button
            type="button"
            onClick={() => playSong(song, playlist)}
            className="hidden group-hover:flex items-center justify-center text-white"
          >
            <Play className="w-4 h-4 fill-current" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => playSong(song, playlist)}
        className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0"
      >
        <img src={song.coverUrl} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center sm:hidden transition-opacity">
          <Play className="w-4 h-4 fill-white" />
        </div>
      </button>

      <button
        type="button"
        onClick={() => playSong(song, playlist)}
        className="min-w-0 text-left"
      >
        <p className={cn('font-medium truncate', isActive && 'text-[var(--color-accent)]')}>
          {song.title}
        </p>
        <p className="text-sm text-[var(--color-text-muted)] truncate">{song.artistName}</p>
      </button>

      <p className="hidden sm:block text-sm text-[var(--color-text-muted)] truncate">
        {song.albumTitle}
      </p>

      <p className="text-sm text-[var(--color-text-muted)] tabular-nums">
        {isActive && isPlaying ? formatTime(currentTime) : displayDuration}
      </p>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleLike(song.id)
          }}
          className="p-2 rounded-full hover:bg-white/10"
          aria-label={isLiked(song.id) ? 'Unlike' : 'Like'}
        >
          <Heart
            className={cn(
              'w-4 h-4',
              isLiked(song.id) ? 'fill-[var(--color-accent)] text-[var(--color-accent)]' : '',
            )}
          />
        </button>
        <button
          type="button"
          className="p-2 rounded-full hover:bg-white/10 hidden sm:block"
          aria-label="More options"
        >
          <MoreHorizontal className="w-4 h-4 text-[var(--color-text-muted)]" />
        </button>
      </div>
    </motion.div>
  )
}
