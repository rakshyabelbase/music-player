import { describe, it, expect, beforeEach } from 'vitest'
import { usePlaylistStore } from './playlistStore'

describe('usePlaylistStore', () => {
  beforeEach(() => {
    usePlaylistStore.setState({ userPlaylists: [] })
  })

  it('creates a playlist', () => {
    const id = usePlaylistStore.getState().createPlaylist('My Mix', 'Test desc')
    const playlist = usePlaylistStore.getState().getPlaylist(id)
    expect(playlist?.title).toBe('My Mix')
    expect(playlist?.description).toBe('Test desc')
    expect(playlist?.songIds).toEqual([])
  })

  it('renames and deletes playlists', () => {
    const id = usePlaylistStore.getState().createPlaylist('Old Name')
    usePlaylistStore.getState().renamePlaylist(id, 'New Name', 'Updated')
    expect(usePlaylistStore.getState().getPlaylist(id)?.title).toBe('New Name')

    usePlaylistStore.getState().deletePlaylist(id)
    expect(usePlaylistStore.getState().getPlaylist(id)).toBeUndefined()
  })

  it('adds, removes, and reorders songs', () => {
    const id = usePlaylistStore.getState().createPlaylist('Tracks')
    usePlaylistStore.getState().addSongToPlaylist(id, 's1')
    usePlaylistStore.getState().addSongToPlaylist(id, 's2')
    usePlaylistStore.getState().addSongToPlaylist(id, 's1')

    let p = usePlaylistStore.getState().getPlaylist(id)
    expect(p?.songIds).toEqual(['s1', 's2'])

    usePlaylistStore.getState().reorderPlaylistSongs(id, 0, 1)
    p = usePlaylistStore.getState().getPlaylist(id)
    expect(p?.songIds).toEqual(['s2', 's1'])

    usePlaylistStore.getState().removeSongFromPlaylist(id, 's2')
    p = usePlaylistStore.getState().getPlaylist(id)
    expect(p?.songIds).toEqual(['s1'])
  })

  it('merges default and user playlists', () => {
    const all = usePlaylistStore.getState().getAllPlaylists()
    expect(all.length).toBeGreaterThan(0)
  })
})
