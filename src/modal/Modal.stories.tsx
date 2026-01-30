import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Modal } from './Modal'

function DemoModal() {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Demo">
        Modal content
      </Modal>
    </div>
  )
}

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof Modal>

export const Basic: Story = {
  render: () => <DemoModal />
}
