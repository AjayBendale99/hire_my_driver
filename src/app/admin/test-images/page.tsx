'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function TestImageUrls() {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `${timestamp}: ${message}`])
  }

  const testImageUrls = async () => {
    setIsLoading(true)
    setLogs([])
    
    const supabase = createClient()

    try {
      addLog('🔍 Testing image URL generation...')

      // First test if we can upload a new file
      addLog('📤 Testing new file upload...')
      
      const testFile = new Blob(['Test content for image testing'], { type: 'text/plain' })
      const testPath = `test/image_test_${Date.now()}.txt`
      
      const { data: uploadResult, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(testPath, testFile)
      
      if (uploadError) {
        addLog(`❌ Upload failed: ${uploadError.message}`)
      } else {
        addLog('✅ Upload successful!')
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(testPath)
        
        addLog(`🔗 Test file URL: ${urlData.publicUrl}`)
        
        // Test if URL is accessible
        try {
          const response = await fetch(urlData.publicUrl, { method: 'HEAD' })
          if (response.ok) {
            addLog(`✅ URL is accessible (${response.status})`)
          } else {
            addLog(`❌ URL not accessible (${response.status})`)
          }
        } catch (e) {
          addLog(`❌ URL fetch failed: ${e}`)
        }
        
        // Clean up
        await supabase.storage.from('documents').remove([testPath])
        addLog('🧹 Test file cleaned up')
      }

      // Get driver profiles with images
      const { data: profiles, error } = await supabase
        .from('driver_profiles')
        .select(`
          id,
          license_document_url,
          aadhar_document_url,
          profile_image_url
        `)
        .limit(5)

      if (error) {
        addLog(`❌ Error fetching profiles: ${error.message}`)
        return
      }

      addLog(`✅ Found ${profiles.length} profiles to test`)

      for (const profile of profiles) {
        addLog(`\n📋 Testing profile ID: ${profile.id}`)
        
        // Test license document URL
        if (profile.license_document_url) {
          // Check if it's already a full URL or just a path
          let licenseUrl
          if (profile.license_document_url.startsWith('http')) {
            licenseUrl = profile.license_document_url
            addLog(`🆔 License URL (direct): ${licenseUrl}`)
          } else {
            const { data: urlData } = supabase.storage
              .from('documents')
              .getPublicUrl(profile.license_document_url)
            licenseUrl = urlData.publicUrl
            addLog(`🆔 License URL (generated): ${licenseUrl}`)
          }
          
          // Test if URL is accessible
          try {
            const response = await fetch(licenseUrl, { method: 'HEAD' })
            if (response.ok) {
              addLog(`✅ License document accessible (${response.status})`)
            } else {
              addLog(`❌ License document not accessible (${response.status})`)
            }
          } catch (e) {
            addLog(`❌ License document fetch failed`)
          }
        }

        // Test aadhar document URL
        if (profile.aadhar_document_url) {
          let aadharUrl
          if (profile.aadhar_document_url.startsWith('http')) {
            aadharUrl = profile.aadhar_document_url
          } else {
            const { data: urlData } = supabase.storage
              .from('documents')
              .getPublicUrl(profile.aadhar_document_url)
            aadharUrl = urlData.publicUrl
          }
          addLog(`🪪 Aadhar URL: ${aadharUrl}`)
        }

        // Test profile image URL
        if (profile.profile_image_url) {
          let imageUrl
          if (profile.profile_image_url.startsWith('http')) {
            imageUrl = profile.profile_image_url
          } else {
            const { data: urlData } = supabase.storage
              .from('documents')
              .getPublicUrl(profile.profile_image_url)
            imageUrl = urlData.publicUrl
          }
          addLog(`📸 Profile image URL: ${imageUrl}`)
        }
      }

    } catch (error) {
      addLog(`❌ Test error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const makeStoragePublic = async () => {
    setIsLoading(true)
    addLog('🔧 Making storage bucket public...')
    
    try {
      addLog('💡 You need to run this SQL in Supabase dashboard:')
      addLog('UPDATE storage.buckets SET public = true WHERE id = \'documents\';')
      addLog('CREATE POLICY "Public can view documents" ON storage.objects FOR SELECT TO public USING (bucket_id = \'documents\');')
    } catch (error) {
      addLog(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Image URLs</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testImageUrls}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Image URLs'}
          </button>
          
          <button
            onClick={makeStoragePublic}
            disabled={isLoading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 ml-4"
          >
            Show Storage Fix SQL
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <div className="space-y-2 font-mono text-sm bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Click "Test Image URLs" to start...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">If Images Still Show 404:</h3>
          <ol className="list-decimal list-inside space-y-2 text-red-700">
            <li>Go to <strong>Supabase Dashboard → SQL Editor</strong></li>
            <li>Copy the SQL from <code>fix_image_access.sql</code></li>
            <li>Run the SQL to make storage bucket public</li>
            <li>Test image links again</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
