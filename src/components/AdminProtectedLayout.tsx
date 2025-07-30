'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminSession {
  username: string
  loginTime: string
  role: string
}

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const adminSession = localStorage.getItem('adminSession')
        if (!adminSession) {
          router.push('/admin/login')
          return
        }

        const session: AdminSession = JSON.parse(adminSession)
        const loginTime = new Date(session.loginTime)
        const now = new Date()
        const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)

        // Session expires after 8 hours
        if (hoursSinceLogin > 8 || session.role !== 'admin') {
          localStorage.removeItem('adminSession')
          router.push('/admin/login')
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('adminSession')
        router.push('/admin/login')
      }
    }

    checkAdminAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
