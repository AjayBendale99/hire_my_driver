'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

export default function NavigationHelper() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profileData)
      }
      
      setLoading(false)
    }
    
    getUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Navigation Helper</h1>

        {!user ? (
          // Not logged in
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🔐 You need to log in first</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded border-l-4 border-blue-500">
                <h3 className="font-medium text-blue-900">New User? Sign Up First</h3>
                <p className="text-blue-700 text-sm mt-1">Create a new driver account</p>
                <Link 
                  href="/auth/signup?role=driver"
                  className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Sign Up as Driver
                </Link>
              </div>
              
              <div className="p-4 bg-green-50 rounded border-l-4 border-green-500">
                <h3 className="font-medium text-green-900">Existing User? Log In</h3>
                <p className="text-green-700 text-sm mt-1">Use your existing credentials</p>
                <Link 
                  href="/auth/login"
                  className="inline-block mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Logged in
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ✅ Welcome, {profile?.full_name || user.email}!
            </h2>
            
            <div className="grid gap-4">
              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium text-gray-900">Your Account Info</h3>
                <div className="text-sm text-gray-600 mt-2">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {profile?.role || 'Unknown'}</p>
                  <p><strong>User ID:</strong> {user.id}</p>
                </div>
              </div>

              {profile?.role === 'driver' && (
                <div className="p-4 bg-green-50 rounded border-l-4 border-green-500">
                  <h3 className="font-medium text-green-900">Driver Actions</h3>
                  <div className="mt-2 space-x-2">
                    <Link 
                      href="/driver/register"
                      className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Complete Driver Registration
                    </Link>
                    <Link 
                      href="/driver/dashboard"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Driver Dashboard
                    </Link>
                  </div>
                </div>
              )}

              <div className="p-4 bg-purple-50 rounded border-l-4 border-purple-500">
                <h3 className="font-medium text-purple-900">Admin/Debug Tools</h3>
                <div className="mt-2 space-x-2 space-y-2">
                  <Link 
                    href="/admin/database"
                    className="inline-block bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                  >
                    View Database
                  </Link>
                  <Link 
                    href="/admin/drivers"
                    className="inline-block bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                  >
                    Admin Dashboard
                  </Link>
                  <Link 
                    href="/admin/quick-debug"
                    className="inline-block bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                  >
                    Quick Debug
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  )
}
