import { motion } from 'framer-motion'
import { Home, Search, Library, Heart, ListMusic } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import type { NavItem } from '../../types'
import { cn } from '../../utils/cn'

const items: { id: NavItem; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'library', icon: Library, label: 'Library' },
  { id: 'playlists', icon: ListMusic, label: 'Lists' },
  { id: 'liked', icon: Heart, label: 'Liked' },
]

export function MobileNav() {
  const activeNav = usePlayerStore((s) => s.activeNav)
  const setActiveNav = usePlayerStore((s) => s.setActiveNav)
  const currentSong = usePlayerStore((s) => s.currentSong)

  return (
    <nav
      className={cn(
        'md:hidden fixed left-0 right-0 z-20 glass-strong border-t border-white/10 safe-bottom',
        currentSong ? 'bottom-[72px]' : 'bottom-0',
      )}
    >
      <div className="flex items-center justify-around py-2 px-2">
        {items.map(({ id, icon: Icon, label }) => {
          const active = activeNav === id
          return (
            <motion.button
              key={id}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveNav(id)}
              className={cn(
                'relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl min-w-[56px]',
                active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]',
              )}
            >
              {active && (
                <motion.div
                  layoutId="mobile-nav-glow"
                  className="absolute inset-0 rounded-xl bg-[var(--color-accent)]/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  'w-5 h-5 relative z-10',
                  active && id === 'liked' && 'fill-current',
                )}
              />
              <span className="text-[10px] font-medium relative z-10">{label}</span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
