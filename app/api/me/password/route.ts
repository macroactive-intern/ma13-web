import { NextRequest } from 'next/server'
import { proxyAuthenticatedRequest } from '@/lib/proxy-request'

export async function PUT(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ message: 'Invalid request body.' }, { status: 400 })
  }

  return proxyAuthenticatedRequest('/api/me/password', {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}
