import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MiniPlayer } from './MiniPlayer'
import { usePlayerStore } from '../../store/playerStore'
import { songs } from '../../data/mockMusic'

describe('MiniPlayer', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  beforeEach(() => {
    usePlayerStore.setState({
      currentSong: null,
      queue: [],
      queueIndex: 0,
      sourcePlaylist: songs,
      isPlaying: false,
      isLoading: false,
      miniPlayerVisible: false,
      fullPlayerOpen: false,
      showQueue: false,
      showLyrics: false,
      currentTime: 0,
      duration: 0,
      bufferProgress: 0,
    })
  })

  it('stays hidden for a restored song until playback starts', () => {
    usePlayerStore.setState({
      currentSong: songs[0],
      queue: songs.slice(0, 3),
      queueIndex: 0,
      miniPlayerVisible: false,
    })

    render(<MiniPlayer onSeek={vi.fn()} />)

    expect(screen.queryByLabelText('Close player')).not.toBeInTheDocument()
    expect(screen.queryByText(songs[0].title)).not.toBeInTheDocument()
  })

  it('appears after a song is played and can be dismissed', () => {
    usePlayerStore.getState().playSong(songs[0], songs.slice(0, 3))

    render(<MiniPlayer onSeek={vi.fn()} />)

    expect(screen.getByText(songs[0].title)).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Close player'))
    expect(usePlayerStore.getState().miniPlayerVisible).toBe(false)
    expect(usePlayerStore.getState().isPlaying).toBe(false)
  })
})
