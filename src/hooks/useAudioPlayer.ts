import { useEffect, useRef, useCallback } from 'react'
import { usePlayerStore } from '../store/playerStore'

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const connectedRef = useRef(false)

  const currentSong = usePlayerStore((s) => s.currentSong)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const volume = usePlayerStore((s) => s.volume)
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime)
  const setDuration = usePlayerStore((s) => s.setDuration)
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying)
  const setIsLoading = usePlayerStore((s) => s.setIsLoading)
  const setError = usePlayerStore((s) => s.setError)
  const next = usePlayerStore((s) => s.next)

  const getAnalyser = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return null

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    const ctx = audioContextRef.current

    if (ctx.state === 'suspended') {
      void ctx.resume()
    }

    if (!connectedRef.current) {
      try {
        sourceRef.current = ctx.createMediaElementSource(audio)
        analyserRef.current = ctx.createAnalyser()
        analyserRef.current.fftSize = 256
        analyserRef.current.smoothingTimeConstant = 0.8
        sourceRef.current.connect(analyserRef.current)
        analyserRef.current.connect(ctx.destination)
        connectedRef.current = true
      } catch {
        analyserRef.current = ctx.createAnalyser()
        analyserRef.current.connect(ctx.destination)
      }
    }

    return analyserRef.current
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return

    setIsLoading(true)
    audio.src = currentSong.audioUrl
    audio.load()

    const onCanPlay = () => {
      setIsLoading(false)
      if (isPlaying) void audio.play().catch(() => setIsPlaying(false))
    }

    const onLoadedMetadata = () => setDuration(audio.duration)
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onEnded = () => next()
    const onError = () =>
      setError({
        message: 'Failed to load audio. Check your connection and try again.',
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
  }, [currentSong?.id])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return

    if (isPlaying) {
      getAnalyser()
      void audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying, currentSong?.id])

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
