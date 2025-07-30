'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function DiagnoseRLS() {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `${timestamp}: ${message}`])
  }

  const diagnoseRLSPolicies = async () => {
    setIsLoading(true)
    setLogs([])
    
    const supabase = createClient()

    try {
      addLog('🔍 Starting RLS diagnosis...')

      // Check current session first
      const { data: session } = await supabase.auth.getSession()
      if (!session.session) {
        addLog('❌ No active session found')
        addLog('🔑 Attempting to login with test credentials...')
        
        // Try to login with the provided credentials
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: 'ajay.bendale99@gmail.com',
          password: 'asdfghjkl'
        })

        if (loginError) {
          addLog(`❌ Login failed: ${loginError.message}`)
          addLog('💡 Please login manually and try again')
          return
        }

        addLog(`✅ Logged in successfully: ${loginData.user?.email}`)
        // Wait for session to establish
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // Check current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        addLog(`❌ Auth error: ${userError?.message || 'No user found'}`)
        return
      }
      addLog(`✅ Current user: ${user.email} (ID: ${user.id})`)

      // Check if user exists in users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        addLog(`❌ User profile error: ${profileError.message}`)
      } else {
        addLog(`✅ User profile found: ${userProfile.full_name} (${userProfile.role})`)
      }

      // Check current RLS policies (this requires a special function or direct SQL)
      addLog('📋 Checking current RLS policies...')
      
      // Try to read existing driver profiles
      const { data: existingProfiles, error: readError } = await supabase
        .from('driver_profiles')
        .select('id, user_id, status')
        .eq('user_id', user.id)

      if (readError) {
        addLog(`❌ Read driver_profiles error: ${readError.message}`)
      } else {
        addLog(`✅ Can read driver_profiles: ${existingProfiles.length} profiles found`)
        if (existingProfiles.length > 0) {
          addLog(`📝 Existing profile status: ${existingProfiles[0].status}`)
        }
      }

      // Test INSERT capability with minimal data
      addLog('🧪 Testing INSERT capability...')
      
      const testData = {
        user_id: user.id,
        experience_years: 1,
        vehicle_types: ['car'],
        license_number: 'TEST123456',
        license_document_url: 'test.pdf',
        aadhar_document_url: 'test2.pdf',
        bio: 'Test profile for RLS debugging',
        location: 'Test City',
        status: 'pending'
      }

      const { data: insertResult, error: insertError } = await supabase
        .from('driver_profiles')
        .insert(testData)
        .select()

      if (insertError) {
        addLog(`❌ INSERT failed: ${insertError.message}`)
        addLog(`🔍 Error details: ${JSON.stringify(insertError, null, 2)}`)
        
        // Check if it's specifically an RLS error
        if (insertError.message.includes('row-level security policy') || insertError.code === '42501') {
          addLog('🚨 This is an RLS policy violation!')
          addLog('💡 The policies need to be updated in Supabase dashboard')
        }
      } else {
        addLog('✅ INSERT successful!')
        addLog(`📝 Created profile ID: ${insertResult[0]?.id}`)
        
        // Clean up test data
        if (insertResult && insertResult.length > 0) {
          const { error: deleteError } = await supabase
            .from('driver_profiles')
            .delete()
            .eq('id', insertResult[0].id)
          
          if (deleteError) {
            addLog(`⚠️ Failed to cleanup test data: ${deleteError.message}`)
          } else {
            addLog('🧹 Test data cleaned up')
          }
        }
      }

      // Test storage upload
      addLog('📁 Testing storage upload...')
      
      // Create a test file
      const testFile = new Blob(['Test file content'], { type: 'text/plain' })
      const testFileName = `test/${user.id}/test_${Date.now()}.txt`
      
      const { data: uploadResult, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(testFileName, testFile)
      
      if (uploadError) {
        addLog(`❌ Storage upload failed: ${uploadError.message}`)
        if (uploadError.message.includes('row-level security policy')) {
          addLog('🚨 Storage RLS policy violation!')
          addLog('💡 Storage policies need to be updated')
        }
      } else {
        addLog('✅ Storage upload successful!')
        
        // Clean up test file
        await supabase.storage
          .from('documents')
          .remove([testFileName])
        addLog('🧹 Test file cleaned up')
      }

    } catch (error) {
      addLog(`❌ Diagnosis error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const quickLogin = async () => {
    setIsLoading(true)
    setLogs([])
    
    const supabase = createClient()
    
    try {
      addLog('🔑 Attempting quick login...')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'ajay.bendale99@gmail.com',
        password: 'asdfghjkl'
      })

      if (error) {
        addLog(`❌ Login failed: ${error.message}`)
      } else {
        addLog(`✅ Logged in successfully: ${data.user?.email}`)
        addLog('🎉 You can now run the diagnosis!')
      }
    } catch (error) {
      addLog(`❌ Login error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testWithRealData = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      addLog('🎯 Testing with realistic driver profile data...')

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        addLog('❌ No authenticated user')
        return
      }

      const realData = {
        user_id: user.id,
        experience_years: 5,
        vehicle_types: ['car', 'truck'],
        license_number: 'DL' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        license_document_url: `documents/${user.id}/license.pdf`,
        aadhar_document_url: `documents/${user.id}/aadhar.pdf`,
        bio: 'Experienced driver with 5 years of safe driving',
        location: 'Mumbai, Maharashtra',
        status: 'pending'
      }

      const { data, error } = await supabase
        .from('driver_profiles')
        .insert(realData)
        .select()

      if (error) {
        addLog(`❌ Real data test failed: ${error.message}`)
        
        // Try with even more minimal data
        addLog('🔄 Trying with minimal required fields...')
        const minimalData = {
          user_id: user.id,
          experience_years: 1,
          vehicle_types: ['car'],
          license_number: 'TEST',
          status: 'pending'
        }

        const { data: minData, error: minError } = await supabase
          .from('driver_profiles')
          .insert(minimalData)
          .select()

        if (minError) {
          addLog(`❌ Even minimal data failed: ${minError.message}`)
        } else {
          addLog('✅ Minimal data worked!')
          // Clean up
          await supabase.from('driver_profiles').delete().eq('id', minData[0].id)
        }
      } else {
        addLog('✅ Real data test successful!')
        // Clean up
        await supabase.from('driver_profiles').delete().eq('id', data[0].id)
      }

    } catch (error) {
      addLog(`❌ Test error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">RLS Policy Diagnosis</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={quickLogin}
            disabled={isLoading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Quick Login (ajay.bendale99@gmail.com)'}
          </button>
          
          <button
            onClick={diagnoseRLSPolicies}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 ml-4"
          >
            {isLoading ? 'Diagnosing...' : 'Diagnose RLS Policies'}
          </button>
          
          <button
            onClick={testWithRealData}
            disabled={isLoading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 ml-4"
          >
            {isLoading ? 'Testing...' : 'Test Real Data Insert'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Diagnosis Results:</h2>
          <div className="space-y-2 font-mono text-sm bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Click "Diagnose RLS Policies" to start...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">If RLS Policies Need Manual Update:</h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li>Go to <strong>Supabase Dashboard → SQL Editor</strong></li>
            <li>Copy the SQL from <code>fix_rls_policies.sql</code></li>
            <li>Paste and run the complete script</li>
            <li>Verify the policies were created</li>
            <li>Test driver registration again</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
