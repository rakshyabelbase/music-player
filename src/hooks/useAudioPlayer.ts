import { useEffect, useRef, useCallback } from 'react'
import { usePlayerStore } from '../store/playerStore'
import type { EqualizerBands } from '../types'

function canAnalyzeSource(src: string): boolean {
  if (!src) return false
  try {
    return new URL(src, window.location.href).origin === window.location.origin
  } catch {
    return false
  }
}

function applyEqGain(
  filters: { bass: BiquadFilterNode; mid: BiquadFilterNode; treble: BiquadFilterNode },
  bands: EqualizerBands,
) {
  filters.bass.gain.value = bands.bass
  filters.mid.gain.value = bands.mid
  filters.treble.gain.value = bands.treble
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const preloadRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const eqFiltersRef = useRef<{
    bass: BiquadFilterNode
    mid: BiquadFilterNode
    treble: BiquadFilterNode
  } | null>(null)
  const connectedRef = useRef(false)
  const isPlayingRef = useRef(false)

  const currentSong = usePlayerStore((s) => s.currentSong)
  const queue = usePlayerStore((s) => s.queue)
  const queueIndex = usePlayerStore((s) => s.queueIndex)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const volume = usePlayerStore((s) => s.volume)
  const playbackSpeed = usePlayerStore((s) => s.playbackSpeed)
  const equalizer = usePlayerStore((s) => s.equalizer)
  const replayNonce = usePlayerStore((s) => s.replayNonce)
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime)
  const setDuration = usePlayerStore((s) => s.setDuration)
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying)
  const setIsLoading = usePlayerStore((s) => s.setIsLoading)
  const setBufferProgress = usePlayerStore((s) => s.setBufferProgress)
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

  const setupWebAudio = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !canAnalyzeSource(audio.currentSrc || audio.src)) return null

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    const ctx = audioContextRef.current
    if (ctx.state === 'suspended') void ctx.resume()

    if (!connectedRef.current && !sourceRef.current) {
      try {
        sourceRef.current = ctx.createMediaElementSource(audio)
        const bass = ctx.createBiquadFilter()
        bass.type = 'lowshelf'
        bass.frequency.value = 200

        const mid = ctx.createBiquadFilter()
        mid.type = 'peaking'
        mid.frequency.value = 1000
        mid.Q.value = 0.7

        const treble = ctx.createBiquadFilter()
        treble.type = 'highshelf'
        treble.frequency.value = 4000

        analyserRef.current = ctx.createAnalyser()
        analyserRef.current.fftSize = 256
        analyserRef.current.smoothingTimeConstant = 0.8

        sourceRef.current.connect(bass)
        bass.connect(mid)
        mid.connect(treble)
        treble.connect(analyserRef.current)
        analyserRef.current.connect(ctx.destination)

        eqFiltersRef.current = { bass, mid, treble }
        applyEqGain(eqFiltersRef.current, equalizer)
        connectedRef.current = true
      } catch {
        return null
      }
    }

    if (eqFiltersRef.current) {
      applyEqGain(eqFiltersRef.current, equalizer)
    }

    return analyserRef.current
  }, [equalizer])

  const getAnalyser = useCallback(() => setupWebAudio(), [setupWebAudio])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return

    setIsLoading(true)
    setError(null)
    setBufferProgress(0)
    audio.src = currentSong.audioUrl
    audio.load()

    const updateBuffer = () => {
      if (audio.buffered.length > 0 && audio.duration > 0) {
        const end = audio.buffered.end(audio.buffered.length - 1)
        setBufferProgress(end / audio.duration)
      }
    }

    const onCanPlay = () => {
      setIsLoading(false)
      updateBuffer()
      if (isPlayingRef.current) playAudio()
    }

    const onLoadedMetadata = () => {
      setDuration(audio.duration)
      updateBuffer()
    }
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onEnded = () => next()
    const onError = () =>
      setError({
        message:
          'Failed to load audio. Check your connection or try another track.',
        code: 'AUDIO_ERROR',
      })
    const onWaiting = () => setIsLoading(true)
    const onPlaying = () => {
      setIsLoading(false)
      setIsPlaying(true)
    }
    const onPause = () => setIsPlaying(false)
    const onProgress = updateBuffer
    const onStalled = () => setIsLoading(true)

    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('progress', onProgress)
    audio.addEventListener('stalled', onStalled)

    return () => {
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('progress', onProgress)
      audio.removeEventListener('stalled', onStalled)
    }
  }, [
    currentSong?.id,
    currentSong?.audioUrl,
    next,
    playAudio,
    setBufferProgress,
    setCurrentTime,
    setDuration,
    setError,
    setIsLoading,
    setIsPlaying,
  ])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return

    if (isPlaying) playAudio()
    else audio.pause()
  }, [isPlaying, currentSong?.id, playAudio])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.playbackRate = playbackSpeed
  }, [playbackSpeed])

  useEffect(() => {
    if (eqFiltersRef.current) applyEqGain(eqFiltersRef.current, equalizer)
  }, [equalizer])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || replayNonce === 0) return
    audio.currentTime = 0
    setCurrentTime(0)
    setIsLoading(false)
    if (isPlayingRef.current) playAudio()
  }, [replayNonce, playAudio, setCurrentTime, setIsLoading])

  useEffect(() => {
    const nextSong = queue[queueIndex + 1]
    if (!preloadRef.current) preloadRef.current = new Audio()
    const pre = preloadRef.current
    if (nextSong) {
      pre.preload = 'auto'
      if (pre.src !== nextSong.audioUrl) {
        pre.src = nextSong.audioUrl
        pre.load()
      }
    } else {
      pre.removeAttribute('src')
    }
  }, [queue, queueIndex, currentSong?.id])

  const seek = useCallback(
    (time: number) => {
      const audio = audioRef.current
      if (audio) {
        audio.currentTime = time
        setCurrentTime(time)
      }
    },
    [setCurrentTime],
  )

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
