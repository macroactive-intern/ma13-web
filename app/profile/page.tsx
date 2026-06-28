import { apiFetch } from '@/lib/api-client'
import ChangePasswordForm from '@/components/ChangePasswordForm'
import LogoutButton from '@/components/LogoutButton'

type User = { id?: number; name?: string; email?: string }

export default async function ProfilePage() {
  let user: User = {}
  let apiError: string | null = null

  try {
    const res = await apiFetch('/api/me')
    user = await res.json()
  } catch (err: unknown) {
    // Re-throw Next.js redirect/not-found signals so navigation still works.
    if (err instanceof Error && 'digest' in err) throw err
    apiError = 'Unable to load profile.'
  }

  return (
    <main className="min-h-screen p-8 max-w-lg mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
        <LogoutButton />
      </div>

      {apiError && <p className="text-red-600 text-sm">{apiError}</p>}

      <section className="flex flex-col gap-2">
        <p><span className="font-medium">Name:</span> {user.name ?? '—'}</p>
        <p><span className="font-medium">Email:</span> {user.email ?? '—'}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Change password</h2>
        <ChangePasswordForm />
      </section>
    </main>
  )
}
