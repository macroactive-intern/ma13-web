import { getAuthToken } from '@/lib/auth-cookie'

export async function GET() {
  const token = await getAuthToken()

  if (!token) {
    return Response.json({ message: 'Unauthenticated.' }, { status: 401 })
  }

  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/me`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
