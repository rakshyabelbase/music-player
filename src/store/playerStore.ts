import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type {
  EqualizerBands,
  NavItem,
  PlaybackSpeed,
  PlayerError,
  RepeatMode,
  SearchFilter,
  Song,
} from '../types'
import { DEFAULT_EQUALIZER } from '../types'
import { recentlyPlayedSeed, songs } from '../data/mockMusic'
import { shuffleArray } from '../utils/shuffle'

interface PlayerState {
  currentSong: Song | null
  queue: Song[]
  queueIndex: number
  sourcePlaylist: Song[]
  isPlaying: boolean
  volume: number
  isMuted: boolean
  volumeBeforeMute: number
  playbackSpeed: PlaybackSpeed
  repeatMode: RepeatMode
  shuffle: boolean
  likedSongIds: string[]
  recentlyPlayedIds: string[]
  currentTime: number
  duration: number
  isLoading: boolean
  bufferProgress: number
  error: PlayerError | null
  replayNonce: number
  equalizer: EqualizerBands
  showQueue: boolean
  showLyrics: boolean
  fullPlayerOpen: boolean
  miniPlayerVisible: boolean
  hasEnteredApp: boolean
  activeNav: NavItem
  searchQuery: string
  searchFilter: SearchFilter
  selectedPlaylistId: string | null

  setActiveNav: (nav: NavItem) => void
  setSearchQuery: (q: string) => void
  setSearchFilter: (filter: SearchFilter) => void
  setSelectedPlaylistId: (id: string | null) => void
  enterApp: () => void
  setFullPlayerOpen: (open: boolean) => void
  dismissMiniPlayer: () => void
  setShowQueue: (show: boolean) => void
  setShowLyrics: (show: boolean) => void
  setVolume: (v: number) => void
  toggleMute: () => void
  setPlaybackSpeed: (speed: PlaybackSpeed) => void
  cyclePlaybackSpeed: () => void
  setRepeatMode: (mode: RepeatMode) => void
  toggleShuffle: () => void
  toggleLike: (songId: string) => void
  isLiked: (songId: string) => boolean
  setCurrentTime: (t: number) => void
  setDuration: (d: number) => void
  setIsPlaying: (playing: boolean) => void
  setIsLoading: (loading: boolean) => void
  setBufferProgress: (p: number) => void
  setEqualizer: (bands: Partial<EqualizerBands>) => void
  setError: (error: PlayerError | null) => void
  playSong: (song: Song, playlist?: Song[]) => void
  playQueue: (queue: Song[], startIndex?: number) => void
  togglePlay: () => void
  next: () => void
  previous: () => void
  addToQueue: (song: Song) => void
  removeFromQueue: (index: number) => void
  reorderQueue: (from: number, to: number) => void
  clearQueue: () => void
  clearError: () => void
  seekBy: (delta: number) => void
  adjustVolume: (delta: number) => void
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
      isMuted: false,
      volumeBeforeMute: 0.75,
      playbackSpeed: 1,
      repeatMode: 'off',
      shuffle: false,
      likedSongIds: ['s5', 's1', 's10'],
      recentlyPlayedIds: recentlyPlayedSeed,
      currentTime: 0,
      duration: 0,
      isLoading: false,
      bufferProgress: 0,
      error: null,
      replayNonce: 0,
      equalizer: DEFAULT_EQUALIZER,
      showQueue: false,
      showLyrics: false,
      fullPlayerOpen: false,
      miniPlayerVisible: false,
      hasEnteredApp: false,
      activeNav: 'home',
      searchQuery: '',
      searchFilter: 'all',
      selectedPlaylistId: null,

      setActiveNav: (nav) => set({ activeNav: nav, fullPlayerOpen: false }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setSearchFilter: (filter) => set({ searchFilter: filter }),
      setSelectedPlaylistId: (id) => set({ selectedPlaylistId: id }),
      enterApp: () => set({ hasEnteredApp: true }),
      setFullPlayerOpen: (open) => set({ fullPlayerOpen: open }),
      dismissMiniPlayer: () =>
        set({
          isPlaying: false,
          isLoading: false,
          miniPlayerVisible: false,
          fullPlayerOpen: false,
          showQueue: false,
          showLyrics: false,
        }),
      setShowQueue: (show) => set({ showQueue: show }),
      setShowLyrics: (show) => set({ showLyrics: show }),

      setVolume: (v) => {
        const vol = Math.max(0, Math.min(1, v))
        set({
          volume: vol,
          isMuted: vol === 0,
          ...(vol > 0 ? { volumeBeforeMute: vol } : {}),
        })
      },

      toggleMute: () => {
        const { isMuted, volume, volumeBeforeMute } = get()
        if (isMuted) {
          const restored = volumeBeforeMute > 0 ? volumeBeforeMute : 0.75
          set({ isMuted: false, volume: restored })
        } else {
          set({
            isMuted: true,
            volumeBeforeMute: volume > 0 ? volume : volumeBeforeMute,
            volume: 0,
          })
        }
      },

      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
      cyclePlaybackSpeed: () => {
        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2] as const
        const idx = speeds.indexOf(get().playbackSpeed)
        set({ playbackSpeed: speeds[(idx + 1) % speeds.length] })
      },

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
      setBufferProgress: (p) => set({ bufferProgress: Math.max(0, Math.min(1, p)) }),
      setEqualizer: (bands) =>
        set((s) => ({ equalizer: { ...s.equalizer, ...bands } })),
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
          miniPlayerVisible: true,
          error: null,
          currentTime: 0,
          bufferProgress: 0,
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
          miniPlayerVisible: true,
          error: null,
          currentTime: 0,
          bufferProgress: 0,
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
        set({ isPlaying: !isPlaying, miniPlayerVisible: true })
      },

      next: () => {
        const { queue, queueIndex, repeatMode, currentSong } = get()
        if (!currentSong || queue.length === 0) return

        if (repeatMode === 'one') {
          set({
            currentTime: 0,
            isLoading: true,
            replayNonce: get().replayNonce + 1,
          })
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
          bufferProgress: 0,
          recentlyPlayedIds: addRecent(get().recentlyPlayedIds, nextSong.id),
        })
      },

      previous: () => {
        const { queue, queueIndex, currentTime, currentSong } = get()
        if (!currentSong) return

        if (currentTime > 3) {
          set({ currentTime: 0, replayNonce: get().replayNonce + 1 })
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
          bufferProgress: 0,
          recentlyPlayedIds: addRecent(get().recentlyPlayedIds, prevSong.id),
        })
      },

      addToQueue: (song) =>
        set((s) => ({
          queue: s.queue.some((q) => q.id === song.id) ? s.queue : [...s.queue, song],
        })),

      removeFromQueue: (index) =>
        set((s) => {
          const queue = s.queue.filter((_, i) => i !== index)
          let queueIndex = s.queueIndex
          if (index < queueIndex) queueIndex--
          if (index === queueIndex) {
            if (queue.length === 0) {
              return {
                queue: [],
                queueIndex: 0,
                currentSong: null,
                isPlaying: false,
                miniPlayerVisible: false,
              }
            }
            if (queueIndex >= queue.length) queueIndex = queue.length - 1
            return {
              queue,
              queueIndex,
              currentSong: queue[queueIndex] ?? null,
              isPlaying: s.isPlaying,
              miniPlayerVisible: Boolean(queue[queueIndex]),
            }
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

      clearQueue: () =>
        set((s) => ({
          queue: s.currentSong ? [s.currentSong] : [],
          queueIndex: 0,
        })),

      seekBy: (delta) => {
        const { currentTime, duration } = get()
        const max = duration || 0
        set({ currentTime: Math.max(0, Math.min(max, currentTime + delta)) })
      },

      adjustVolume: (delta) => {
        const { volume, isMuted } = get()
        if (isMuted && delta > 0) {
          set({ isMuted: false, volume: Math.min(1, get().volumeBeforeMute + delta) })
          return
        }
        get().setVolume(volume + delta)
      },
    }),
    {
      name: 'aura-player',
      storage: createJSONStorage(() => window.localStorage),
      partialize: (s) => ({
        volume: s.isMuted ? s.volumeBeforeMute : s.volume,
        isMuted: s.isMuted,
        volumeBeforeMute: s.volumeBeforeMute,
        likedSongIds: s.likedSongIds,
        recentlyPlayedIds: s.recentlyPlayedIds,
        shuffle: s.shuffle,
        repeatMode: s.repeatMode,
        playbackSpeed: s.playbackSpeed,
        equalizer: s.equalizer,
        currentSong: s.currentSong,
        queue: s.queue,
        queueIndex: s.queueIndex,
        isPlaying: false,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        if (state.currentSong && state.queue.length === 0) {
          state.queue = [state.currentSong]
          state.queueIndex = 0
        }
        if (state.isMuted) {
          state.volume = 0
        }
      },
    },
  ),
)
