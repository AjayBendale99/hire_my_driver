'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function SignupTestPage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const addResult = (msg: string) => {
    setResults(prev => [...prev, msg])
    console.log(msg)
  }

  const testSignup = async () => {
    setLoading(true)
    setResults([])
    
    // Generate a unique test email
    const testEmail = `test.driver.${Date.now()}@gmail.com`
    const testPassword = 'TestPassword123!'
    
    addResult(`🧪 Testing signup with: ${testEmail}`)
    
    try {
      // Step 1: Test Supabase auth signup
      addResult('📝 Step 1: Creating auth user...')
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: 'Test Driver',
            phone: '+919876543210',
            role: 'driver'
          }
        }
      })

      if (authError) {
        addResult(`❌ Auth signup failed: ${authError.message}`)
        setLoading(false)
        return
      }

      if (!authData.user) {
        addResult('❌ No user data returned from auth signup')
        setLoading(false)
        return
      }

      addResult(`✅ Auth user created: ${authData.user.id}`)
      addResult(`📧 Email confirmed: ${authData.user.email_confirmed_at ? 'Yes' : 'No'}`)

      // Step 2: Test user profile creation
      addResult('📝 Step 2: Creating user profile...')
      
      const userProfileData = {
        id: authData.user.id,
        email: testEmail,
        full_name: 'Test Driver',
        phone: '+919876543210',
        role: 'driver' as const
      }
      
      addResult(`📊 Profile data: ${JSON.stringify(userProfileData, null, 2)}`)
      
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert(userProfileData)
        .select()

      if (profileError) {
        addResult(`❌ Profile creation failed: ${profileError.message}`)
        addResult(`🔍 Error code: ${profileError.code}`)
        addResult(`🔍 Error details: ${profileError.details}`)
        addResult(`🔍 Error hint: ${profileError.hint}`)
        
        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single()
          
        if (checkError) {
          addResult(`❌ Error checking existing user: ${checkError.message}`)
        } else if (existingUser) {
          addResult(`⚠️ User already exists: ${existingUser.full_name}`)
        }
      } else {
        addResult(`✅ Profile created successfully!`)
        addResult(`👤 Profile: ${JSON.stringify(profileData, null, 2)}`)
      }

      // Step 3: Test permissions
      addResult('📝 Step 3: Testing database permissions...')
      
      const { count: userCount, error: readError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        
      if (readError) {
        addResult(`❌ Cannot read users table: ${readError.message}`)
      } else {
        addResult(`✅ Can read users table (${userCount} total users)`)
      }

      // Cleanup: Delete the test user
      addResult('🧹 Cleanup: Removing test user...')
      
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', authData.user.id)
        
      if (deleteError) {
        addResult(`⚠️ Could not delete test user: ${deleteError.message}`)
      } else {
        addResult(`✅ Test user cleaned up`)
      }
      
    } catch (error) {
      addResult(`❌ Unexpected error: ${error}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Signup Flow Test</h1>
      
      <button
        onClick={testSignup}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : '🧪 Run Signup Test'}
      </button>
      
      <div className="mt-6 space-y-2">
        {results.map((result, i) => (
          <div key={i} className="p-2 bg-gray-100 rounded text-sm font-mono whitespace-pre-wrap">
            {result}
          </div>
        ))}
      </div>
      
      {!loading && results.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <p className="text-sm text-blue-700">
            💡 If the test passes, the signup issue is fixed! If not, we&apos;ll see the exact error details.
          </p>
        </div>
      )}
    </div>
  )
}
