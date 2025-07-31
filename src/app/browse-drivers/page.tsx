'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Star, MapPin, Clock, Car } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { vehicleTypes } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

interface DriverProfile {
  id: string
  user_id: string
  experience_years: number
  vehicle_types: string[]
  location: string
  bio: string
  profile_image_url: string
  rating: number
  total_ratings: number
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

// Vehicle type helpers (currently unused but may be needed for future features)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export default function BrowseDrivers() {
  const [drivers, setDrivers] = useState<DriverProfile[]>([])
  const [filteredDrivers, setFilteredDrivers] = useState<DriverProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVehicleType, setSelectedVehicleType] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [minExperience, setMinExperience] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const fetchDrivers = async () => {
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
          .eq('status', 'approved')
          .order('rating', { ascending: false })

        if (error) {
          console.error('Error fetching drivers:', error)
          return
        }

        setDrivers(data || [])
        setFilteredDrivers(data || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDrivers()
  }, [supabase])

  useEffect(() => {
    let filtered = drivers

    // Search by name or location
    if (searchTerm) {
      filtered = filtered.filter(driver =>
        driver.users.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by vehicle type
    if (selectedVehicleType) {
      filtered = filtered.filter(driver =>
        driver.vehicle_types.includes(selectedVehicleType)
      )
    }

    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(driver =>
        driver.location.toLowerCase().includes(selectedLocation.toLowerCase())
      )
    }

    // Filter by experience
    if (minExperience > 0) {
      filtered = filtered.filter(driver =>
        driver.experience_years >= minExperience
      )
    }

    setFilteredDrivers(filtered)
  }, [drivers, searchTerm, selectedVehicleType, selectedLocation, minExperience])

  const getVehicleTypeLabel = (typeId: string) => {
    return vehicleTypes.find(type => type.id === typeId)?.label || typeId
  }

  const getVehicleTypeIcon = (typeId: string) => {
    return vehicleTypes.find(type => type.id === typeId)?.icon || '🚗'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading drivers...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Driver
          </h1>
          <p className="text-xl text-gray-600">
            Browse through our verified and experienced drivers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  value={selectedVehicleType}
                  onChange={(e) => setSelectedVehicleType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Vehicle Types</option>
                  {vehicleTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter city or state"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Experience
                </label>
                <select
                  value={minExperience}
                  onChange={(e) => setMinExperience(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Any Experience</option>
                  <option value={1}>1+ Years</option>
                  <option value={3}>3+ Years</option>
                  <option value={5}>5+ Years</option>
                  <option value={10}>10+ Years</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDrivers.length} of {drivers.length} drivers
          </p>
        </div>

        {/* Drivers Grid */}
        {filteredDrivers.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No drivers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDrivers.map((driver) => (
              <div key={driver.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Profile Image */}
                <div className="h-48 bg-gray-200 relative">
                  {driver.profile_image_url ? (
                    <Image
                      src={getPublicUrl(supabase, driver.profile_image_url) || '/placeholder-avatar.png'}
                      alt={driver.users.full_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">
                          {driver.users.full_name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Driver Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {driver.users.full_name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{driver.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{driver.experience_years} years experience</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(driver.rating) ? 'fill-current' : ''
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {driver.rating > 0 ? driver.rating.toFixed(1) : 'New'} 
                      {driver.total_ratings > 0 && ` (${driver.total_ratings} reviews)`}
                    </span>
                  </div>

                  {/* Vehicle Types */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Vehicle Types:</p>
                    <div className="flex flex-wrap gap-2">
                      {driver.vehicle_types.slice(0, 3).map((type) => (
                        <span
                          key={type}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {getVehicleTypeIcon(type)} <span className="ml-1">{getVehicleTypeLabel(type)}</span>
                        </span>
                      ))}
                      {driver.vehicle_types.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{driver.vehicle_types.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {driver.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {driver.bio}
                    </p>
                  )}

                  {/* Contact Button */}
                  <Link
                    href={`/driver/${driver.id}`}
                    className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors block"
                  >
                    View Profile & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
