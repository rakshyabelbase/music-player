import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface AudioVisualizerProps {
  frequencyData: Uint8Array
  isPlaying: boolean
  className?: string
  barCount?: number
}

export function AudioVisualizer({
  frequencyData,
  isPlaying,
  className,
  barCount = 48,
}: AudioVisualizerProps) {
  const bars = useMemo(() => {
    const step = Math.floor(frequencyData.length / barCount) || 1
    return Array.from({ length: barCount }, (_, i) => {
      const idx = i * step
      const value = frequencyData[idx] ?? 0
      return Math.max(4, (value / 255) * 100)
    })
  }, [frequencyData, barCount])

  return (
    <div
      className={cn(
        'flex items-end justify-center gap-1 h-32 w-full',
        className,
      )}
    >
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="w-1 sm:w-1.5 rounded-full bg-gradient-to-t from-[var(--color-accent)] to-[var(--color-accent-secondary)]"
          animate={{ height: isPlaying ? `${height}%` : '4%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            boxShadow: isPlaying
              ? `0 0 8px var(--color-accent-glow)`
              : 'none',
          }}
        />
      ))}
    </div>
  )
}
