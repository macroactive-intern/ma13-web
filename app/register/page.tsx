import RegisterForm from '@/components/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Create account</h1>
        <RegisterForm />
        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 underline">Log in</Link>
        </p>
      </div>
    </main>
  )
}
