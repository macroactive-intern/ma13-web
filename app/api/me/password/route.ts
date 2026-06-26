import { NextRequest } from 'next/server'
import { getAuthToken } from '@/lib/auth-cookie'

export async function PUT(request: NextRequest) {
  const apiUrl = process.env.LARAVEL_API_URL
  if (!apiUrl) {
    return Response.json({ message: 'Server misconfiguration.' }, { status: 500 })
  }

  const token = await getAuthToken()

  if (!token) {
    return Response.json({ message: 'Unauthenticated.' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ message: 'Invalid request body.' }, { status: 400 })
  }

  let res: Response
  try {
    res = await fetch(`${apiUrl}/api/me/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
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
