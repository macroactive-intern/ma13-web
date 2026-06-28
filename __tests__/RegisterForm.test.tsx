import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import RegisterForm from '@/components/RegisterForm'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

describe('RegisterForm', () => {
  let mockPush: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockPush = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>)
  })

  async function fillAndSubmit() {
    await userEvent.type(screen.getByLabelText('Name'), 'Alice')
    await userEvent.type(screen.getByLabelText('Email'), 'alice@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'secret123')
    await userEvent.type(screen.getByLabelText('Confirm password'), 'secret123')
    await userEvent.click(screen.getByRole('button', { name: /register/i }))
  }

  it('redirects to /profile on successful registration', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    })

    render(<RegisterForm />)
    await fillAndSubmit()

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/profile'))
  })

  it('shows a network error when fetch throws', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'))

    render(<RegisterForm />)
    await fillAndSubmit()

    await waitFor(() =>
      expect(screen.getByText('Network error. Please try again.')).toBeInTheDocument()
    )
  })

  it('shows a field error when email is already taken', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: () =>
        Promise.resolve({
          message: 'The email has already been taken.',
          errors: { email: ['The email has already been taken.'] },
        }),
    })

    render(<RegisterForm />)
    await fillAndSubmit()

    await waitFor(() =>
      expect(screen.getByText('The email has already been taken.')).toBeInTheDocument()
    )
  })
})
