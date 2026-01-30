import type { PropsWithChildren } from 'react'

export type ModalProps = PropsWithChildren<{
  open: boolean
  onClose: () => void
  title?: string
}>

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null

  return (
    <div className="ui-modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="ui-modal__backdrop" onClick={onClose} />
      <div className="ui-modal__content">
        {title ? <h2 className="ui-modal__title">{title}</h2> : null}
        <div className="ui-modal__body">{children}</div>
        <button type="button" className="ui-modal__close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
