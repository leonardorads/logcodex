import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'accent' | 'muted'
  className?: string
}

const variants = {
  default: 'bg-surface border border-white/10 text-secondary',
  accent: 'bg-accent/10 border border-accent/25 text-accent',
  muted: 'bg-elevated text-muted',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
