export type RepeatMode = 'off' | 'all' | 'one'

export type SearchFilter = 'all' | 'recent' | 'liked' | 'trending'

export interface EqualizerBands {
  bass: number
  mid: number
  treble: number
}

export const DEFAULT_EQUALIZER: EqualizerBands = { bass: 0, mid: 0, treble: 0 }

export const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number]

export interface Artist {
  id: string
  name: string
  imageUrl: string
  followers?: string
  genre?: string
}

export interface Album {
  id: string
  title: string
  artistId: string
  artistName: string
  coverUrl: string
  year: number
  trackIds: string[]
}

export interface LyricLine {
  time: number
  text: string
}

export interface Song {
  id: string
  title: string
  artistId: string
  artistName: string
  albumId: string
  albumTitle: string
  coverUrl: string
  duration: number
  audioUrl: string
  lyrics?: LyricLine[]
  genre?: string
  plays?: number
  testPurpose?: string
}

export interface Playlist {
  id: string
  title: string
  description: string
  coverUrl: string
  songIds: string[]
  createdBy?: string
  isLiked?: boolean
}

export interface AudioTestPlanItem {
  area: string
  trackIds: string[]
  checks: string[]
}

export type NavItem = 'home' | 'search' | 'library' | 'playlists' | 'liked'

export interface PlayerError {
  message: string
  code?: string
}
