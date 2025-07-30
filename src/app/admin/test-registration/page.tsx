'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function RegistrationTestPage() {
  const [status, setStatus] = useState<string>('Starting tests...')
  const [results, setResults] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const supabase = createClientComponentClient()

  const addResult = (message: string) => {
    setResults(prev => [...prev, message])
    setStatus(message)
  }

  useEffect(() => {
    const runTests = async () => {
      addResult('🔍 Testing driver registration flow...')

      try {
        // Test 1: Check current user
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          addResult(`❌ Auth error: ${userError.message}`)
          return
        }

        if (!currentUser) {
          addResult('⚠️ No user logged in - please login first')
          return
        }

        setUser(currentUser)
        addResult(`✅ User authenticated: ${currentUser.email}`)

        // Test 2: Check if user exists in users table
        const { data: userData, error: userTableError } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .single()

        if (userTableError) {
          addResult(`❌ User not found in users table: ${userTableError.message}`)
          
          // Try to create user record
          addResult('🔧 Attempting to create user record...')
          
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: currentUser.id,
              email: currentUser.email || '',
              full_name: currentUser.user_metadata?.full_name || 'Test User',
              phone: currentUser.user_metadata?.phone || '+911234567890',
              role: 'driver'
            })

          if (insertError) {
            addResult(`❌ Failed to create user: ${insertError.message}`)
            return
          } else {
            addResult('✅ User record created successfully')
          }
        } else {
          addResult(`✅ User found in users table: ${userData.full_name} (${userData.role})`)
        }

        // Test 3: Try to create a test driver profile
        addResult('🔧 Testing driver profile creation...')
        
        const testProfile = {
          user_id: currentUser.id,
          experience_years: 5,
          vehicle_types: ['Car'],
          license_number: 'TEST123456',
          license_document_url: 'https://example.com/test-license.jpg',
          aadhar_document_url: 'https://example.com/test-aadhar.jpg',
          profile_image_url: null,
          bio: 'Test driver profile',
          location: 'Mumbai, Maharashtra',
          status: 'pending'
        }

        const { data: profileData, error: profileError } = await supabase
          .from('driver_profiles')
          .insert(testProfile)
          .select()

        if (profileError) {
          addResult(`❌ Driver profile creation failed: ${profileError.message}`)
          
          // Check if profile already exists
          const { data: existingProfile, error: checkError } = await supabase
            .from('driver_profiles')
            .select('*')
            .eq('user_id', currentUser.id)

          if (checkError) {
            addResult(`❌ Error checking existing profile: ${checkError.message}`)
          } else if (existingProfile && existingProfile.length > 0) {
            addResult(`⚠️ Driver profile already exists for this user`)
          }
        } else {
          addResult('✅ Test driver profile created successfully!')
          addResult('🎉 Registration flow is working!')
        }

        // Test 4: Check RLS policies
        addResult('🔍 Testing database permissions...')
        
        const { data: allProfiles, error: selectError } = await supabase
          .from('driver_profiles')
          .select('count(*)')

        if (selectError) {
          addResult(`❌ Cannot read driver_profiles: ${selectError.message}`)
        } else {
          addResult(`✅ Can read driver_profiles table`)
        }

      } catch (error) {
        addResult(`❌ Unexpected error: ${error}`)
      }
    }

    runTests()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Registration Flow Diagnostics</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Status</h2>
          <p className="text-gray-700">{status}</p>
          
          {user && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">Logged in as:</h3>
              <p className="text-blue-700 text-sm">Email: {user.email}</p>
              <p className="text-blue-700 text-sm">ID: {user.id}</p>
              <p className="text-blue-700 text-sm">Confirmed: {user.email_confirmed_at ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
                {result}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 mb-2">🚨 Instructions</h3>
        <ol className="text-yellow-700 text-sm list-decimal list-inside space-y-1">
          <li>Make sure you&apos;re logged in as a user who signed up as a &quot;driver&quot;</li>
          <li>If you see any ❌ errors, those need to be fixed</li>
          <li>If the test passes, try the actual registration form again</li>
          <li>Check the Supabase Table Editor to see if data appears</li>
        </ol>
      </div>
    </div>
  )
}
