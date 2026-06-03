import { useEffect } from 'react'
import { usePlayerStore } from '../store/playerStore'

export function useMediaSession() {
  const currentSong = usePlayerStore((s) => s.currentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const togglePlay = usePlayerStore((s) => s.togglePlay)
  const next = usePlayerStore((s) => s.next)
  const previous = usePlayerStore((s) => s.previous)

  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentSong) return

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title,
      artist: currentSong.artistName,
      album: currentSong.albumTitle,
      artwork: [
        { src: currentSong.coverUrl, sizes: '96x96', type: 'image/jpeg' },
        { src: currentSong.coverUrl, sizes: '256x256', type: 'image/jpeg' },
        { src: currentSong.coverUrl, sizes: '512x512', type: 'image/jpeg' },
      ],
    })

    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'
  }, [currentSong, isPlaying])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return

    const actions: MediaSessionAction[] = [
      'play',
      'pause',
      'previoustrack',
      'nexttrack',
    ]

    try {
      navigator.mediaSession.setActionHandler('play', () => {
        if (!usePlayerStore.getState().isPlaying) togglePlay()
      })
      navigator.mediaSession.setActionHandler('pause', () => {
        if (usePlayerStore.getState().isPlaying) togglePlay()
      })
      navigator.mediaSession.setActionHandler('previoustrack', previous)
      navigator.mediaSession.setActionHandler('nexttrack', next)
    } catch {
      /* unsupported */
    }

    return () => {
      for (const action of actions) {
        try {
          navigator.mediaSession.setActionHandler(action, null)
        } catch {
          /* ignore */
        }
      }
    }
  }, [next, previous, togglePlay])
}
