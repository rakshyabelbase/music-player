import type { Album, Artist, Playlist, Song } from '../types'

const cover = (seed: string) =>
  `https://picsum.photos/seed/${seed}/400/400`

const audio = (n: number) =>
  `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`

const makeLyrics = (title: string) => [
  { time: 0, text: `[Instrumental intro — ${title}]` },
  { time: 15, text: 'Lost in the rhythm of the night' },
  { time: 32, text: 'Every beat pulls me closer to the light' },
  { time: 48, text: 'We dance until the morning breaks' },
  { time: 64, text: 'Hearts in sync, no words it takes' },
  { time: 80, text: 'Feel the bass beneath our feet' },
  { time: 96, text: 'This moment pure, this moment sweet' },
  { time: 112, text: 'Lost in the rhythm of the night' },
  { time: 128, text: 'Every beat pulls me closer to the light' },
  { time: 144, text: 'We rise together, never fall' },
  { time: 160, text: 'Music is the answer after all' },
  { time: 176, text: '[Outro]' },
]

export const artists: Artist[] = [
  {
    id: 'a1',
    name: 'Luna Vale',
    imageUrl: cover('1493225457124-a192eb9fad00'),
    followers: '2.4M',
    genre: 'Electronic',
  },
  {
    id: 'a2',
    name: 'Neon Drift',
    imageUrl: cover('1514525253161-7a46d19cd819'),
    followers: '1.8M',
    genre: 'Synthwave',
  },
  {
    id: 'a3',
    name: 'Echo Rivers',
    imageUrl: cover('1470225620784-dab8f9b6fbbd'),
    followers: '3.1M',
    genre: 'Indie Pop',
  },
  {
    id: 'a4',
    name: 'Midnight Pulse',
    imageUrl: cover('1459742919034-6b0c0e0a671c'),
    followers: '980K',
    genre: 'House',
  },
]

export const songs: Song[] = [
  {
    id: 's1',
    title: 'Velvet Horizon',
    artistId: 'a1',
    artistName: 'Luna Vale',
    albumId: 'al1',
    albumTitle: 'Nocturnal Waves',
    coverUrl: cover('1493225457124-a192eb9fad00'),
    duration: 348,
    audioUrl: audio(1),
    lyrics: makeLyrics('Velvet Horizon'),
    genre: 'Electronic',
    plays: 12400000,
  },
  {
    id: 's2',
    title: 'Crystal Echo',
    artistId: 'a1',
    artistName: 'Luna Vale',
    albumId: 'al1',
    albumTitle: 'Nocturnal Waves',
    coverUrl: cover('1511379938547-a1a4a0a0a0a0'),
    duration: 312,
    audioUrl: audio(2),
    lyrics: makeLyrics('Crystal Echo'),
    genre: 'Electronic',
    plays: 8900000,
  },
  {
    id: 's3',
    title: 'Neon Dreams',
    artistId: 'a2',
    artistName: 'Neon Drift',
    albumId: 'al2',
    albumTitle: 'Retro Future',
    coverUrl: cover('1514525253161-7a46d19cd819'),
    duration: 285,
    audioUrl: audio(3),
    lyrics: makeLyrics('Neon Dreams'),
    genre: 'Synthwave',
    plays: 15200000,
  },
  {
    id: 's4',
    title: 'Midnight Drive',
    artistId: 'a2',
    artistName: 'Neon Drift',
    albumId: 'al2',
    albumTitle: 'Retro Future',
    coverUrl: cover('1508700110929-7a0a0a0a0a0a'),
    duration: 264,
    audioUrl: audio(4),
    lyrics: makeLyrics('Midnight Drive'),
    genre: 'Synthwave',
    plays: 6700000,
  },
  {
    id: 's5',
    title: 'Golden Hour',
    artistId: 'a3',
    artistName: 'Echo Rivers',
    albumId: 'al3',
    albumTitle: 'Sunset Stories',
    coverUrl: cover('1470225620784-dab8f9b6fbbd'),
    duration: 298,
    audioUrl: audio(5),
    lyrics: makeLyrics('Golden Hour'),
    genre: 'Indie Pop',
    plays: 22100000,
  },
  {
    id: 's6',
    title: 'River Flow',
    artistId: 'a3',
    artistName: 'Echo Rivers',
    albumId: 'al3',
    albumTitle: 'Sunset Stories',
    coverUrl: cover('1516280440614-379a0a0a0a0a'),
    duration: 276,
    audioUrl: audio(6),
    lyrics: makeLyrics('River Flow'),
    genre: 'Indie Pop',
    plays: 9800000,
  },
  {
    id: 's7',
    title: 'Pulse Wave',
    artistId: 'a4',
    artistName: 'Midnight Pulse',
    albumId: 'al4',
    albumTitle: 'Deep Frequency',
    coverUrl: cover('1459742919034-6b0c0e0a671c'),
    duration: 320,
    audioUrl: audio(7),
    lyrics: makeLyrics('Pulse Wave'),
    genre: 'House',
    plays: 18500000,
  },
  {
    id: 's8',
    title: 'Bass Cathedral',
    artistId: 'a4',
    artistName: 'Midnight Pulse',
    albumId: 'al4',
    albumTitle: 'Deep Frequency',
    coverUrl: cover('1524368536-c0a0a0a0a0a0'),
    duration: 305,
    audioUrl: audio(8),
    lyrics: makeLyrics('Bass Cathedral'),
    genre: 'House',
    plays: 11200000,
  },
  {
    id: 's9',
    title: 'Aurora Borealis',
    artistId: 'a1',
    artistName: 'Luna Vale',
    albumId: 'al5',
    albumTitle: 'Northern Lights EP',
    coverUrl: cover('1511671781774-0a0a0a0a0a0a'),
    duration: 290,
    audioUrl: audio(9),
    lyrics: makeLyrics('Aurora Borealis'),
    genre: 'Ambient',
    plays: 7600000,
  },
  {
    id: 's10',
    title: 'Starlight Serenade',
    artistId: 'a3',
    artistName: 'Echo Rivers',
    albumId: 'al5',
    albumTitle: 'Northern Lights EP',
    coverUrl: cover('1514320291840-0a0a0a0a0a0a'),
    duration: 268,
    audioUrl: audio(10),
    lyrics: makeLyrics('Starlight Serenade'),
    genre: 'Indie Pop',
    plays: 14300000,
  },
]

export const albums: Album[] = [
  {
    id: 'al1',
    title: 'Nocturnal Waves',
    artistId: 'a1',
    artistName: 'Luna Vale',
    coverUrl: cover('1493225457124-a192eb9fad00'),
    year: 2024,
    trackIds: ['s1', 's2'],
  },
  {
    id: 'al2',
    title: 'Retro Future',
    artistId: 'a2',
    artistName: 'Neon Drift',
    coverUrl: cover('1514525253161-7a46d19cd819'),
    year: 2023,
    trackIds: ['s3', 's4'],
  },
  {
    id: 'al3',
    title: 'Sunset Stories',
    artistId: 'a3',
    artistName: 'Echo Rivers',
    coverUrl: cover('1470225620784-dab8f9b6fbbd'),
    year: 2024,
    trackIds: ['s5', 's6'],
  },
  {
    id: 'al4',
    title: 'Deep Frequency',
    artistId: 'a4',
    artistName: 'Midnight Pulse',
    coverUrl: cover('1459742919034-6b0c0e0a671c'),
    year: 2023,
    trackIds: ['s7', 's8'],
  },
  {
    id: 'al5',
    title: 'Northern Lights EP',
    artistId: 'a1',
    artistName: 'Luna Vale',
    coverUrl: cover('1511671781774-0a0a0a0a0a0a'),
    year: 2025,
    trackIds: ['s9', 's10'],
  },
]

export const playlists: Playlist[] = [
  {
    id: 'p1',
    title: 'Late Night Vibes',
    description: 'Chill electronic for after midnight',
    coverUrl: cover('1514525253161-7a46d19cd819'),
    songIds: ['s1', 's3', 's7', 's9'],
    createdBy: 'Aura',
  },
  {
    id: 'p2',
    title: 'Focus Flow',
    description: 'Deep concentration beats',
    coverUrl: cover('1493225457124-a192eb9fad00'),
    songIds: ['s2', 's5', 's6', 's10'],
    createdBy: 'Aura',
  },
  {
    id: 'p3',
    title: 'Workout Energy',
    description: 'High tempo motivation',
    coverUrl: cover('1459742919034-6b0c0e0a671c'),
    songIds: ['s4', 's7', 's8', 's3'],
    createdBy: 'Aura',
  },
  {
    id: 'p4',
    title: 'Indie Discoveries',
    description: 'Fresh indie picks',
    coverUrl: cover('1470225620784-dab8f9b6fbbd'),
    songIds: ['s5', 's6', 's10'],
    createdBy: 'Aura',
  },
]

export const trendingSongs = songs
  .slice()
  .sort((a, b) => (b.plays ?? 0) - (a.plays ?? 0))
  .slice(0, 6)

export const recentlyPlayedSeed = ['s5', 's1', 's7', 's3', 's10']

export function getSongById(id: string): Song | undefined {
  return songs.find((s) => s.id === id)
}

export function getSongsByIds(ids: string[]): Song[] {
  return ids.map((id) => getSongById(id)).filter((s): s is Song => !!s)
}

export function getAlbumById(id: string): Album | undefined {
  return albums.find((a) => a.id === id)
}

export function getPlaylistById(id: string): Playlist | undefined {
  return playlists.find((p) => p.id === id)
}

export function searchSongs(query: string): Song[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return songs.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.artistName.toLowerCase().includes(q) ||
      s.albumTitle.toLowerCase().includes(q) ||
      (s.genre?.toLowerCase().includes(q) ?? false),
  )
}
