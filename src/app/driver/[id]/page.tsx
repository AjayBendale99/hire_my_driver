'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Star, MapPin, Clock, Car, Phone, Mail, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface DriverProfile {
  id: string
  user_id: string
  experience_years: number
  vehicle_types: string[]
  license_number: string
  location: string
  bio: string
  profile_image_url: string
  rating: number
  total_ratings: number
  status: string
  users: {
    full_name: string
    email: string
    phone: string
  }
}

// Utility function to get public URL from Supabase storage
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

// Vehicle type helpers
const getVehicleTypeLabel = (type: string) => {
  const vehicleTypes: Record<string, string> = {
    'car': 'Car',
    'bike': 'Motorcycle/Bike',
    'auto': 'Auto Rickshaw',
    'taxi': 'Taxi',
    'truck': 'Truck',
    'bus': 'Bus',
    'tempo': 'Tempo',
    'jcb': 'JCB/Heavy Machinery',
    'private_jet': 'Private Jet',
    'other': 'Other Vehicle'
  }
  return vehicleTypes[type] || type
}

const getVehicleTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    'car': '🚗',
    'bike': '🏍️',
    'auto': '🛺',
    'taxi': '🚖',
    'truck': '🚛',
    'bus': '🚌',
    'tempo': '🚐',
    'jcb': '🚜',
    'private_jet': '✈️',
    'other': '🚙'
  }
  return icons[type] || '🚙'
}

export default function DriverProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [driver, setDriver] = useState<DriverProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState<{
    id: string
    email?: string
  } | null>(null)
  
  const supabase = createClient()
  const driverId = params.id as string

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }

    getCurrentUser()
  }, [supabase])

  useEffect(() => {
    const fetchDriver = async () => {
      if (!driverId) return

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
          .eq('id', driverId)
          .eq('status', 'approved')
          .single()

        if (error) {
          console.error('Error fetching driver:', error)
          setError('Driver not found or not approved yet.')
          return
        }

        setDriver(data)
      } catch (error) {
        console.error('Error:', error)
        setError('Failed to load driver profile.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDriver()
  }, [driverId, supabase])

  const handleBookDriver = () => {
    if (!currentUser) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/driver/${driverId}`))
      return
    }

    // For now, we'll just show contact info. In a full implementation,
    // you might create a booking system
    alert(`To book ${driver?.users.full_name}, please contact them directly using the contact information provided.`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading driver profile...</p>
        </div>
      </div>
    )
  }

  if (error || !driver) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Driver Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The driver profile you are looking for does not exist.'}</p>
            <Link
              href="/browse-drivers"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse Drivers
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/browse-drivers"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse Drivers
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-12 text-white">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {driver.profile_image_url ? (
                    <Image
                      src={getPublicUrl(supabase, driver.profile_image_url) || '/placeholder-avatar.png'}
                      alt={driver.users.full_name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                      <span className="text-4xl font-bold text-blue-600">
                        {driver.users.full_name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Driver Info */}
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{driver.users.full_name}</h1>
                <div className="flex items-center justify-center md:justify-start text-blue-100 mb-3">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{driver.location}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start text-blue-100 mb-4">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{driver.experience_years} years of experience</span>
                </div>
                
                {/* Rating */}
                <div className="flex items-center justify-center md:justify-start">
                  <div className="flex text-yellow-300">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(driver.rating) ? 'fill-current' : ''
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-blue-100">
                    {driver.rating > 0 ? driver.rating.toFixed(1) : 'New Driver'}
                    {driver.total_ratings > 0 && ` (${driver.total_ratings} reviews)`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* About Section */}
                {driver.bio && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                    <p className="text-gray-600 leading-relaxed">{driver.bio}</p>
                  </div>
                )}

                {/* Vehicle Types */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Types</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {driver.vehicle_types.map((type) => (
                      <div
                        key={type}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
                      >
                        <div className="text-2xl mb-2">{getVehicleTypeIcon(type)}</div>
                        <div className="text-sm font-medium text-blue-900">
                          {getVehicleTypeLabel(type)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <Car className="h-8 w-8 text-blue-600 mr-4" />
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {driver.experience_years} Years of Professional Driving
                        </p>
                        <p className="text-gray-600">
                          Licensed driver with verified credentials
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Contact & Book</h3>
                  
                  {/* Contact Info */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">{driver.users.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">{driver.users.email}</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={handleBookDriver}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Book This Driver
                  </button>

                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Click to get contact information and book directly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
