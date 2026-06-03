import type { SearchFilter, Song } from '../types'
import { songs, trendingSongs } from '../data/mockMusic'

export function searchSongs(
  query: string,
  filter: SearchFilter,
  likedIds: string[],
  recentIds: string[],
): Song[] {
  const q = query.toLowerCase().trim()

  let pool: Song[] = songs
  if (filter === 'liked') {
    pool = songs.filter((s) => likedIds.includes(s.id))
  } else if (filter === 'recent') {
    pool = recentIds
      .map((id) => songs.find((s) => s.id === id))
      .filter((s): s is Song => !!s)
  } else if (filter === 'trending') {
    pool = trendingSongs
  }

  if (!q) return filter === 'all' ? [] : pool

  return pool.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.artistName.toLowerCase().includes(q) ||
      s.albumTitle.toLowerCase().includes(q) ||
      (s.genre?.toLowerCase().includes(q) ?? false),
  )
}
