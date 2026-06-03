import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface EqualizerProps {
  isPlaying?: boolean
  bars?: number
  className?: string
}

export function Equalizer({ isPlaying = false, bars = 4, className }: EqualizerProps) {
  return (
    <div className={cn('flex items-end gap-0.5 h-4', className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full bg-[var(--color-accent)]"
          animate={
            isPlaying
              ? {
                  height: ['20%', '100%', '40%', '80%', '20%'],
                }
              : { height: '20%' }
          }
          transition={
            isPlaying
              ? {
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  )
}
