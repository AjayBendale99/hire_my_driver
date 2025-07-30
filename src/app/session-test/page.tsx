'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function SessionTest() {
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `${timestamp}: ${message}`])
  }

  const testSessionPersistence = async () => {
    try {
      setLoading(true)
      setLogs([])
      
      const supabase = createClient()
      addLog('🔄 Starting session persistence test...')

      // Check initial session
      const { data: initialSession } = await supabase.auth.getSession()
      addLog(`📍 Initial session: ${initialSession.session ? '✅ Found' : '❌ None'}`)

      if (initialSession.session) {
        addLog(`👤 Current user: ${initialSession.session.user.email}`)
        
        // Test database access
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', initialSession.session.user.id)
          .single()
        
        if (error) {
          addLog(`❌ Database error: ${error.message}`)
        } else {
          addLog(`✅ Profile loaded: ${profile.full_name} (${profile.role})`)
        }
        
        return
      }

      // Test login if no session
      addLog('🔑 No session found, testing login...')
      
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'ajay.bendale99@gmail.com',
        password: 'asdfghjkl'
      })

      if (loginError) {
        addLog(`❌ Login failed: ${loginError.message}`)
        return
      }

      addLog('✅ Login successful')
      
      // Wait for session to be established
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Check session after login
      const { data: newSession } = await supabase.auth.getSession()
      addLog(`📍 Session after login: ${newSession.session ? '✅ Found' : '❌ Still none'}`)
      
      if (newSession.session) {
        addLog(`👤 Logged in as: ${newSession.session.user.email}`)
        
        // Test database access with new session
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', newSession.session.user.id)
          .single()
        
        if (error) {
          addLog(`❌ Database error: ${error.message}`)
        } else {
          addLog(`✅ Profile loaded: ${profile.full_name} (${profile.role})`)
        }
      }

    } catch (error) {
      addLog(`❌ Test error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    addLog('✅ Logged out successfully')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Session Persistence Test</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testSessionPersistence}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Session Persistence'}
          </button>
          
          <button
            onClick={logout}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 ml-4"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <div className="space-y-2 font-mono text-sm bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Click "Test Session Persistence" to start...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
