import { useEffect, useRef, useCallback } from 'react'
import { usePlayerStore } from '../store/playerStore'

function canAnalyzeSource(src: string): boolean {
  if (!src) return false

  try {
    return new URL(src, window.location.href).origin === window.location.origin
  } catch {
    return false
  }
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const connectedRef = useRef(false)
  const isPlayingRef = useRef(false)

  const currentSong = usePlayerStore((s) => s.currentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const volume = usePlayerStore((s) => s.volume)
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime)
  const setDuration = usePlayerStore((s) => s.setDuration)
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying)
  const setIsLoading = usePlayerStore((s) => s.setIsLoading)
  const setError = usePlayerStore((s) => s.setError)
  const next = usePlayerStore((s) => s.next)

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  const playAudio = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    void audio.play().catch((error: unknown) => {
      setIsPlaying(false)
      setIsLoading(false)
      setError({
        message:
          error instanceof DOMException && error.name === 'NotAllowedError'
            ? 'Click the play button once more to start audio in this browser.'
            : 'Audio could not start. Check the track URL or try another song.',
        code: 'PLAYBACK_ERROR',
      })
    })
  }, [setError, setIsLoading, setIsPlaying])

  const getAnalyser = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return null

    if (!canAnalyzeSource(audio.currentSrc || audio.src)) {
      return null
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    const ctx = audioContextRef.current

    if (ctx.state === 'suspended') {
      void ctx.resume()
    }

    if (!connectedRef.current && !sourceRef.current) {
      try {
        sourceRef.current = ctx.createMediaElementSource(audio)
        analyserRef.current = ctx.createAnalyser()
        analyserRef.current.fftSize = 256
        analyserRef.current.smoothingTimeConstant = 0.8
        sourceRef.current.connect(analyserRef.current)
        analyserRef.current.connect(ctx.destination)
        connectedRef.current = true
      } catch {
        return null
      }
    }

    return analyserRef.current
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return

    setIsLoading(true)
    setError(null)
    audio.src = currentSong.audioUrl
    audio.load()

    const onCanPlay = () => {
      setIsLoading(false)
      if (isPlayingRef.current) playAudio()
    }

    const onLoadedMetadata = () => setDuration(audio.duration)
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onEnded = () => next()
    const onError = () =>
      setError({
        message:
          'Failed to load audio. Remote demo tracks need internet access, or you can use a local MP3 from the public folder.',
        code: 'AUDIO_ERROR',
      })
    const onWaiting = () => setIsLoading(true)
    const onPlaying = () => {
      setIsLoading(false)
      setIsPlaying(true)
    }
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('pause', onPause)
    }
  }, [
    currentSong?.id,
    currentSong?.audioUrl,
    next,
    playAudio,
    setCurrentTime,
    setDuration,
    setError,
    setIsLoading,
    setIsPlaying,
  ])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return

    if (isPlaying) {
      playAudio()
    } else {
      audio.pause()
    }
  }, [isPlaying, currentSong?.id, playAudio])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = volume
  }, [volume])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = time
      setCurrentTime(time)
    }
  }, [setCurrentTime])

  const resumeContext = useCallback(() => {
    const ctx = audioContextRef.current
    if (ctx?.state === 'suspended') void ctx.resume()
  }, [])

  return {
    audioRef,
    getAnalyser,
    seek,
    resumeContext,
  }
}
