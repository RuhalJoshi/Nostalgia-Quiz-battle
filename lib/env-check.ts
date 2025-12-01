// Environment variable validation
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing.join(', '))
    console.error('Please create a .env.local file with your Supabase credentials')
    return false
  }

  return true
}

