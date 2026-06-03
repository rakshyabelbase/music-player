import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../utils/cn'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      'bg-[var(--color-accent)] text-black font-semibold hover:brightness-110 shadow-lg shadow-[var(--color-accent-glow)]',
    secondary: 'glass text-white hover:bg-white/10',
    ghost: 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/5',
    icon: 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/10 rounded-full',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-full',
    md: 'px-5 py-2.5 text-sm rounded-full',
    lg: 'px-8 py-3.5 text-base rounded-full',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
