'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import AdminProtectedLayout from '@/components/AdminProtectedLayout'

interface DriverProfile {
  id: string
  user_id: string
  experience_years: number
  vehicle_types: string[]
  license_number: string
  license_document_url: string
  aadhar_document_url: string
  profile_image_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  bio: string | null
  location: string
  created_at: string
  users: {
    full_name: string
    email: string
    phone: string
  }
}

// Utility function to ensure proper Supabase public URLs
const getPublicUrl = (supabase: ReturnType<typeof createClient>, path: string | null) => {
  if (!path) return null
  
  // If it's already a full URL, return as is
  if (path.startsWith('http')) return path
  
  // Generate public URL from Supabase storage
  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(path)
  
  return data.publicUrl
}

export default function AdminDriverApproval() {
  const [drivers, setDrivers] = useState<DriverProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const { data, error } = await supabase
          .from('driver_profiles')
          .select(`
            *,
            users (
              full_name,
              email,
              phone
            )
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })

        if (error) throw error
        
        setDrivers(data || [])
      } catch (error) {
        console.error('Error fetching drivers:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDrivers()
  }, [supabase])

  const updateDriverStatus = async (driverId: string, status: 'approved' | 'rejected') => {
    setUpdating(driverId)
    try {
      const { error } = await supabase
        .from('driver_profiles')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', driverId)

      if (error) throw error

      // Remove from pending list
      setDrivers(drivers.filter(d => d.id !== driverId))
      
      alert(`Driver ${status} successfully!`)
    } catch (error) {
      console.error('Error updating driver status:', error)
      alert('Error updating driver status')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <AdminProtectedLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pending drivers...</p>
          </div>
        </div>
      </AdminProtectedLayout>
    )
  }

  return (
    <AdminProtectedLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Driver Approval Dashboard</h1>
        {drivers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              🎉 No pending driver applications!
            </div>
            <p className="text-gray-400 mt-2">All drivers have been reviewed.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {drivers.map((driver) => (
              <div key={driver.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Driver Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {driver.users.full_name}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><span className="font-medium text-gray-900">Email:</span> {driver.users.email}</p>
                      <p><span className="font-medium text-gray-900">Phone:</span> {driver.users.phone}</p>
                      <p><span className="font-medium text-gray-900">Location:</span> {driver.location}</p>
                      <p><span className="font-medium text-gray-900">Experience:</span> {driver.experience_years} years</p>
                      <p><span className="font-medium text-gray-900">License:</span> {driver.license_number}</p>
                      <p><span className="font-medium text-gray-900">Vehicle Types:</span> {driver.vehicle_types.join(', ')}</p>
                      {driver.bio && (
                        <p><span className="font-medium text-gray-900">Bio:</span> {driver.bio}</p>
                      )}
                      <p><span className="font-medium text-gray-900">Applied:</span> {new Date(driver.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Driving License</p>
                        <a 
                          href={getPublicUrl(supabase, driver.license_document_url) || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          View License Document →
                        </a>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Aadhar Card</p>
                        <a 
                          href={getPublicUrl(supabase, driver.aadhar_document_url) || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          View Aadhar Document →
                        </a>
                      </div>

                      {driver.profile_image_url && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Profile Photo</p>
                          <a 
                            href={getPublicUrl(supabase, driver.profile_image_url) || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                          >
                            View Profile Photo →
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => updateDriverStatus(driver.id, 'approved')}
                    disabled={updating === driver.id}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    {updating === driver.id ? 'Updating...' : '✅ Approve Driver'}
                  </button>
                  
                  <button
                    onClick={() => updateDriverStatus(driver.id, 'rejected')}
                    disabled={updating === driver.id}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    {updating === driver.id ? 'Updating...' : '❌ Reject Driver'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminProtectedLayout>
  )
}
