'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function FixRLSPolicies() {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `${timestamp}: ${message}`])
  }

  const fixDriverProfilesPolicies = async () => {
    setIsLoading(true)
    setLogs([])
    
    const supabase = createClient()

    try {
      addLog('🔧 Starting RLS policy fix for driver_profiles...')

      // Drop existing policies
      const dropPolicies = [
        'DROP POLICY IF EXISTS "Drivers can insert their own profile" ON driver_profiles;',
        'DROP POLICY IF EXISTS "Drivers can read their own profile" ON driver_profiles;',
        'DROP POLICY IF EXISTS "Drivers can update their own profile" ON driver_profiles;',
        'DROP POLICY IF EXISTS "Enable access for authenticated users" ON driver_profiles;',
        'DROP POLICY IF EXISTS "Public can read approved drivers" ON driver_profiles;'
      ]

      for (const sql of dropPolicies) {
        const { error } = await supabase.rpc('exec_sql', { sql_query: sql })
        if (error) {
          addLog(`⚠️ Drop policy warning: ${error.message}`)
        } else {
          addLog(`✅ Dropped policy: ${sql.split('"')[1]}`)
        }
      }

      // Create new policies
      const createPolicies = [
        {
          name: 'Drivers can insert their own profile',
          sql: `CREATE POLICY "Drivers can insert their own profile" ON driver_profiles
                FOR INSERT 
                WITH CHECK (auth.uid() = user_id);`
        },
        {
          name: 'Drivers can read their own profile',
          sql: `CREATE POLICY "Drivers can read their own profile" ON driver_profiles
                FOR SELECT 
                USING (auth.uid() = user_id);`
        },
        {
          name: 'Drivers can update their own profile',
          sql: `CREATE POLICY "Drivers can update their own profile" ON driver_profiles
                FOR UPDATE 
                USING (auth.uid() = user_id)
                WITH CHECK (auth.uid() = user_id);`
        },
        {
          name: 'Public can read approved drivers',
          sql: `CREATE POLICY "Public can read approved drivers" ON driver_profiles
                FOR SELECT 
                USING (status = 'approved');`
        }
      ]

      for (const policy of createPolicies) {
        const { error } = await supabase.rpc('exec_sql', { sql_query: policy.sql })
        if (error) {
          addLog(`❌ Failed to create policy "${policy.name}": ${error.message}`)
        } else {
          addLog(`✅ Created policy: ${policy.name}`)
        }
      }

      // Test the policies
      addLog('🧪 Testing driver profile creation...')
      
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) {
        addLog('❌ No authenticated user for testing')
        return
      }

      // Test INSERT capability
      const testData = {
        user_id: user.user.id,
        experience_years: 5,
        vehicle_types: ['car'],
        license_number: 'TEST123',
        license_document_url: 'test.pdf',
        aadhar_document_url: 'test.pdf',
        bio: 'Test driver profile',
        location: 'Test City',
        status: 'pending'
      }

      const { data: insertResult, error: insertError } = await supabase
        .from('driver_profiles')
        .insert(testData)
        .select()

      if (insertError) {
        addLog(`❌ Test INSERT failed: ${insertError.message}`)
      } else {
        addLog('✅ Test INSERT successful!')
        
        // Clean up test data
        if (insertResult && insertResult.length > 0) {
          await supabase
            .from('driver_profiles')
            .delete()
            .eq('id', insertResult[0].id)
          addLog('🧹 Cleaned up test data')
        }
      }

      addLog('🎉 RLS policy fix completed!')

    } catch (error) {
      addLog(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Fix RLS Policies</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={fixDriverProfilesPolicies}
            disabled={isLoading}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Fixing...' : 'Fix Driver Profiles RLS Policies'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Fix Results:</h2>
          <div className="space-y-2 font-mono text-sm bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Click "Fix Driver Profiles RLS Policies" to start...</p>
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
