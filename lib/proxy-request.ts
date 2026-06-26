import { setAuthCookie } from '@/lib/auth-cookie'

export async function proxyAuthRequest(apiPath: string, body: unknown): Promise<Response> {
  const apiUrl = process.env.LARAVEL_API_URL
  if (!apiUrl) {
    return Response.json({ message: 'Server misconfiguration.' }, { status: 500 })
  }

  let res: Response
  try {
    res = await fetch(`${apiUrl}${apiPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    return Response.json({ message: 'Service unavailable.' }, { status: 503 })
  }

  let data: Record<string, unknown>
  try {
    data = await res.json()
  } catch {
    return Response.json({ message: 'Unexpected response from server.' }, { status: 502 })
  }

  if (res.ok) {
    if (typeof data.token !== 'string') {
      return Response.json({ message: 'Unexpected response from server.' }, { status: 502 })
    }
    await setAuthCookie(data.token)
    return Response.json({ ok: true })
  }

  return Response.json(data, { status: res.status })
}
