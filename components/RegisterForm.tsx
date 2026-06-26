'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

type FieldErrors = Record<string, string[]>

export default function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setPending(true)

    try {
      const form = new FormData(e.currentTarget)

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          password: form.get('password'),
          password_confirmation: form.get('password_confirmation'),
        }),
      })

      if (res.ok) {
        router.push('/profile')
        return
      }

      const data = await res.json()
      if (data.errors) {
        setFieldErrors(data.errors)
      } else {
        setError(data.message ?? 'Registration failed.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <input id="name" name="name" type="text" required className="border rounded px-3 py-2" />
        {fieldErrors.name && <p className="text-red-600 text-sm">{fieldErrors.name[0]}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" required className="border rounded px-3 py-2" />
        {fieldErrors.email && <p className="text-red-600 text-sm">{fieldErrors.email[0]}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" required className="border rounded px-3 py-2" />
        {fieldErrors.password && <p className="text-red-600 text-sm">{fieldErrors.password[0]}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password_confirmation" className="text-sm font-medium">Confirm password</label>
        <input id="password_confirmation" name="password_confirmation" type="password" required className="border rounded px-3 py-2" />
        {fieldErrors.password_confirmation && (
          <p className="text-red-600 text-sm">{fieldErrors.password_confirmation[0]}</p>
        )}
      </div>

      <button type="submit" disabled={pending} className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50">
        {pending ? 'Registering…' : 'Register'}
      </button>
    </form>
  )
}
