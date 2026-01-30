import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders when open', () => {
    render(
      <Modal open onClose={() => undefined} title="Title">
        Content
      </Modal>
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('calls onClose on backdrop click', () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose}>
        Content
      </Modal>
    )

    const backdrop = document.querySelector('.ui-modal__backdrop') as HTMLElement
    backdrop.click()
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
