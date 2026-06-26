import { getAuthToken } from '@/lib/auth-cookie'

export async function GET() {
  const apiUrl = process.env.LARAVEL_API_URL
  if (!apiUrl) {
    return Response.json({ message: 'Server misconfiguration.' }, { status: 500 })
  }

  const token = await getAuthToken()

  if (!token) {
    return Response.json({ message: 'Unauthenticated.' }, { status: 401 })
  }

  let res: Response
  try {
    res = await fetch(`${apiUrl}/api/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
  } catch {
    return Response.json({ message: 'Service unavailable.' }, { status: 503 })
  }

  let data: unknown
  try {
    data = await res.json()
  } catch {
    return Response.json({ message: 'Unexpected response from server.' }, { status: 502 })
  }

  return Response.json(data, { status: res.status })
}
