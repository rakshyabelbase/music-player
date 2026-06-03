import { useEffect, useRef, useState, useCallback } from 'react'

export function useAudioVisualizer(
  getAnalyser: () => AnalyserNode | null,
  isPlaying: boolean,
) {
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(
    new Uint8Array(64),
  )
  const rafRef = useRef<number>(0)
  const dataArrayRef = useRef<Uint8Array | null>(null)

  const animate = useCallback(() => {
    const analyser = getAnalyser()
    if (!analyser) {
      rafRef.current = requestAnimationFrame(animate)
      return
    }

    if (!dataArrayRef.current) {
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount)
    }

    const data = dataArrayRef.current
    analyser.getByteFrequencyData(data as Uint8Array<ArrayBuffer>)
    setFrequencyData(new Uint8Array([...data]))
    rafRef.current = requestAnimationFrame(animate)
  }, [getAnalyser])

  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(animate)
    } else {
      cancelAnimationFrame(rafRef.current)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying, animate])

  return frequencyData
}
