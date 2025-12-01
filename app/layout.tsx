import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nostalgia Quiz Battle',
  description: 'Real-time multiplayer quiz game with neon-retro theme',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

