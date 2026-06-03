import { useEffect } from 'react'
import { usePlayerStore } from '../store/playerStore'

const INPUT_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

export function useKeyboardShortcuts(onSeek: (time: number) => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        INPUT_TAGS.has(target.tagName) ||
        target.isContentEditable
      ) {
        return
      }

      const state = usePlayerStore.getState()
      const { currentTime, duration, currentSong } = state

      switch (e.key) {
        case ' ':
          e.preventDefault()
          state.togglePlay()
          break
        case 'ArrowRight':
          if (currentSong && duration > 0) {
            e.preventDefault()
            const t = Math.min(duration, currentTime + 10)
            onSeek(t)
            state.setCurrentTime(t)
          }
          break
        case 'ArrowLeft':
          if (currentSong) {
            e.preventDefault()
            const t = Math.max(0, currentTime - 10)
            onSeek(t)
            state.setCurrentTime(t)
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          state.adjustVolume(0.05)
          break
        case 'ArrowDown':
          e.preventDefault()
          state.adjustVolume(-0.05)
          break
        case 'm':
        case 'M':
          e.preventDefault()
          state.toggleMute()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSeek])
}
