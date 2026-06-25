import LoginForm from '@/components/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Log in</h1>
        <LoginForm />
        <p className="text-sm text-center">
          No account?{' '}
          <Link href="/register" className="text-blue-600 underline">Register</Link>
        </p>
      </div>
    </main>
  )
}
