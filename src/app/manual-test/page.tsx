'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

export default function ManualAuthTestPage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  const addResult = (msg: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])
    console.log(msg)
  }

  const testLogin = async () => {
    setLoading(true)
    setResults([])
    
    const email = "ajay.bendale99@gmail.com"
    const password = "asdfghjkl"
    
    try {
      addResult('🔍 Testing login with provided credentials...')
      
      // Step 1: Login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        addResult(`❌ Login failed: ${authError.message}`)
        setLoading(false)
        return
      }

      if (!authData.user) {
        addResult('❌ No user data returned from login')
        setLoading(false)
        return
      }

      addResult(`✅ Login successful: ${authData.user.email}`)
      addResult(`📧 Email confirmed: ${authData.user.email_confirmed_at ? 'Yes' : 'No'}`)

      // Step 2: Test user profile query
      addResult('🔍 Testing user profile query...')
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (userError) {
        addResult(`❌ User profile query failed: ${userError.message}`)
        addResult(`❌ Error code: ${userError.code}`)
        addResult(`❌ Error details: ${JSON.stringify(userError, null, 2)}`)
      } else if (userData) {
        addResult(`✅ User profile found: ${userData.full_name} (${userData.role})`)
      } else {
        addResult('⚠️ No user profile data returned')
      }

      // Step 3: Test driver profile query
      addResult('🔍 Testing driver profile query...')
      
      const { data: driverData, error: driverError } = await supabase
        .from('driver_profiles')
        .select('*')
        .eq('user_id', authData.user.id)

      if (driverError) {
        if (driverError.code === 'PGRST116') {
          addResult('ℹ️ No driver profile found (normal if not created)')
        } else {
          addResult(`❌ Driver profile query failed: ${driverError.message}`)
          addResult(`❌ Error code: ${driverError.code}`)
        }
      } else {
        addResult(`✅ Driver profiles accessible (${driverData.length} records)`)
      }

      // Step 4: Test what happens if we check auth after login
      addResult('🔍 Testing auth status after login...')
      
      const { data: { user: checkUser }, error: checkError } = await supabase.auth.getUser()
      
      if (checkError) {
        addResult(`❌ Auth check failed: ${checkError.message}`)
      } else if (checkUser) {
        addResult(`✅ Auth check passed: Still logged in as ${checkUser.email}`)
      } else {
        addResult('❌ Auth check failed: No user found after login')
      }

    } catch (error) {
      addResult(`❌ Unexpected error: ${error}`)
    }
    
    setLoading(false)
  }

  const testCurrentAuth = async () => {
    setLoading(true)
    setResults([])
    
    try {
      addResult('🔍 Testing current authentication status...')
      
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        addResult(`❌ Auth error: ${authError.message}`)
      } else if (user) {
        addResult(`✅ Currently logged in: ${user.email}`)
        
        // Test database access
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (userError) {
          addResult(`❌ Database access failed: ${userError.message}`)
        } else {
          addResult(`✅ Database access works: ${userData.full_name}`)
        }
      } else {
        addResult('❌ Not currently logged in')
      }
    } catch (error) {
      addResult(`❌ Error: ${error}`)
    }
    
    setLoading(false)
  }

  const testLogout = async () => {
    try {
      await supabase.auth.signOut()
      addResult('✅ Logged out successfully')
    } catch (error) {
      addResult(`❌ Logout error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manual Authentication Test</h1>

        <div className="bg-white rounded-lg shadow border mb-6">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Test Controls</h2>
          </div>
          <div className="p-4 space-y-3">
            <button
              onClick={testCurrentAuth}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : '🔍 Test Current Auth Status'}
            </button>
            
            <button
              onClick={testLogin}
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : '🔑 Test Login with Your Credentials'}
            </button>
            
            <button
              onClick={testLogout}
              disabled={loading}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
          </div>
          <div className="p-4">
            {results.length === 0 ? (
              <p className="text-gray-500 italic">Click a test button above to see results</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
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
              href="/driver/dashboard-debug"
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Dashboard Debug
            </Link>
            <Link 
              href="/admin/database"
              className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              View Database
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
