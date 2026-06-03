import { useState, useCallback, type ReactNode } from 'react'
import { GripVertical } from 'lucide-react'
import { cn } from '../../utils/cn'

interface DraggableListProps<T> {
  items: T[]
  keyExtractor: (item: T, index: number) => string
  onReorder: (from: number, to: number) => void
  renderItem: (item: T, index: number, isDragging: boolean) => ReactNode
  className?: string
}

export function DraggableList<T>({
  items,
  keyExtractor,
  onReorder,
  renderItem,
  className,
}: DraggableListProps<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault()
      if (dragIndex !== null && dragIndex !== index) setOverIndex(index)
    },
    [dragIndex],
  )

  const handleDrop = useCallback(
    (index: number) => {
      if (dragIndex !== null && dragIndex !== index) {
        onReorder(dragIndex, index)
      }
      setDragIndex(null)
      setOverIndex(null)
    },
    [dragIndex, onReorder],
  )

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
    setOverIndex(null)
  }, [])

  return (
    <div className={cn('space-y-1', className)}>
      {items.map((item, i) => (
        <div
          key={keyExtractor(item, i)}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={() => handleDrop(i)}
          onDragEnd={handleDragEnd}
          className={cn(
            'flex items-center gap-2 transition-opacity',
            dragIndex === i && 'opacity-50',
            overIndex === i && 'ring-1 ring-[var(--color-accent)]/40 rounded-xl',
          )}
        >
          <div
            className="cursor-grab active:cursor-grabbing p-1 touch-none shrink-0"
            aria-hidden
          >
            <GripVertical className="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
          <div className="flex-1 min-w-0">{renderItem(item, i, dragIndex === i)}</div>
        </div>
      ))}
    </div>
  )
}
