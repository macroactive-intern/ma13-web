import { NextRequest } from 'next/server'
import { getAuthToken } from '@/lib/auth-cookie'

export async function PUT(request: NextRequest) {
  const token = await getAuthToken()

  if (!token) {
    return Response.json({ message: 'Unauthenticated.' }, { status: 401 })
  }

  const body = await request.json()

  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/me/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
