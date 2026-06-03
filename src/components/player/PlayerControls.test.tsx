import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PlayerControls } from './PlayerControls'
import { usePlayerStore } from '../../store/playerStore'
import { songs } from '../../data/mockMusic'

describe('PlayerControls', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      currentSong: songs[0],
      queue: songs.slice(0, 3),
      queueIndex: 0,
      isPlaying: false,
      shuffle: false,
      repeatMode: 'off',
    })
  })

  it('renders play button when paused', () => {
    render(<PlayerControls />)
    expect(screen.getByLabelText('Play')).toBeInTheDocument()
  })

  it('toggles play on click', () => {
    render(<PlayerControls />)
    fireEvent.click(screen.getByLabelText('Play'))
    expect(usePlayerStore.getState().isPlaying).toBe(true)
  })

  it('advances queue on next', () => {
    usePlayerStore.getState().playQueue(songs.slice(0, 3), 0)
    render(<PlayerControls />)
    fireEvent.click(screen.getByLabelText('Next'))
    expect(usePlayerStore.getState().queueIndex).toBe(1)
  })

  it('toggles shuffle', () => {
    render(<PlayerControls showShuffleRepeat />)
    fireEvent.click(screen.getByLabelText('Shuffle'))
    expect(usePlayerStore.getState().shuffle).toBe(true)
  })
})
