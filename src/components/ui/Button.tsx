'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  href?: string
  target?: string
  rel?: string
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 whitespace-nowrap border border-transparent'

/* text-[#08080a] é usado em vez de text-base porque text-base em Tailwind
   é uma classe de tamanho de fonte (1rem), não de cor */
const variants = {
  primary:
    'btn-shimmer bg-[#f4f4f5] text-[#08080a] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_20px_-4px_rgba(0,0,0,0.3)] hover:bg-white hover:shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_8px_32px_-8px_rgba(99,102,241,0.35)]',
  accent:
    'btn-shimmer bg-accent text-[#08080a] shadow-[0_0_0_1px_rgba(99,102,241,0.45),0_8px_32px_-8px_rgba(99,102,241,0.35)] hover:bg-indigo-400 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.60),0_12px_40px_-8px_rgba(99,102,241,0.45)]',
  secondary:
    'bg-transparent border-white/10 text-[#f4f4f5] hover:border-white/25 hover:bg-white/[0.06] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
  ghost:
    'text-[#b6b6bf] hover:text-[#f4f4f5] border-white/10 hover:border-white/20 hover:bg-white/[0.03]',
}

const sizes = {
  sm: 'px-4 h-[34px] text-[13px]',
  md: 'px-5 h-[38px] text-[13.5px]',
  lg: 'px-[22px] h-11 text-[14px]',
}

const tapAnim = { scale: 0.975 }
const hoverPrimary = { scale: 1.02, y: -1 }
const hoverDefault = { scale: 1.015 }

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  href,
  target,
  rel,
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className)
  const hoverAnim = variant === 'primary' || variant === 'accent' ? hoverPrimary : hoverDefault

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={hoverAnim}
        whileTap={tapAnim}
        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
        target={target}
        rel={rel}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      type="button"
      className={classes}
      whileHover={hoverAnim}
      whileTap={tapAnim}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}
