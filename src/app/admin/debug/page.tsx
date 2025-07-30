'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface User {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

interface DriverProfile {
  id: string
  user_id: string
  status: string
  experience_years: number
  vehicle_types: string[]
  created_at: string
}

export default function DatabaseDebugPage() {
  const [users, setUsers] = useState<User[]>([])
  const [driverProfiles, setDriverProfiles] = useState<DriverProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        // Check users table
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })

        if (usersError) {
          setError(`Users table error: ${usersError.message}`)
          return
        }

        // Check driver_profiles table
        const { data: profilesData, error: profilesError } = await supabase
          .from('driver_profiles')
          .select('*')
          .order('created_at', { ascending: false })

        if (profilesError) {
          setError(`Driver profiles error: ${profilesError.message}`)
          return
        }

        setUsers(usersData || [])
        setDriverProfiles(profilesData || [])
      } catch (err) {
        setError(`General error: ${err}`)
      } finally {
        setLoading(false)
      }
    }

    checkDatabase()
  }, [supabase])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Debug Page</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-medium text-red-800 mb-2">❌ Error</h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Users Table ({users.length} records)
        </h2>
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user: User) => (
                  <tr key={user.id}>
                    <td className="px-4 py-4 text-sm text-gray-900 font-mono">{user.id.slice(0, 8)}...</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{user.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{user.full_name}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'driver' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Driver Profiles Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Driver Profiles Table ({driverProfiles.length} records)
        </h2>
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle Types</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {driverProfiles.map((profile: DriverProfile) => (
                  <tr key={profile.id}>
                    <td className="px-4 py-4 text-sm text-gray-900 font-mono">{profile.id.slice(0, 8)}...</td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-mono">{profile.user_id.slice(0, 8)}...</td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded text-xs ${
                        profile.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        profile.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {profile.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{profile.experience_years} years</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{profile.vehicle_types?.join(', ')}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">📊 Summary</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Total Users: {users.length}</li>
          <li>• Total Driver Profiles: {driverProfiles.length}</li>
          <li>• Pending Profiles: {driverProfiles.filter((p: DriverProfile) => p.status === 'pending').length}</li>
          <li>• Approved Profiles: {driverProfiles.filter((p: DriverProfile) => p.status === 'approved').length}</li>
          <li>• Rejected Profiles: {driverProfiles.filter((p: DriverProfile) => p.status === 'rejected').length}</li>
        </ul>
      </div>
    </div>
  )
}
