'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { User, Menu, X, Car, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{
    id: string
    email?: string
  } | null>(null)
  const [userProfile, setUserProfile] = useState<{
    full_name: string
    role: string
  } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        setUserProfile(profile)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        setUserProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Hire Drive</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse-drivers" className="text-gray-700 hover:text-blue-600 transition-colors">
              Browse Drivers
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                {userProfile?.role === 'admin' && (
                  <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Admin Panel
                  </Link>
                )}
                {userProfile?.role === 'driver' && (
                  <Link href="/driver/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Driver Dashboard
                  </Link>
                )}
                {userProfile?.role === 'customer' && (
                  <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                    My Bookings
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{userProfile?.full_name}</span>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-700 hover:text-red-600 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/admin/login" className="text-gray-700 hover:text-blue-600 transition-colors text-sm">
                  Admin
                </Link>
                <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              href="/browse-drivers"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Browse Drivers
            </Link>
            {user ? (
              <>
                {userProfile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                {userProfile?.role === 'driver' && (
                  <Link
                    href="/driver/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Driver Dashboard
                  </Link>
                )}
                {userProfile?.role === 'customer' && (
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    My Bookings
                  </Link>
                )}
                <div className="px-3 py-2 text-gray-700">
                  Welcome, {userProfile?.full_name}
                </div>
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/admin/login"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Login
                </Link>
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-3 py-2 text-blue-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
