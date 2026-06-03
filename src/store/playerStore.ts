import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NavItem, PlayerError, RepeatMode, Song } from '../types'
import { recentlyPlayedSeed, songs } from '../data/mockMusic'
import { shuffleArray } from '../utils/shuffle'

interface PlayerState {
  currentSong: Song | null
  queue: Song[]
  queueIndex: number
  sourcePlaylist: Song[]
  isPlaying: boolean
  volume: number
  repeatMode: RepeatMode
  shuffle: boolean
  likedSongIds: string[]
  recentlyPlayedIds: string[]
  currentTime: number
  duration: number
  isLoading: boolean
  error: PlayerError | null
  showQueue: boolean
  showLyrics: boolean
  fullPlayerOpen: boolean
  hasEnteredApp: boolean
  activeNav: NavItem
  searchQuery: string
  selectedPlaylistId: string | null

  setActiveNav: (nav: NavItem) => void
  setSearchQuery: (q: string) => void
  setSelectedPlaylistId: (id: string | null) => void
  enterApp: () => void
  setFullPlayerOpen: (open: boolean) => void
  setShowQueue: (show: boolean) => void
  setShowLyrics: (show: boolean) => void
  setVolume: (v: number) => void
  setRepeatMode: (mode: RepeatMode) => void
  toggleShuffle: () => void
  toggleLike: (songId: string) => void
  isLiked: (songId: string) => boolean
  setCurrentTime: (t: number) => void
  setDuration: (d: number) => void
  setIsPlaying: (playing: boolean) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: PlayerError | null) => void
  playSong: (song: Song, playlist?: Song[]) => void
  playQueue: (queue: Song[], startIndex?: number) => void
  togglePlay: () => void
  next: () => void
  previous: () => void
  addToQueue: (song: Song) => void
  removeFromQueue: (index: number) => void
  reorderQueue: (from: number, to: number) => void
  clearError: () => void
}

function buildQueue(
  song: Song,
  playlist: Song[],
  shuffle: boolean,
): { queue: Song[]; index: number } {
  const idx = playlist.findIndex((s) => s.id === song.id)
  const base = idx >= 0 ? playlist : [song, ...playlist.filter((s) => s.id !== song.id)]
  const startIdx = idx >= 0 ? idx : 0
  if (!shuffle) return { queue: base, index: startIdx }
  const shuffled = shuffleArray(base)
  const newIdx = shuffled.findIndex((s) => s.id === song.id)
  return { queue: shuffled, index: newIdx >= 0 ? newIdx : 0 }
}

function addRecent(ids: string[], songId: string): string[] {
  return [songId, ...ids.filter((id) => id !== songId)].slice(0, 20)
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentSong: null,
      queue: [],
      queueIndex: 0,
      sourcePlaylist: songs,
      isPlaying: false,
      volume: 0.75,
      repeatMode: 'off',
      shuffle: false,
      likedSongIds: ['s5', 's1', 's10'],
      recentlyPlayedIds: recentlyPlayedSeed,
      currentTime: 0,
      duration: 0,
      isLoading: false,
      error: null,
      showQueue: false,
      showLyrics: false,
      fullPlayerOpen: false,
      hasEnteredApp: false,
      activeNav: 'home',
      searchQuery: '',
      selectedPlaylistId: null,

      setActiveNav: (nav) => set({ activeNav: nav, fullPlayerOpen: false }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setSelectedPlaylistId: (id) => set({ selectedPlaylistId: id }),
      enterApp: () => set({ hasEnteredApp: true }),
      setFullPlayerOpen: (open) => set({ fullPlayerOpen: open }),
      setShowQueue: (show) => set({ showQueue: show }),
      setShowLyrics: (show) => set({ showLyrics: show }),
      setVolume: (v) => set({ volume: Math.max(0, Math.min(1, v)) }),
      setRepeatMode: (mode) => set({ repeatMode: mode }),
      toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
      toggleLike: (songId) =>
        set((s) => ({
          likedSongIds: s.likedSongIds.includes(songId)
            ? s.likedSongIds.filter((id) => id !== songId)
            : [...s.likedSongIds, songId],
        })),
      isLiked: (songId) => get().likedSongIds.includes(songId),
      setCurrentTime: (t) => set({ currentTime: t }),
      setDuration: (d) => set({ duration: d }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error, isLoading: false }),
      clearError: () => set({ error: null }),

      playSong: (song, playlist = get().sourcePlaylist) => {
        const { shuffle } = get()
        const { queue, index } = buildQueue(song, playlist, shuffle)
        set({
          currentSong: song,
          queue,
          queueIndex: index,
          sourcePlaylist: playlist,
          isPlaying: true,
          isLoading: true,
          error: null,
          currentTime: 0,
          recentlyPlayedIds: addRecent(get().recentlyPlayedIds, song.id),
        })
      },

      playQueue: (queue, startIndex = 0) => {
        const song = queue[startIndex]
        if (!song) return
        set({
          currentSong: song,
          queue,
          queueIndex: startIndex,
          sourcePlaylist: queue,
          isPlaying: true,
          isLoading: true,
          error: null,
          currentTime: 0,
          recentlyPlayedIds: addRecent(get().recentlyPlayedIds, song.id),
        })
      },

      togglePlay: () => {
        const { currentSong, isPlaying } = get()
        if (!currentSong) {
          const first = songs[0]
          if (first) get().playSong(first)
          return
        }
        set({ isPlaying: !isPlaying })
      },

      next: () => {
        const { queue, queueIndex, repeatMode, currentSong } = get()
        if (!currentSong || queue.length === 0) return

        if (repeatMode === 'one') {
          set({ currentTime: 0, isLoading: true })
          return
        }

        let nextIndex = queueIndex + 1
        if (nextIndex >= queue.length) {
          if (repeatMode === 'all') nextIndex = 0
          else {
            set({ isPlaying: false })
            return
          }
        }

        const nextSong = queue[nextIndex]
        if (!nextSong) return
        set({
          currentSong: nextSong,
          queueIndex: nextIndex,
          isPlaying: true,
          isLoading: true,
          currentTime: 0,
          recentlyPlayedIds: addRecent(get().recentlyPlayedIds, nextSong.id),
        })
      },

      previous: () => {
        const { queue, queueIndex, currentTime, currentSong } = get()
        if (!currentSong) return

        if (currentTime > 3) {
          set({ currentTime: 0 })
          return
        }

        let prevIndex = queueIndex - 1
        if (prevIndex < 0) prevIndex = queue.length - 1

        const prevSong = queue[prevIndex]
        if (!prevSong) return
        set({
          currentSong: prevSong,
          queueIndex: prevIndex,
          isPlaying: true,
          isLoading: true,
          currentTime: 0,
          recentlyPlayedIds: addRecent(get().recentlyPlayedIds, prevSong.id),
        })
      },

      addToQueue: (song) =>
        set((s) => ({
          queue: [...s.queue, song],
        })),

      removeFromQueue: (index) =>
        set((s) => {
          const queue = s.queue.filter((_, i) => i !== index)
          let queueIndex = s.queueIndex
          if (index < queueIndex) queueIndex--
          if (index === queueIndex && queueIndex >= queue.length) {
            queueIndex = Math.max(0, queue.length - 1)
          }
          return { queue, queueIndex }
        }),

      reorderQueue: (from, to) =>
        set((s) => {
          const queue = [...s.queue]
          const [item] = queue.splice(from, 1)
          queue.splice(to, 0, item)
          let queueIndex = s.queueIndex
          if (from === queueIndex) queueIndex = to
          else if (from < queueIndex && to >= queueIndex) queueIndex--
          else if (from > queueIndex && to <= queueIndex) queueIndex++
          return { queue, queueIndex }
        }),
    }),
    {
      name: 'aura-player',
      partialize: (s) => ({
        volume: s.volume,
        likedSongIds: s.likedSongIds,
        recentlyPlayedIds: s.recentlyPlayedIds,
        shuffle: s.shuffle,
        repeatMode: s.repeatMode,
      }),
    },
  ),
)
