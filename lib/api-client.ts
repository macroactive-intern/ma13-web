import { redirect } from 'next/navigation'
import { getAuthToken } from '@/lib/auth-cookie'

const LARAVEL_API_URL = process.env.LARAVEL_API_URL
if (!LARAVEL_API_URL) {
  throw new Error('LARAVEL_API_URL environment variable is not set')
}

export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const token = await getAuthToken()

  if (!token) {
    redirect('/login')
  }

  let res: Response
  try {
    res = await fetch(`${LARAVEL_API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
    })
  } catch {
    throw new Error('Service unavailable.')
  }

  if (res.status === 401) {
    redirect('/login')
  }

  return res
}
