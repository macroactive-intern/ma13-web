import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

async function fillAndSubmit(password = 'secret123') {
  await userEvent.type(screen.getByLabelText('Email'), 'alice@example.com')
  await userEvent.type(screen.getByLabelText('Password'), password)
  await userEvent.click(screen.getByRole('button', { name: /log in/i }))
}

describe('LoginForm', () => {
  let mockPush: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockPush = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>)
  })

  it('redirects to /profile on successful login', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    })

    render(<LoginForm />)
    await fillAndSubmit()

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/profile'))
  })

  it('shows a network error when fetch throws', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'))

    render(<LoginForm />)
    await fillAndSubmit()

    await waitFor(() =>
      expect(screen.getByText('Network error. Please try again.')).toBeInTheDocument()
    )
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('shows the invalid credentials message on 422', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: () => Promise.resolve({ message: 'The provided credentials are incorrect.' }),
    })

    render(<LoginForm />)
    await fillAndSubmit('wrongpassword')

    await waitFor(() =>
      expect(screen.getByText('The provided credentials are incorrect.')).toBeInTheDocument()
    )
    expect(mockPush).not.toHaveBeenCalled()
  })
})
