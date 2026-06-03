export type RepeatMode = 'off' | 'all' | 'one'

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

export type NavItem = 'home' | 'search' | 'library' | 'playlists' | 'liked'

export interface PlayerError {
  message: string
  code?: string
}
