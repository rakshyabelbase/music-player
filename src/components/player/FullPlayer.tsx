import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  Heart,
  ListOrdered,
  Mic2,
  Gauge,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import { useAudioVisualizer } from '../../hooks/useAudioVisualizer'
import { useWaveformVisualizer } from '../../hooks/useWaveformVisualizer'
import { formatTime } from '../../utils/formatTime'
import { ProgressBar } from '../ui/ProgressBar'
import { VolumeSlider } from '../ui/VolumeSlider'
import { PlayerControls } from './PlayerControls'
import { AudioVisualizer } from '../music/AudioVisualizer'
import { WaveformVisualizer } from '../music/WaveformVisualizer'
import { AudioEqualizer } from '../music/AudioEqualizer'
import { cn } from '../../utils/cn'

interface FullPlayerProps {
  onSeek: (time: number) => void
  getAnalyser: () => AnalyserNode | null
  onDismiss: () => void
}

export const FullPlayer = memo(function FullPlayer({
  onSeek,
  getAnalyser,
  onDismiss,
}: FullPlayerProps) {
  const fullPlayerOpen = usePlayerStore((s) => s.fullPlayerOpen)
  const setFullPlayerOpen = usePlayerStore((s) => s.setFullPlayerOpen)
  const currentSong = usePlayerStore((s) => s.currentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const duration = usePlayerStore((s) => s.duration)
  const volume = usePlayerStore((s) => s.volume)
  const isMuted = usePlayerStore((s) => s.isMuted)
  const setVolume = usePlayerStore((s) => s.setVolume)
  const toggleMute = usePlayerStore((s) => s.toggleMute)
  const playbackSpeed = usePlayerStore((s) => s.playbackSpeed)
  const cyclePlaybackSpeed = usePlayerStore((s) => s.cyclePlaybackSpeed)
  const bufferProgress = usePlayerStore((s) => s.bufferProgress)
  const setShowQueue = usePlayerStore((s) => s.setShowQueue)
  const setShowLyrics = usePlayerStore((s) => s.setShowLyrics)
  const isLiked = usePlayerStore((s) => s.isLiked)
  const toggleLike = usePlayerStore((s) => s.toggleLike)
  const isLoading = usePlayerStore((s) => s.isLoading)

  const frequencyData = useAudioVisualizer(getAnalyser, isPlaying)
  const waveformData = useWaveformVisualizer(getAnalyser, isPlaying)

  const close = () => {
    setFullPlayerOpen(false)
    onDismiss()
  }

  if (!currentSong) return null

  const maxDuration = duration || currentSong.duration
  const bufferPercent = bufferProgress * 100

  return (
    <AnimatePresence>
      {fullPlayerOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 32, stiffness: 320 }}
          className="fixed inset-0 z-50 flex flex-col overflow-hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,10,15,0.95) 0%, rgba(18,18,26,0.98) 50%, #0a0a0f 100%)',
          }}
        >
          <div
            className="absolute inset-0 opacity-30 blur-3xl pointer-events-none"
            style={{
              backgroundImage: `url(${currentSong.coverUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          <header className="relative flex items-center justify-between p-4 shrink-0">
            <button
              type="button"
              onClick={close}
              className="p-2 rounded-full hover:bg-white/10 touch-manipulation"
              aria-label="Close player"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            <span className="text-sm text-[var(--color-text-muted)] uppercase tracking-widest">
              Now Playing
            </span>
            <button
              type="button"
              onClick={() => toggleLike(currentSong.id)}
              className="p-2 rounded-full hover:bg-white/10 touch-manipulation"
              aria-label="Like"
            >
              <Heart
                className={cn(
                  'w-6 h-6',
                  isLiked(currentSong.id)
                    ? 'fill-[var(--color-accent)] text-[var(--color-accent)]'
                    : '',
                )}
              />
            </button>
          </header>

          <div className="relative flex-1 flex flex-col items-center justify-center px-6 gap-4 overflow-y-auto pb-6">
            <motion.div
              className="relative w-56 h-56 sm:w-72 sm:h-72"
              animate={{ scale: isPlaying ? 1 : 0.95 }}
            >
              <motion.img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={
                  isPlaying
                    ? { duration: 24, repeat: Infinity, ease: 'linear' }
                    : {}
                }
                className="w-full h-full rounded-2xl object-cover shadow-2xl glow-accent"
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                  <span className="text-sm">Loading…</span>
                </div>
              )}
            </motion.div>

            <AudioVisualizer
              frequencyData={frequencyData}
              isPlaying={isPlaying && !isLoading}
              className="max-w-lg w-full"
              barCount={32}
            />

            <WaveformVisualizer
              waveformData={waveformData}
              isPlaying={isPlaying && !isLoading}
              className="max-w-lg w-full -mt-2"
            />

            <div className="text-center w-full max-w-md">
              <h1 className="text-2xl font-bold mb-1">{currentSong.title}</h1>
              <p className="text-[var(--color-text-muted)]">{currentSong.artistName}</p>
            </div>

            <div className="w-full max-w-lg space-y-2">
              <div className="relative h-1.5 rounded-full bg-white/10">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-white/20"
                  style={{ width: `${bufferPercent}%` }}
                />
                <ProgressBar
                  value={currentTime}
                  max={maxDuration}
                  onSeek={onSeek}
                  className="absolute inset-0 h-full bg-transparent"
                  showGlow={false}
                />
              </div>
              <div className="flex justify-between text-xs text-[var(--color-text-muted)] tabular-nums">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(maxDuration)}</span>
              </div>
            </div>

            <PlayerControls size="lg" />

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                type="button"
                onClick={cyclePlaybackSpeed}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-sm touch-manipulation"
                aria-label="Playback speed"
              >
                <Gauge className="w-4 h-4" />
                {playbackSpeed}x
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-white/10 touch-manipulation"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <VolumeSlider
                value={isMuted ? 0 : volume}
                onChange={setVolume}
                className="w-24"
              />
            </div>

            <AudioEqualizer className="max-w-sm" />

            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setShowLyrics(true)}
                className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-white touch-manipulation"
              >
                <Mic2 className="w-4 h-4" />
                Lyrics
              </button>
              <button
                type="button"
                onClick={() => setShowQueue(true)}
                className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-white touch-manipulation"
              >
                <ListOrdered className="w-4 h-4" />
                Queue
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})
