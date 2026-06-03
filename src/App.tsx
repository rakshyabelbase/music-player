import { AnimatePresence, motion } from 'framer-motion'
import { AnimatedBackground } from './components/layout/AnimatedBackground'
import { Sidebar } from './components/layout/Sidebar'
import { MobileNav } from './components/layout/MobileNav'
import { PageTransition } from './components/layout/PageTransition'
import { MiniPlayer } from './components/player/MiniPlayer'
import { FullPlayer } from './components/player/FullPlayer'
import { QueuePanel } from './components/player/QueuePanel'
import { LyricsPanel } from './components/player/LyricsPanel'
import { ErrorState } from './components/ui/ErrorState'
import { VolumeSlider } from './components/ui/VolumeSlider'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { usePlayerStore } from './store/playerStore'
import { LandingPage } from './pages/LandingPage'
import { HomePage } from './pages/HomePage'
import { SearchPage } from './pages/SearchPage'
import { LibraryPage } from './pages/LibraryPage'
import { PlaylistsPage } from './pages/PlaylistsPage'
import { LikedSongsPage } from './pages/LikedSongsPage'
import { cn } from './utils/cn'

function MainContent() {
  const activeNav = usePlayerStore((s) => s.activeNav)

  const pages = {
    home: <HomePage />,
    search: <SearchPage />,
    library: <LibraryPage />,
    playlists: <PlaylistsPage />,
    liked: <LikedSongsPage />,
  }

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={activeNav} className="h-full">
        {pages[activeNav]}
      </PageTransition>
    </AnimatePresence>
  )
}

function AppShell() {
  const { audioRef, getAnalyser, seek, resumeContext } = useAudioPlayer()
  const currentSong = usePlayerStore((s) => s.currentSong)
  const error = usePlayerStore((s) => s.error)
  const clearError = usePlayerStore((s) => s.clearError)
  const volume = usePlayerStore((s) => s.volume)
  const setVolume = usePlayerStore((s) => s.setVolume)
  const isLoading = usePlayerStore((s) => s.isLoading)

  const handleInteraction = () => resumeContext()

  return (
    <div
      className="h-full flex flex-col md:flex-row overflow-hidden"
      onClick={handleInteraction}
      onKeyDown={handleInteraction}
    >
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

      <Sidebar />
      <main
        className={cn(
          'flex-1 flex flex-col min-w-0 overflow-hidden',
          currentSong ? 'pb-[72px] md:pb-[88px]' : 'pb-14 md:pb-[88px]',
        )}
      >
        <header className="hidden md:flex items-center justify-between px-6 py-4 shrink-0 border-b border-white/5">
          <div />
          <VolumeSlider value={volume} onChange={setVolume} />
        </header>

        <div className="flex-1 overflow-y-auto">
          {error ? (
            <ErrorState
              message={error.message}
              onRetry={() => {
                clearError()
                if (currentSong) {
                  usePlayerStore.getState().playSong(currentSong)
                }
              }}
              onDismiss={clearError}
            />
          ) : (
            <MainContent />
          )}
        </div>
      </main>

      <MobileNav />
      <MiniPlayer onSeek={seek} />
      <FullPlayer
        onSeek={seek}
        getAnalyser={getAnalyser}
        onDismiss={resumeContext}
      />
      <QueuePanel />
      <LyricsPanel />

      {isLoading && currentSong && (
        <div className="fixed top-4 right-4 z-50 glass px-4 py-2 rounded-full text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
          Loading…
        </div>
      )}
    </div>
  )
}

export default function App() {
  const hasEnteredApp = usePlayerStore((s) => s.hasEnteredApp)

  return (
    <>
      <AnimatedBackground />
      <AnimatePresence mode="wait">
        {!hasEnteredApp ? (
          <LandingPage key="landing" />
        ) : (
          <motion.div key="app" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AppShell />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
