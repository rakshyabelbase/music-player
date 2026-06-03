import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './Button'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
  onDismiss?: () => void
}

export function ErrorState({ message, onRetry, onDismiss }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
      <p className="text-[var(--color-text-muted)] max-w-md mb-6">{message}</p>
      <div className="flex gap-3">
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>
        )}
        {onDismiss && (
          <Button variant="secondary" onClick={onDismiss}>
            Dismiss
          </Button>
        )}
      </div>
    </motion.div>
  )
}
