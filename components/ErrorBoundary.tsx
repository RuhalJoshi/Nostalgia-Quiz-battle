'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-retro-dark">
          <div className="neon-card max-w-2xl">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong</h1>
            <p className="text-gray-300 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="bg-retro-darker p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-400 mb-2">Common fixes:</p>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                <li>Check that your .env.local file exists and has all required variables</li>
                <li>Verify your Supabase credentials are correct</li>
                <li>Make sure the database schema is set up</li>
                <li>Restart your dev server after changing environment variables</li>
              </ul>
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined })
                window.location.reload()
              }}
              className="neon-button"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

