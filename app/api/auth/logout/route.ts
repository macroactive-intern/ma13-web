import { getAuthToken, clearAuthCookie } from '@/lib/auth-cookie'

export async function POST() {
  const token = await getAuthToken()

  if (token) {
    await fetch(`${process.env.LARAVEL_API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
  }

  await clearAuthCookie()
  return Response.json({ ok: true })
}
