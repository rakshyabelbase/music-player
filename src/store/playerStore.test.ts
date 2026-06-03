import { describe, it, expect, beforeEach } from 'vitest'
import { usePlayerStore } from './playerStore'
import { songs } from '../data/mockMusic'

describe('usePlayerStore', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      currentSong: null,
      queue: [],
      queueIndex: 0,
      isPlaying: false,
      repeatMode: 'off',
      shuffle: false,
      volume: 0.75,
      isMuted: false,
      likedSongIds: [],
      recentlyPlayedIds: [],
    })
  })

  it('plays a song and builds queue', () => {
    const song = songs[0]
    const playlist = songs.slice(0, 3)
    usePlayerStore.getState().playSong(song, playlist)

    const state = usePlayerStore.getState()
    expect(state.currentSong?.id).toBe(song.id)
    expect(state.isPlaying).toBe(true)
    expect(state.queue.length).toBe(3)
    expect(state.recentlyPlayedIds[0]).toBe(song.id)
  })

  it('toggles like', () => {
    usePlayerStore.getState().toggleLike('s1')
    expect(usePlayerStore.getState().isLiked('s1')).toBe(true)
    usePlayerStore.getState().toggleLike('s1')
    expect(usePlayerStore.getState().isLiked('s1')).toBe(false)
  })

  it('adds and removes from queue', () => {
    const subset = [songs[0], songs[1]]
    usePlayerStore.getState().playSong(songs[0], subset)
    const initialLen = usePlayerStore.getState().queue.length
    usePlayerStore.getState().addToQueue(songs[5])
    expect(usePlayerStore.getState().queue.length).toBe(initialLen + 1)

    usePlayerStore.getState().removeFromQueue(initialLen)
    expect(usePlayerStore.getState().queue.length).toBe(initialLen)
  })

  it('reorders queue and updates index', () => {
    usePlayerStore.getState().playQueue(songs.slice(0, 4), 0)
    usePlayerStore.getState().reorderQueue(0, 2)
    const state = usePlayerStore.getState()
    expect(state.queueIndex).toBe(2)
  })

  it('cycles repeat mode via setRepeatMode', () => {
    usePlayerStore.getState().setRepeatMode('one')
    expect(usePlayerStore.getState().repeatMode).toBe('one')
  })

  it('replays on repeat one without changing song', () => {
    usePlayerStore.getState().playSong(songs[0], songs)
    usePlayerStore.getState().setRepeatMode('one')
    const nonce = usePlayerStore.getState().replayNonce
    usePlayerStore.getState().next()
    expect(usePlayerStore.getState().currentSong?.id).toBe(songs[0].id)
    expect(usePlayerStore.getState().replayNonce).toBe(nonce + 1)
  })

  it('mutes and restores volume', () => {
    usePlayerStore.getState().setVolume(0.8)
    usePlayerStore.getState().toggleMute()
    expect(usePlayerStore.getState().isMuted).toBe(true)
    expect(usePlayerStore.getState().volume).toBe(0)
    usePlayerStore.getState().toggleMute()
    expect(usePlayerStore.getState().isMuted).toBe(false)
    expect(usePlayerStore.getState().volume).toBeGreaterThan(0)
  })

  it('clears queue keeping current song', () => {
    usePlayerStore.getState().playQueue(songs.slice(0, 5), 2)
    usePlayerStore.getState().clearQueue()
    const state = usePlayerStore.getState()
    expect(state.queue.length).toBe(1)
    expect(state.queue[0].id).toBe(state.currentSong?.id)
  })
})
