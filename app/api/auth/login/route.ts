import { NextRequest } from 'next/server'
import { proxyAuthRequest } from '@/lib/proxy-request'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ message: 'Invalid request body.' }, { status: 400 })
  }

  return proxyAuthRequest('/api/auth/login', body)
}
