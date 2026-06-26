import { redirect } from 'next/navigation'
import { getAuthToken } from '@/lib/auth-cookie'

export default async function Home() {
  const token = await getAuthToken()
  redirect(token ? '/profile' : '/login')
}
