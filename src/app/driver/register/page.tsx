'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, User, MapPin, Car } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { vehicleTypes } from '@/lib/utils'

export default function DriverRegister() {
  const [user, setUser] = useState<{
    id: string
    email?: string
  } | null>(null)
  const [formData, setFormData] = useState({
    experienceYears: '',
    vehicleTypes: [] as string[],
    licenseNumber: '',
    bio: '',
    location: ''
  })
  const [files, setFiles] = useState({
    licenseDocument: null as File | null,
    aadharDocument: null as File | null,
    profileImage: null as File | null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      
      // Check if user role is driver
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (profile?.role !== 'driver') {
        router.push('/dashboard')
        return
      }

      // Check if driver profile already exists
      const { data: driverProfile } = await supabase
        .from('driver_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (driverProfile) {
        router.push('/driver/dashboard')
        return
      }

      setUser(user)
    }

    getUser()
  }, [supabase, router])

  const handleVehicleTypeChange = (vehicleType: string) => {
    setFormData(prev => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(vehicleType)
        ? prev.vehicleTypes.filter(type => type !== vehicleType)
        : [...prev.vehicleTypes, vehicleType]
    }))
  }

  const handleFileChange = (type: keyof typeof files, file: File) => {
    setFiles(prev => ({ ...prev, [type]: file }))
  }

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(path, file)

    if (error) throw error
    
    // Generate public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(data.path)
    
    return publicUrlData.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!files.licenseDocument || !files.aadharDocument) {
      setError('Please upload both driving license and Aadhar card documents.')
      setIsLoading(false)
      return
    }

    if (formData.vehicleTypes.length === 0) {
      setError('Please select at least one vehicle type.')
      setIsLoading(false)
      return
    }

    if (!user) {
      setError('User not authenticated.')
      setIsLoading(false)
      return
    }

    try {
      // First, ensure user record exists in users table
      const { error: userCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userCheckError && userCheckError.code === 'PGRST116') {
        // User doesn't exist, create user record
        const { error: userCreateError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: 'Driver User',
            phone: '+911234567890',
            role: 'driver'
          })

        if (userCreateError) {
          setError('Failed to create user profile. Please try again.')
          console.error('User creation error:', userCreateError)
          setIsLoading(false)
          return
        }
      }

      // Upload documents
      const licenseDocPath = await uploadFile(
        files.licenseDocument,
        `licenses/${user.id}_${Date.now()}_license.${files.licenseDocument.name.split('.').pop()}`
      )

      const aadharDocPath = await uploadFile(
        files.aadharDocument,
        `aadhar/${user.id}_${Date.now()}_aadhar.${files.aadharDocument.name.split('.').pop()}`
      )

      let profileImagePath = null
      if (files.profileImage) {
        profileImagePath = await uploadFile(
          files.profileImage,
          `profiles/${user.id}_${Date.now()}_profile.${files.profileImage.name.split('.').pop()}`
        )
      }

      // Create driver profile
      const { error: profileError } = await supabase
        .from('driver_profiles')
        .insert({
          user_id: user.id,
          experience_years: parseInt(formData.experienceYears),
          vehicle_types: formData.vehicleTypes,
          license_number: formData.licenseNumber,
          license_document_url: licenseDocPath,
          aadhar_document_url: aadharDocPath,
          profile_image_url: profileImagePath,
          bio: formData.bio,
          location: formData.location,
          status: 'pending'
        })

      if (profileError) {
        setError('Failed to create driver profile. Please try again.')
        console.error('Profile creation error:', profileError)
        setIsLoading(false)
        return
      }

      setSuccess('Your driver profile has been submitted for approval. You will be notified once it\'s reviewed.')
      setTimeout(() => {
        router.push('/driver/dashboard')
      }, 2000)

    } catch (error) {
      console.error('Registration error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Car className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Driver Profile</h1>
            <p className="text-gray-600 mt-2">
              Please provide your details and upload required documents to start earning as a driver.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="50"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driving License Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., MH12 20220012345"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Current Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell customers about yourself, your driving experience, and specializations..."
                />
              </div>
            </div>

            {/* Vehicle Types */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Car className="h-5 w-5 mr-2" />
                Vehicle Types You Can Drive
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {vehicleTypes.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${
                      formData.vehicleTypes.includes(vehicle.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleVehicleTypeChange(vehicle.id)}
                  >
                    <div className="text-2xl mb-2">{vehicle.icon}</div>
                    <div className="text-sm font-medium text-gray-900">{vehicle.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Uploads */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Required Documents
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driving License <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileChange('licenseDocument', file)
                      }}
                      className="hidden"
                      id="license-upload"
                    />
                    <label htmlFor="license-upload" className="cursor-pointer">
                      <span className="text-blue-600 font-medium">Upload driving license</span>
                      <p className="text-gray-500 text-sm mt-1">PNG, JPG or PDF up to 5MB</p>
                    </label>
                    {files.licenseDocument && (
                      <p className="text-green-600 text-sm mt-2">
                        ✓ {files.licenseDocument.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Card <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileChange('aadharDocument', file)
                      }}
                      className="hidden"
                      id="aadhar-upload"
                    />
                    <label htmlFor="aadhar-upload" className="cursor-pointer">
                      <span className="text-blue-600 font-medium">Upload Aadhar card</span>
                      <p className="text-gray-500 text-sm mt-1">PNG, JPG or PDF up to 5MB</p>
                    </label>
                    {files.aadharDocument && (
                      <p className="text-green-600 text-sm mt-2">
                        ✓ {files.aadharDocument.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center max-w-md">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileChange('profileImage', file)
                    }}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label htmlFor="profile-upload" className="cursor-pointer">
                    <span className="text-blue-600 font-medium">Upload profile photo</span>
                    <p className="text-gray-500 text-sm mt-1">PNG or JPG up to 2MB</p>
                  </label>
                  {files.profileImage && (
                    <p className="text-green-600 text-sm mt-2">
                      ✓ {files.profileImage.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Submitting for Approval...' : 'Submit for Approval'}
              </button>
              <p className="text-center text-gray-600 text-sm mt-4">
                Your profile will be reviewed by our admin team within 24-48 hours.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
