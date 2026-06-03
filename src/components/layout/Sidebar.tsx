import { motion } from 'framer-motion'
import {
  Home,
  Search,
  Library,
  ListMusic,
  Heart,
  Disc3,
} from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import type { NavItem } from '../../types'
import { playlists } from '../../data/mockMusic'
import { cn } from '../../utils/cn'

const navItems: { id: NavItem; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'playlists', label: 'Playlists', icon: ListMusic },
  { id: 'liked', label: 'Liked Songs', icon: Heart },
]

export function Sidebar() {
  const activeNav = usePlayerStore((s) => s.activeNav)
  const setActiveNav = usePlayerStore((s) => s.setActiveNav)
  const likedSongIds = usePlayerStore((s) => s.likedSongIds)

  return (
    <aside className="hidden md:flex flex-col w-[240px] lg:w-[260px] h-full glass-strong border-r border-white/10 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)] flex items-center justify-center">
          <Disc3 className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">Aura</h1>
          <p className="text-xs text-[var(--color-text-muted)]">Premium Music</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeNav === id
          return (
            <motion.button
              key={id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveNav(id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-white/10 text-white'
                  : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/5',
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5',
                  active && id === 'liked' && 'fill-[var(--color-accent)] text-[var(--color-accent)]',
                )}
              />
              {label}
              {id === 'liked' && likedSongIds.length > 0 && (
                <span className="ml-auto text-xs text-[var(--color-text-muted)]">
                  {likedSongIds.length}
                </span>
              )}
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute left-0 w-1 h-8 bg-[var(--color-accent)] rounded-r-full hidden"
                />
              )}
            </motion.button>
          )
        })}

        <div className="pt-6 pb-2 px-4">
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
            Your Playlists
          </p>
        </div>
        {playlists.slice(0, 3).map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              usePlayerStore.getState().setSelectedPlaylistId(p.id)
              setActiveNav('playlists')
            }}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-white hover:bg-white/5 truncate"
          >
            <div
              className="w-8 h-8 rounded-md bg-cover bg-center shrink-0"
              style={{ backgroundImage: `url(${p.coverUrl})` }}
            />
            <span className="truncate">{p.title}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
