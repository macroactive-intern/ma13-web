import { getAuthToken, clearAuthCookie } from '@/lib/auth-cookie'

export async function POST() {
  const apiUrl = process.env.LARAVEL_API_URL
  const token = await getAuthToken()

  if (token && apiUrl) {
    try {
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      })
    } catch {
      // Backend logout failed — clear the local cookie anyway so the user
      // is not stuck in a logged-in state client-side.
    }
  }

  await clearAuthCookie()
  return Response.json({ ok: true })
}
