import type { ButtonHTMLAttributes } from 'react'

type Variant = 'default' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const VARIANT_CLASSES: Record<Variant, string> = {
  default: 'bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400',
  outline: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 disabled:opacity-50',
  ghost: 'bg-transparent text-slate-900 hover:bg-slate-100 disabled:opacity-50'
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  icon: 'h-8 w-8 p-0 text-sm'
}

function cn(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function Button({
  variant = 'default',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    />
  )
}
