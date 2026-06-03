import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface ProgressBarProps {
  value: number
  max: number
  onSeek?: (value: number) => void
  className?: string
  showGlow?: boolean
}

export function ProgressBar({
  value,
  max,
  onSeek,
  className,
  showGlow = true,
}: ProgressBarProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0

  const handleSeek = useCallback(
    (clientX: number) => {
      if (!onSeek || !trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      onSeek(ratio * max)
    },
    [max, onSeek],
  )

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      tabIndex={0}
      className={cn(
        'group relative h-1.5 rounded-full bg-white/10 cursor-pointer',
        className,
      )}
      onClick={(e) => handleSeek(e.clientX)}
      onKeyDown={(e) => {
        if (!onSeek) return
        const step = max * 0.05
        if (e.key === 'ArrowRight') onSeek(Math.min(max, value + step))
        if (e.key === 'ArrowLeft') onSeek(Math.max(0, value - step))
      }}
    >
      <motion.div
        className={cn(
          'absolute inset-y-0 left-0 rounded-full bg-[var(--color-accent)]',
          showGlow && 'shadow-[0_0_12px_var(--color-accent-glow)]',
        )}
        style={{ width: `${percent}%` }}
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white opacity-0 group-hover:opacity-100 shadow-lg transition-opacity"
        style={{ left: `calc(${percent}% - 7px)` }}
        whileHover={{ scale: 1.2 }}
      />
    </div>
  )
}
