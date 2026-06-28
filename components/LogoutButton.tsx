'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleLogout() {
    setPending(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // best-effort; redirect regardless so the user is never stuck
    } finally {
      setPending(false)
    }
    router.push('/login')
  }

  return (
    <button onClick={handleLogout} disabled={pending} className="bg-red-600 text-white rounded px-4 py-2 disabled:opacity-50">
      {pending ? 'Logging out…' : 'Log out'}
    </button>
  )
}
