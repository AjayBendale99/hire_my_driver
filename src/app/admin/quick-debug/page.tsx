'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function QuickDebugPage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const quickTest = async () => {
      const addResult = (msg: string) => setResults(prev => [...prev, msg])
      
      try {
        // Check auth status
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user) {
          addResult('❌ Not logged in')
          setLoading(false)
          return
        }
        
        addResult(`✅ Logged in: ${user.email}`)
        
        // Check users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
          
        if (userError) {
          addResult(`❌ No user record: ${userError.message}`)
        } else {
          addResult(`✅ User record exists: ${userData.full_name}`)
        }
        
        // Check driver profiles
        const { data: profiles, error: profileError } = await supabase
          .from('driver_profiles')
          .select('*')
          .eq('user_id', user.id)
          
        if (profileError) {
          addResult(`❌ Profile error: ${profileError.message}`)
        } else {
          addResult(`ℹ️ Driver profiles for user: ${profiles.length}`)
        }
        
        // Count all profiles
        const { count, error: countError } = await supabase
          .from('driver_profiles')
          .select('*', { count: 'exact', head: true })
          
        if (!countError) {
          addResult(`ℹ️ Total driver profiles in DB: ${count}`)
        }
        
      } catch (err) {
        addResult(`❌ Error: ${err}`)
      }
      
      setLoading(false)
    }
    
    quickTest()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Quick Debug</h1>
      
      {loading ? (
        <p>Running diagnostics...</p>
      ) : (
        <div className="space-y-2">
          {results.map((result, i) => (
            <div key={i} className="p-2 bg-gray-100 rounded text-sm font-mono">
              {result}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <p className="text-sm text-blue-700">
          💡 This page should be available immediately at: /admin/quick-debug
        </p>
      </div>
    </div>
  )
}
