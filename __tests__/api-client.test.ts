import { describe, it, expect, vi, beforeEach } from 'vitest'

// Both mocks must be declared before importing the module under test so that
// vitest's hoisting replaces the real modules when api-client.ts is loaded.
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('@/lib/auth-cookie', () => ({
  getAuthToken: vi.fn(),
}))

import { redirect } from 'next/navigation'
import { getAuthToken } from '@/lib/auth-cookie'
import { apiFetch } from '@/lib/api-client'

describe('apiFetch — centralised 401 redirect', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Simulate Next.js: redirect() throws so execution stops, matching real behaviour.
    vi.mocked(redirect).mockImplementation((path) => {
      throw new Error(`NEXT_REDIRECT:${path}`)
    })
  })

  it('redirects to /login when no token is stored', async () => {
    vi.mocked(getAuthToken).mockResolvedValue(undefined)

    await expect(apiFetch('/api/me')).rejects.toThrow('NEXT_REDIRECT:/login')
    expect(redirect).toHaveBeenCalledWith('/login')
  })

  it('redirects to /login when the protected API returns 401', async () => {
    vi.mocked(getAuthToken).mockResolvedValue('valid-token')
    global.fetch = vi.fn().mockResolvedValue({ status: 401 })

    await expect(apiFetch('/api/me')).rejects.toThrow('NEXT_REDIRECT:/login')
    expect(redirect).toHaveBeenCalledWith('/login')
  })

  it('returns the response and does NOT redirect when the API returns 200', async () => {
    vi.mocked(getAuthToken).mockResolvedValue('valid-token')
    const mockResponse = { status: 200, ok: true }
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    const res = await apiFetch('/api/me')

    expect(redirect).not.toHaveBeenCalled()
    expect(res).toBe(mockResponse)
  })
})
