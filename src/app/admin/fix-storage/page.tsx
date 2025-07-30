'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function FixStorage() {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `${timestamp}: ${message}`])
  }

  const fixStorageBucket = async () => {
    setIsLoading(true)
    setLogs([])
    
    const supabase = createClient()

    try {
      addLog('🔧 Starting storage bucket fix...')

      // Check current buckets
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()
      
      if (listError) {
        addLog(`❌ Error listing buckets: ${listError.message}`)
      } else {
        addLog(`📋 Current buckets: ${buckets.map(b => b.name).join(', ')}`)
      }

      // Try to create the documents bucket
      addLog('🪣 Creating documents bucket...')
      
      const { data: createResult, error: createError } = await supabase.storage.createBucket('documents', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'image/webp']
      })

      if (createError) {
        if (createError.message.includes('already exists')) {
          addLog('✅ Documents bucket already exists')
        } else {
          addLog(`❌ Error creating bucket: ${createError.message}`)
        }
      } else {
        addLog('✅ Documents bucket created successfully!')
      }

      // Update bucket to be public if it exists
      addLog('🔄 Making bucket public...')
      
      const { data: updateResult, error: updateError } = await supabase.storage.updateBucket('documents', {
        public: true
      })

      if (updateError) {
        addLog(`⚠️ Could not update bucket: ${updateError.message}`)
        addLog('💡 This might require manual SQL execution in Supabase dashboard')
      } else {
        addLog('✅ Bucket updated to public!')
      }

      // Test file upload
      addLog('🧪 Testing file upload...')
      
      const testFile = new Blob(['Test content'], { type: 'text/plain' })
      const testPath = `test/test_${Date.now()}.txt`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(testPath, testFile)

      if (uploadError) {
        addLog(`❌ Upload test failed: ${uploadError.message}`)
      } else {
        addLog('✅ Upload test successful!')
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(testPath)
        
        addLog(`🔗 Test file URL: ${urlData.publicUrl}`)
        
        // Clean up test file
        await supabase.storage.from('documents').remove([testPath])
        addLog('🧹 Test file cleaned up')
      }

      // Final verification
      addLog('🔍 Final verification...')
      
      const { data: finalBuckets } = await supabase.storage.listBuckets()
      const documentsBucket = finalBuckets?.find(b => b.id === 'documents')
      
      if (documentsBucket) {
        addLog(`✅ Documents bucket verified: ${documentsBucket.public ? 'PUBLIC' : 'PRIVATE'}`)
      } else {
        addLog('❌ Documents bucket still not found')
      }

    } catch (error) {
      addLog(`❌ Fix error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testExistingFiles = async () => {
    setIsLoading(true)
    setLogs([])
    
    const supabase = createClient()

    try {
      addLog('🔍 Testing existing uploaded files...')

      // List files in the documents bucket
      const { data: files, error: listError } = await supabase.storage
        .from('documents')
        .list()

      if (listError) {
        addLog(`❌ Error listing files: ${listError.message}`)
        return
      }

      addLog(`📁 Found ${files.length} items in documents bucket`)

      // Test a few file URLs
      for (const file of files.slice(0, 3)) {
        if (file.name && !file.name.endsWith('/')) {
          const { data: urlData } = supabase.storage
            .from('documents')
            .getPublicUrl(file.name)
          
          addLog(`🔗 ${file.name}: ${urlData.publicUrl}`)
        }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Fix Storage Bucket</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={fixStorageBucket}
            disabled={isLoading}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Fixing...' : 'Create & Fix Documents Bucket'}
          </button>
          
          <button
            onClick={testExistingFiles}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 ml-4"
          >
            {isLoading ? 'Testing...' : 'Test Existing Files'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Fix Results:</h2>
          <div className="space-y-2 font-mono text-sm bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Click "Create & Fix Documents Bucket" to start...</p>
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
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Manual Fix (if needed):</h3>
          <p className="text-yellow-700 mb-2">If the automatic fix doesn't work, run this SQL in Supabase Dashboard:</p>
          <pre className="bg-yellow-100 p-3 rounded text-sm overflow-x-auto">
{`INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;`}
          </pre>
        </div>
      </div>
    </div>
  )
}
