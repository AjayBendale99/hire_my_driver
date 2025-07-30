'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DriverDashboardDebug() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [driverProfile, setDriverProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const router = useRouter()
  const supabase = createClientComponentClient()

  const addDebug = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    console.log(message)
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        addDebug('🔍 Starting authentication check...')
        
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          addDebug(`❌ Auth error: ${authError.message}`)
          router.push('/auth/login')
          return
        }
        
        if (!user) {
          addDebug('❌ No user found - redirecting to login')
          router.push('/auth/login')
          return
        }

        addDebug(`✅ User authenticated: ${user.email} (ID: ${user.id})`)
        setUser(user)

        // Test user profile query
        addDebug('🔍 Fetching user profile...')
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          addDebug(`❌ Profile query error: ${profileError.message}`)
          addDebug(`❌ Error code: ${profileError.code}`)
          addDebug(`❌ Error details: ${profileError.details}`)
        } else if (userProfile) {
          addDebug(`✅ User profile found: ${userProfile.full_name} (Role: ${userProfile.role})`)
          setProfile(userProfile)
        } else {
          addDebug('⚠️ No user profile data returned')
        }

        // Test driver profile query
        addDebug('🔍 Fetching driver profile...')
        const { data: driverData, error: driverError } = await supabase
          .from('driver_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (driverError) {
          if (driverError.code === 'PGRST116') {
            addDebug('ℹ️ No driver profile found (not created yet)')
          } else {
            addDebug(`❌ Driver profile error: ${driverError.message}`)
            addDebug(`❌ Error code: ${driverError.code}`)
          }
        } else if (driverData) {
          addDebug(`✅ Driver profile found: Status ${driverData.status}`)
          setDriverProfile(driverData)
        }

        addDebug('✅ Dashboard data loading completed')

      } catch (error) {
        addDebug(`❌ Unexpected error: ${error}`)
        console.error('Dashboard error:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Driver Dashboard Debug</h1>

        {/* Debug Information */}
        <div className="bg-white rounded-lg shadow border mb-6">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Debug Information</h2>
          </div>
          <div className="p-4">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {debugInfo.map((info, index) => (
                <div key={index} className="text-sm font-mono p-2 bg-gray-100 rounded">
                  {info}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Authentication Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow border">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Authentication Status</h2>
            </div>
            <div className="p-4">
              {user ? (
                <div className="space-y-2">
                  <p className="text-sm"><strong>Status:</strong> <span className="text-green-600">✅ Authenticated</span></p>
                  <p className="text-sm"><strong>Email:</strong> {user.email}</p>
                  <p className="text-sm"><strong>ID:</strong> {user.id}</p>
                  <p className="text-sm"><strong>Email Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</p>
                </div>
              ) : (
                <p className="text-red-600">❌ Not authenticated</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Profile Status</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <strong>User Profile:</strong>
                  {profile ? (
                    <span className="text-green-600 ml-2">✅ Found ({profile.role})</span>
                  ) : (
                    <span className="text-red-600 ml-2">❌ Not found</span>
                  )}
                </div>
                <div>
                  <strong>Driver Profile:</strong>
                  {driverProfile ? (
                    <span className="text-green-600 ml-2">✅ Found ({driverProfile.status})</span>
                  ) : (
                    <span className="text-yellow-600 ml-2">⚠️ Not created</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-3">🔧 Quick Actions</h3>
          <div className="space-x-2 space-y-2">
            <Link 
              href="/auth/login"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Login
            </Link>
            <Link 
              href="/nav"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Navigation Helper
            </Link>
            <Link 
              href="/admin/database"
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              View Database
            </Link>
            <Link 
              href="/admin/test-signup"
              className="inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Test Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
