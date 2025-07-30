import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Driver Approvals */}
          <Link href="/admin/drivers" className="group">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <span className="text-2xl">👨‍✈️</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600">
                    Driver Approvals
                  </h3>
                  <p className="text-gray-600 text-sm">Review pending applications</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                Approve or reject new driver registrations and verify their documents.
              </p>
            </div>
          </Link>

          {/* User Management */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 opacity-75">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  User Management
                </h3>
                <p className="text-gray-600 text-sm">Coming soon</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm">
              Manage customers, drivers, and admin accounts.
            </p>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 opacity-75">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Analytics
                </h3>
                <p className="text-gray-600 text-sm">Coming soon</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm">
              View platform statistics and performance metrics.
            </p>
          </div>

          {/* Bookings */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 opacity-75">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Bookings
                </h3>
                <p className="text-gray-600 text-sm">Coming soon</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm">
              Monitor and manage customer bookings and transactions.
            </p>
          </div>

          {/* Support */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 opacity-75">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🎧</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Support
                </h3>
                <p className="text-gray-600 text-sm">Coming soon</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm">
              Handle customer support requests and disputes.
            </p>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 opacity-75">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <span className="text-2xl">⚙️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Settings
                </h3>
                <p className="text-gray-600 text-sm">Coming soon</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm">
              Configure platform settings and preferences.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">🚨 Manual Driver Approval (Database)</h3>
              <p className="text-yellow-700 text-sm mb-3">
                You can also approve drivers directly in your Supabase database:
              </p>
              <div className="bg-white rounded p-3 text-sm font-mono text-gray-700">
                UPDATE driver_profiles SET status = 'approved' WHERE status = 'pending';
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">💡 Pro Tip</h3>
              <p className="text-blue-700 text-sm">
                Use the <strong>Driver Approvals</strong> page above to review documents and approve drivers with a visual interface.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
