import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

describe('LoginForm', () => {
  let mockPush: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockPush = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as ReturnType<typeof useRouter>)
  })

  it('redirects to /profile on successful login', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    })

    render(<LoginForm />)

    await userEvent.type(screen.getByLabelText('Email'), 'alice@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'secret123')
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/profile'))
  })

  it('shows the invalid credentials message on 422', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: () => Promise.resolve({ message: 'The provided credentials are incorrect.' }),
    })

    render(<LoginForm />)

    await userEvent.type(screen.getByLabelText('Email'), 'alice@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'wrongpassword')
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() =>
      expect(screen.getByText('The provided credentials are incorrect.')).toBeInTheDocument()
    )
  })
})
