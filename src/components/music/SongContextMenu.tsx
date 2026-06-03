import { useState, useRef, useEffect, memo } from 'react'
import { ListPlus, Heart, ListMusic, MoreHorizontal } from 'lucide-react'
import type { Song } from '../../types'
import { usePlayerStore } from '../../store/playerStore'
import { usePlaylistStore } from '../../store/playlistStore'
import { cn } from '../../utils/cn'

interface SongContextMenuProps {
  song: Song
  className?: string
}

export const SongContextMenu = memo(function SongContextMenu({
  song,
  className,
}: SongContextMenuProps) {
  const [open, setOpen] = useState(false)
  const [showPlaylists, setShowPlaylists] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const addToQueue = usePlayerStore((s) => s.addToQueue)
  const toggleLike = usePlayerStore((s) => s.toggleLike)
  const isLiked = usePlayerStore((s) => s.isLiked)
  const userPlaylists = usePlaylistStore((s) => s.userPlaylists)
  const addSongToPlaylist = usePlaylistStore((s) => s.addSongToPlaylist)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setShowPlaylists(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className="p-2 rounded-full hover:bg-white/10 hidden sm:block"
        aria-label="More options"
        aria-expanded={open}
      >
        <MoreHorizontal className="w-4 h-4 text-[var(--color-text-muted)]" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[180px] py-1 rounded-xl glass-strong border border-white/10 shadow-xl">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 text-left"
            onClick={() => {
              addToQueue(song)
              setOpen(false)
            }}
          >
            <ListPlus className="w-4 h-4" />
            Add to queue
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 text-left"
            onClick={() => {
              toggleLike(song.id)
              setOpen(false)
            }}
          >
            <Heart
              className={cn(
                'w-4 h-4',
                isLiked(song.id) && 'fill-[var(--color-accent)] text-[var(--color-accent)]',
              )}
            />
            {isLiked(song.id) ? 'Unlike' : 'Like'}
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 text-left"
            onClick={() => setShowPlaylists((v) => !v)}
          >
            <ListMusic className="w-4 h-4" />
            Add to playlist
          </button>
          {showPlaylists && (
            <div className="border-t border-white/10 max-h-40 overflow-y-auto">
              {userPlaylists.length === 0 ? (
                <p className="px-4 py-2 text-xs text-[var(--color-text-muted)]">
                  Create a playlist first
                </p>
              ) : (
                userPlaylists.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="w-full px-4 py-2 text-sm text-left hover:bg-white/10 truncate"
                    onClick={() => {
                      addSongToPlaylist(p.id, song.id)
                      setOpen(false)
                      setShowPlaylists(false)
                    }}
                  >
                    {p.title}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
})
