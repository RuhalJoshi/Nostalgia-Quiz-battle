'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [magicLink, setMagicLink] = useState('')
  const [isMagicLink, setIsMagicLink] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: magicLink,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      setMessage('Check your email for the magic link!')
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
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-neon-cyan" />
          <h1 className="text-4xl font-bold neon-text mb-2">Login</h1>
          <p className="text-gray-400">Enter the nostalgia zone</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setIsMagicLink(false)}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              !isMagicLink
                ? 'bg-neon-cyan text-retro-dark'
                : 'bg-retro-darker text-gray-400 hover:text-white'
            }`}
          >
            Password
          </button>
          <button
            onClick={() => setIsMagicLink(true)}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              isMagicLink
                ? 'bg-neon-cyan text-retro-dark'
                : 'bg-retro-darker text-gray-400 hover:text-white'
            }`}
          >
            Magic Link
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-300">
            {message}
          </div>
        )}

        {!isMagicLink ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
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
                className="w-full px-4 py-3 bg-retro-dark border border-neon-cyan/30 rounded-lg focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full neon-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={magicLink}
                onChange={(e) => setMagicLink(e.target.value)}
                required
                className="w-full px-4 py-3 bg-retro-dark border border-neon-cyan/30 rounded-lg focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan"
                placeholder="your@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full neon-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-neon-cyan hover:text-neon-pink">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

