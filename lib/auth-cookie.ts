import { cookies } from 'next/headers'

const COOKIE_NAME = 'auth_token'

export async function setAuthCookie(token: string): Promise<void> {
  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export async function clearAuthCookie(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function getAuthToken(): Promise<string | undefined> {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value
}
