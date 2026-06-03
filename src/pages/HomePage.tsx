import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, TrendingUp, Disc3 } from 'lucide-react'
import { SectionHeader } from '../components/layout/SectionHeader'
import { SongCard } from '../components/music/SongCard'
import { AlbumCard } from '../components/music/AlbumCard'
import { ArtistCard } from '../components/music/ArtistCard'
import { PlaylistCard } from '../components/music/PlaylistCard'
import { GridSkeleton } from '../components/ui/Skeleton'
import {
  trendingSongs,
  albums,
  artists,
  playlists,
  getSongsByIds,
} from '../data/mockMusic'
import { usePlayerStore } from '../store/playerStore'
export function HomePage() {
  const [loading, setLoading] = useState(true)
  const recentlyPlayedIds = usePlayerStore((s) => s.recentlyPlayedIds)
  const currentSong = usePlayerStore((s) => s.currentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const playSong = usePlayerStore((s) => s.playSong)

  const recentSongs = getSongsByIds(recentlyPlayedIds).slice(0, 5)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="h-32 rounded-2xl bg-white/5 animate-pulse" />
        <GridSkeleton count={5} />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 pb-8 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8 glass"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/20 via-transparent to-[var(--color-accent-secondary)]/20" />
        <div className="relative">
          <p className="text-sm text-[var(--color-text-muted)] mb-1">{greeting()}</p>
          <h1 className="text-2xl sm:text-4xl font-bold mb-4">
            Ready to vibe?
          </h1>
          {currentSong ? (
            <div className="flex items-center gap-4">
              <img
                src={currentSong.coverUrl}
                alt=""
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {isPlaying ? 'Now playing' : 'Paused'} — {currentSong.title}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {currentSong.artistName}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => usePlayerStore.getState().setFullPlayerOpen(true)}
                className="px-4 py-2 rounded-full bg-[var(--color-accent)] text-black text-sm font-semibold"
              >
                Open Player
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => recentSongs[0] && playSong(recentSongs[0])}
              className="px-6 py-2.5 rounded-full bg-[var(--color-accent)] text-black font-semibold text-sm"
            >
              Play something
            </motion.button>
          )}
        </div>
      </motion.div>

      <section>
        <SectionHeader
          title="Recently Played"
          subtitle="Pick up where you left off"
          action={<Clock className="w-5 h-5 text-[var(--color-text-muted)]" />}
        />
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
          {recentSongs.map((song, i) => (
            <div key={song.id} className="min-w-[140px] sm:min-w-[160px]">
              <SongCard song={song} playlist={recentSongs} index={i} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Trending Now"
          subtitle="Hot tracks this week"
          action={<TrendingUp className="w-5 h-5 text-[var(--color-accent)]" />}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {trendingSongs.map((song, i) => (
            <SongCard key={song.id} song={song} index={i} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Featured Playlists" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((p, i) => (
            <PlaylistCard key={p.id} playlist={p} index={i} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Popular Albums"
          action={<Disc3 className="w-5 h-5 text-[var(--color-text-muted)]" />}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {albums.map((album, i) => (
            <AlbumCard key={album.id} album={album} index={i} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Top Artists" subtitle="Creators you love" />
        <div className="flex gap-4 overflow-x-auto pb-2">
          {artists.map((artist, i) => (
            <ArtistCard key={artist.id} artist={artist} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
