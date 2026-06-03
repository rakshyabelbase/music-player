import { useMemo } from 'react'
import type { LyricLine } from '../types'

export function useActiveLyric(lyrics: LyricLine[] | undefined, currentTime: number) {
  return useMemo(() => {
    if (!lyrics?.length) return -1
    let active = 0
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) active = i
      else break
    }
    return active
  }, [lyrics, currentTime])
}
