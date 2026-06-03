import { useMemo } from 'react'
import { cn } from '../../utils/cn'

interface WaveformVisualizerProps {
  waveformData: Uint8Array
  isPlaying: boolean
  className?: string
  barCount?: number
}

export function WaveformVisualizer({
  waveformData,
  isPlaying,
  className,
  barCount = 64,
}: WaveformVisualizerProps) {
  const bars = useMemo(() => {
    const step = Math.floor(waveformData.length / barCount) || 1
    return Array.from({ length: barCount }, (_, i) => {
      const value = waveformData[i * step] ?? 128
      const normalized = Math.abs(value - 128) / 128
      return Math.max(2, normalized * 100)
    })
  }, [waveformData, barCount])

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-px h-16 w-full',
        className,
      )}
    >
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-0.5 sm:w-1 rounded-full bg-[var(--color-accent)]/80 transition-[height] duration-75"
          style={{
            height: isPlaying ? `${height}%` : '4%',
            opacity: isPlaying ? 0.4 + height / 200 : 0.3,
          }}
        />
      ))}
    </div>
  )
}
