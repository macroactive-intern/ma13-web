'use client'

import { useState, FormEvent, useRef } from 'react'

export default function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [pending, setPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setPending(true)

    const form = new FormData(e.currentTarget)

    const res = await fetch('/api/me/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current_password: form.get('current_password'),
        new_password: form.get('new_password'),
        new_password_confirmation: form.get('new_password_confirmation'),
      }),
    })

    setPending(false)

    if (res.ok) {
      setSuccess(true)
      formRef.current?.reset()
      return
    }

    const data = await res.json()
    setError(data.message ?? 'Failed to update password.')
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">Password updated successfully.</p>}

      <div className="flex flex-col gap-1">
        <label htmlFor="current_password" className="text-sm font-medium">Current password</label>
        <input id="current_password" name="current_password" type="password" required className="border rounded px-3 py-2" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="new_password" className="text-sm font-medium">New password</label>
        <input id="new_password" name="new_password" type="password" required className="border rounded px-3 py-2" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="new_password_confirmation" className="text-sm font-medium">Confirm new password</label>
        <input id="new_password_confirmation" name="new_password_confirmation" type="password" required className="border rounded px-3 py-2" />
      </div>

      <button type="submit" disabled={pending} className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50">
        {pending ? 'Updating…' : 'Update password'}
      </button>
    </form>
  )
}
