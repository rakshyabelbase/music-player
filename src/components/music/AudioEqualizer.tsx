import { memo, useCallback } from 'react'
import { usePlayerStore } from '../../store/playerStore'
import { cn } from '../../utils/cn'

interface BandSliderProps {
  label: string
  value: number
  onChange: (v: number) => void
}

const BandSlider = memo(function BandSlider({ label, value, onChange }: BandSliderProps) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <input
        type="range"
        min={-12}
        max={12}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full max-w-[80px] accent-[var(--color-accent)] -rotate-90 origin-center h-20 sm:h-24"
        aria-label={`${label} EQ`}
      />
      <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
      <span className="text-[10px] tabular-nums text-[var(--color-text-muted)]">
        {value > 0 ? `+${value}` : value} dB
      </span>
    </div>
  )
})

export const AudioEqualizer = memo(function AudioEqualizer({
  className,
}: {
  className?: string
}) {
  const equalizer = usePlayerStore((s) => s.equalizer)
  const setEqualizer = usePlayerStore((s) => s.setEqualizer)

  const setBass = useCallback(
    (bass: number) => setEqualizer({ bass }),
    [setEqualizer],
  )
  const setMid = useCallback(
    (mid: number) => setEqualizer({ mid }),
    [setEqualizer],
  )
  const setTreble = useCallback(
    (treble: number) => setEqualizer({ treble }),
    [setEqualizer],
  )

  return (
    <div className={cn('w-full', className)}>
      <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-4 text-center">
        Equalizer
      </p>
      <div className="flex justify-center gap-4 sm:gap-8 px-4">
        <BandSlider label="Bass" value={equalizer.bass} onChange={setBass} />
        <BandSlider label="Mid" value={equalizer.mid} onChange={setMid} />
        <BandSlider label="Treble" value={equalizer.treble} onChange={setTreble} />
      </div>
    </div>
  )
})
