import { Volume2, VolumeX } from 'lucide-react'
import { cn } from '../../utils/cn'

interface VolumeSliderProps {
  value: number
  onChange: (v: number) => void
  className?: string
}

export function VolumeSlider({ value, onChange, className }: VolumeSliderProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        type="button"
        onClick={() => onChange(value > 0 ? 0 : 0.75)}
        className="text-[var(--color-text-muted)] hover:text-white transition-colors p-1"
        aria-label={value === 0 ? 'Unmute' : 'Mute'}
      >
        {value === 0 ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-20 h-1 accent-[var(--color-accent)] cursor-pointer opacity-80 hover:opacity-100"
        aria-label="Volume"
      />
    </div>
  )
}
