'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

export default function AuthTestPage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  const addResult = (msg: string) => setResults(prev => [...prev, msg])

  useEffect(() => {
    const testAuth = async () => {
      try {
        addResult('🔍 Testing authentication and database access...')

        // Test 1: Check auth status
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          addResult(`❌ Auth error: ${authError.message}`)
          setLoading(false)
          return
        }

        if (!user) {
          addResult('⚠️ No user logged in')
          setLoading(false)
          return
        }

        addResult(`✅ User authenticated: ${user.email}`)
        addResult(`📧 Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`)

        // Test 2: Check if we can read our own user record
        addResult('🔍 Testing users table access...')
        
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (userError) {
          addResult(`❌ Cannot read user record: ${userError.message}`)
          addResult(`❌ Error code: ${userError.code}`)
          addResult(`❌ Error details: ${userError.details || 'None'}`)
          addResult(`❌ Error hint: ${userError.hint || 'None'}`)
        } else {
          addResult(`✅ User record found: ${userData.full_name} (${userData.role})`)
        }

        // Test 3: Check driver profiles access
        addResult('🔍 Testing driver_profiles table access...')
        
        const { data: driverData, error: driverError } = await supabase
          .from('driver_profiles')
          .select('*')
          .eq('user_id', user.id)

        if (driverError) {
          addResult(`❌ Cannot read driver profiles: ${driverError.message}`)
          addResult(`❌ Error code: ${driverError.code}`)
        } else {
          addResult(`✅ Driver profiles accessible (${driverData.length} records)`)
        }

        // Test 4: Test a simple read to verify connection
        addResult('🔍 Testing basic table read permissions...')
        
        const { data: testData, error: testError } = await supabase
          .from('users')
          .select('id')
          .limit(1)

        if (testError) {
          addResult(`❌ Basic table read failed: ${testError.message}`)
        } else {
          addResult(`✅ Basic table read works`)
        }

      } catch (error) {
        addResult(`❌ Unexpected error: ${error}`)
      }
      
      setLoading(false)
    }

    testAuth()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test</h1>

        <div className="bg-white rounded-lg shadow border">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
          </div>
          <div className="p-4">
            {loading ? (
              <p className="text-gray-600">Running tests...</p>
            ) : (
              <div className="space-y-2">
                {results.map((result, i) => (
                  <div key={i} className="text-sm font-mono p-2 bg-gray-100 rounded">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-3">Navigation</h3>
          <div className="space-x-2 space-y-2">
            <Link 
              href="/auth/login"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Login Page
            </Link>
            <Link 
              href="/auth/signup?role=driver"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Signup as Driver
            </Link>
            <Link 
              href="/driver/dashboard-debug"
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Dashboard Debug
            </Link>
            <Link 
              href="/nav"
              className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Navigation Helper
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
