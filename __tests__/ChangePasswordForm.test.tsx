import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChangePasswordForm from '@/components/ChangePasswordForm'

async function fillAndSubmit(current = 'oldpassword', next = 'newpassword') {
  await userEvent.type(screen.getByLabelText('Current password'), current)
  await userEvent.type(screen.getByLabelText('New password'), next)
  await userEvent.type(screen.getByLabelText('Confirm new password'), next)
  await userEvent.click(screen.getByRole('button', { name: /update password/i }))
}

describe('ChangePasswordForm', () => {
  it('shows error when current password is wrong', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: () => Promise.resolve({ message: 'The current password is incorrect.' }),
    })

    render(<ChangePasswordForm />)
    await fillAndSubmit('wrongpassword')

    await waitFor(() =>
      expect(screen.getByText('The current password is incorrect.')).toBeInTheDocument()
    )
  })

  it('shows success message and clears the form on success', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Password updated successfully.' }),
    })

    render(<ChangePasswordForm />)
    await fillAndSubmit()

    await waitFor(() =>
      expect(screen.getByText('Password updated successfully.')).toBeInTheDocument()
    )

    expect((screen.getByLabelText('Current password') as HTMLInputElement).value).toBe('')
  })
})
