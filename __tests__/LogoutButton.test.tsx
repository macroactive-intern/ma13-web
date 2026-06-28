import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

describe('LogoutButton', () => {
  let mockPush: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockPush = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>)
  })

  it('calls the logout route and redirects to /login', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true })

    render(<LogoutButton />)
    await userEvent.click(screen.getByRole('button', { name: /log out/i }))

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' })
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'))
  })

  it('still redirects to /login when the logout request throws', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'))

    render(<LogoutButton />)
    await userEvent.click(screen.getByRole('button', { name: /log out/i }))

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'))
  })
})
