import { NextRequest } from 'next/server'
import { setAuthCookie } from '@/lib/auth-cookie'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (res.ok) {
    await setAuthCookie(data.token)
    return Response.json({ ok: true })
  }

  return Response.json(data, { status: res.status })
}
