'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Car, User, FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

export default function DriverDashboard() {
  const [profile, setProfile] = useState<{
    full_name: string
    email: string
    phone: string
    role: string
  } | null>(null)
  const [driverProfile, setDriverProfile] = useState<{
    id: string
    experience_years: number
    vehicle_types: string[]
    license_number: string
    status: 'pending' | 'approved' | 'rejected'
    bio?: string
    location: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        // Wait a moment for session to load
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error('Auth error:', error)
          router.push('/auth/login')
          return
        }
        
        if (!user) {
          console.log('No user found, redirecting to login')
          router.push('/auth/login')
          return
        }

        // Get user profile
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Profile error:', profileError)
          setLoading(false)
          return
        }

        setProfile(userProfile)

        // Get driver profile if exists
        const { data: driverData } = await supabase
          .from('driver_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        setDriverProfile(driverData)
        setLoading(false)
      } catch (error) {
        console.error('Dashboard error:', error)
        router.push('/auth/login')
      }
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/auth/login')
          return
        }
        
        if (event === 'SIGNED_IN' && session) {
          // User is signed in, get their data
          getUser()
        }
      }
    )

    // Initial check
    getUser()

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            Pending Review
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Approved
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {profile?.full_name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Status */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Profile Status</h2>
              </div>
              <div className="p-6">
                {!driverProfile ? (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Complete Your Driver Profile
                    </h3>
                    <p className="text-gray-600 mb-4">
                      You haven&apos;t completed your driver registration yet. Complete your profile to start earning as a driver.
                    </p>
                    <Link
                      href="/driver/register"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Complete Registration
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Registration Status</h3>
                      {getStatusBadge(driverProfile.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Experience</label>
                        <p className="mt-1 text-sm text-gray-900">{driverProfile.experience_years} years</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Vehicle Types</label>
                        <p className="mt-1 text-sm text-gray-900">{driverProfile.vehicle_types?.join(', ')}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">License Number</label>
                        <p className="mt-1 text-sm text-gray-900">{driverProfile.license_number}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <p className="mt-1 text-sm text-gray-900">{driverProfile.location}</p>
                      </div>
                    </div>

                    {driverProfile.bio && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        <p className="mt-1 text-sm text-gray-900">{driverProfile.bio}</p>
                      </div>
                    )}

                    {driverProfile.status === 'pending' && (
                      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-700">
                          Your profile is under review. You&apos;ll be notified once it&apos;s approved by our admin team.
                        </p>
                      </div>
                    )}

                    {driverProfile.status === 'rejected' && (
                      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700">
                          Your profile was rejected. Please contact support or update your information.
                        </p>
                        <Link
                          href="/driver/register"
                          className="mt-2 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          Update Profile
                        </Link>
                      </div>
                    )}

                    {driverProfile.status === 'approved' && (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700">
                          🎉 Congratulations! Your profile is approved. You can now start receiving ride requests.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white rounded-lg shadow border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Account Info</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{profile?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{profile?.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{profile?.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  href="/driver/register"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {driverProfile ? 'Edit Profile' : 'Complete Registration'}
                </Link>
                <Link
                  href="/"
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center justify-center"
                >
                  <Car className="w-4 h-4 mr-2" />
                  Browse Platform
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
