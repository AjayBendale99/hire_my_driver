'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function DatabaseViewerPage() {
  const [users, setUsers] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUser(user)

        // Get all users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })

        if (usersError) {
          console.error('Users error:', usersError)
        } else {
          setUsers(usersData || [])
        }

        // Get all driver profiles
        const { data: driversData, error: driversError } = await supabase
          .from('driver_profiles')
          .select(`
            *,
            users (
              full_name,
              email,
              phone
            )
          `)
          .order('created_at', { ascending: false })

        if (driversError) {
          console.error('Drivers error:', driversError)
        } else {
          setDrivers(driversData || [])
        }

      } catch (error) {
        console.error('Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading database records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Records</h1>

        {/* Current User Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Current User</h2>
          {currentUser ? (
            <div className="text-sm text-blue-700">
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>ID:</strong> {currentUser.id}</p>
              <p><strong>Confirmed:</strong> {currentUser.email_confirmed_at ? 'Yes' : 'No'}</p>
            </div>
          ) : (
            <p className="text-blue-700">Not logged in</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Users Table */}
          <div className="bg-white rounded-lg shadow border">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">
                Users Table ({users.length} records)
              </h2>
            </div>
            <div className="p-4">
              {users.length === 0 ? (
                <p className="text-gray-500 italic">No users found</p>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                      <div className="text-sm">
                        <p><strong>Name:</strong> {user.full_name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> 
                          <span className={`ml-1 px-2 py-1 rounded text-xs ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'driver' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Driver Profiles Table */}
          <div className="bg-white rounded-lg shadow border">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">
                Driver Profiles ({drivers.length} records)
              </h2>
            </div>
            <div className="p-4">
              {drivers.length === 0 ? (
                <p className="text-gray-500 italic">No driver profiles found</p>
              ) : (
                <div className="space-y-3">
                  {drivers.map((driver) => (
                    <div key={driver.id} className="p-3 bg-gray-50 rounded border-l-4 border-green-500">
                      <div className="text-sm">
                        <p><strong>Driver:</strong> {driver.users?.full_name || 'Unknown'}</p>
                        <p><strong>Email:</strong> {driver.users?.email || 'Unknown'}</p>
                        <p><strong>Experience:</strong> {driver.experience_years} years</p>
                        <p><strong>Vehicles:</strong> {driver.vehicle_types?.join(', ') || 'None'}</p>
                        <p><strong>Location:</strong> {driver.location}</p>
                        <p><strong>Status:</strong> 
                          <span className={`ml-1 px-2 py-1 rounded text-xs ${
                            driver.status === 'approved' ? 'bg-green-100 text-green-800' :
                            driver.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {driver.status}
                          </span>
                        </p>
                        <p><strong>License:</strong> {driver.license_number}</p>
                        <p><strong>Created:</strong> {new Date(driver.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">🚀 Next Steps</h3>
          <ol className="text-yellow-700 text-sm list-decimal list-inside space-y-1">
            <li>Create a real account: <a href="/auth/signup?role=driver" className="underline">Sign up as driver</a></li>
            <li>Complete driver registration: <a href="/driver/register" className="underline">Driver registration</a></li>
            <li>Check admin dashboard: <a href="/admin/drivers" className="underline">Admin dashboard</a></li>
            <li>Refresh this page to see new records</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
