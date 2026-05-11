import { cn } from '@/lib/cn'

export function GlowDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent',
        className,
      )}
    />
  )
}
