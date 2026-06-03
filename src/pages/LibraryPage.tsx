import { useState, useEffect } from 'react'
import { Music2 } from 'lucide-react'
import { SectionHeader } from '../components/layout/SectionHeader'
import { SongRow } from '../components/music/SongRow'
import { AlbumCard } from '../components/music/AlbumCard'
import { SongRowSkeleton } from '../components/ui/Skeleton'
import { songs, albums } from '../data/mockMusic'

export function LibraryPage() {
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'songs' | 'albums'>('songs')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="p-4 sm:p-6 pb-8">
      <SectionHeader
        title="Your Library"
        subtitle={`${songs.length} songs · ${albums.length} albums`}
        action={<Music2 className="w-5 h-5 text-[var(--color-text-muted)]" />}
      />

      <div className="flex gap-2 mb-6">
        {(['songs', 'albums'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              tab === t
                ? 'bg-white text-black'
                : 'glass text-[var(--color-text-muted)] hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SongRowSkeleton key={i} />
          ))}
        </div>
      ) : tab === 'songs' ? (
        <div className="space-y-1">
          {songs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} playlist={songs} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {albums.map((album, i) => (
            <AlbumCard key={album.id} album={album} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
