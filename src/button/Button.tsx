import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const base = 'ui-button'
  const variantClass = `${base}--${variant}`
  const classes = className ? `${base} ${variantClass} ${className}` : `${base} ${variantClass}`

  return <button className={classes} {...props} />
}
