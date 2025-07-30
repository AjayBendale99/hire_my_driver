import Link from 'next/link'
import { vehicleTypes } from '@/lib/utils'

export function VehicleTypes() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Drivers for Every Vehicle Type
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you need a driver for your personal car or a specialized vehicle, 
            we have experienced drivers for all types of vehicles.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {vehicleTypes.map((vehicle) => (
            <Link
              key={vehicle.id}
              href={`/browse-drivers?vehicle=${vehicle.id}`}
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all hover:scale-105 border border-gray-200"
            >
              <div className="text-4xl mb-3">{vehicle.icon}</div>
              <h3 className="font-semibold text-gray-900">{vehicle.label}</h3>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/browse-drivers"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            Browse All Drivers
          </Link>
        </div>
      </div>
    </section>
  )
}
