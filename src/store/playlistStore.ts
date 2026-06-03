import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Playlist } from '../types'
import { playlists as defaultPlaylists } from '../data/mockMusic'

const cover = (seed: string) =>
  `https://picsum.photos/seed/${seed}/400/400`

function newId() {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

interface PlaylistState {
  userPlaylists: Playlist[]
  createPlaylist: (title: string, description?: string) => string
  renamePlaylist: (id: string, title: string, description?: string) => void
  deletePlaylist: (id: string) => void
  addSongToPlaylist: (playlistId: string, songId: string) => void
  removeSongFromPlaylist: (playlistId: string, songId: string) => void
  reorderPlaylistSongs: (playlistId: string, from: number, to: number) => void
  getAllPlaylists: () => Playlist[]
  getPlaylist: (id: string) => Playlist | undefined
}

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      userPlaylists: [],

      createPlaylist: (title, description = '') => {
        const id = newId()
        const playlist: Playlist = {
          id,
          title: title.trim() || 'Untitled Playlist',
          description,
          coverUrl: cover(id),
          songIds: [],
          createdBy: 'You',
        }
        set((s) => ({ userPlaylists: [playlist, ...s.userPlaylists] }))
        return id
      },

      renamePlaylist: (id, title, description) =>
        set((s) => ({
          userPlaylists: s.userPlaylists.map((p) =>
            p.id === id
              ? {
                  ...p,
                  title: title.trim() || p.title,
                  ...(description !== undefined ? { description } : {}),
                }
              : p,
          ),
        })),

      deletePlaylist: (id) =>
        set((s) => ({
          userPlaylists: s.userPlaylists.filter((p) => p.id !== id),
        })),

      addSongToPlaylist: (playlistId, songId) =>
        set((s) => ({
          userPlaylists: s.userPlaylists.map((p) =>
            p.id === playlistId && !p.songIds.includes(songId)
              ? { ...p, songIds: [...p.songIds, songId] }
              : p,
          ),
        })),

      removeSongFromPlaylist: (playlistId, songId) =>
        set((s) => ({
          userPlaylists: s.userPlaylists.map((p) =>
            p.id === playlistId
              ? { ...p, songIds: p.songIds.filter((id) => id !== songId) }
              : p,
          ),
        })),

      reorderPlaylistSongs: (playlistId, from, to) =>
        set((s) => ({
          userPlaylists: s.userPlaylists.map((p) => {
            if (p.id !== playlistId) return p
            const songIds = [...p.songIds]
            const [item] = songIds.splice(from, 1)
            songIds.splice(to, 0, item)
            return { ...p, songIds }
          }),
        })),

      getAllPlaylists: () => [...defaultPlaylists, ...get().userPlaylists],

      getPlaylist: (id) => {
        const all = get().getAllPlaylists()
        return all.find((p) => p.id === id)
      },
    }),
    {
      name: 'aura-playlists',
      storage: createJSONStorage(() => window.localStorage),
    },
  ),
)
