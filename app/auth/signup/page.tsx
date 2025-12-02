'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { UserPlus } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })

      if (signUpError) throw signUpError

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 retro-grid">
      <div className="neon-card w-full max-w-md">
        <div className="text-center mb-8">
          <UserPlus className="w-16 h-16 mx-auto mb-4 text-neon-pink" />
          <h1 className="text-4xl font-bold neon-text mb-2">Sign Up</h1>
          <p className="text-gray-400">Join the battle arena</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 bg-retro-dark border border-neon-cyan/30 rounded-lg focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan"
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-retro-dark border border-neon-cyan/30 rounded-lg focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-retro-dark border border-neon-cyan/30 rounded-lg focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full neon-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-neon-cyan hover:text-neon-pink">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

