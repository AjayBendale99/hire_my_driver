import Link from 'next/link'
import { ArrowRight, Star, Users, Shield } from 'lucide-react'

export function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Hire Professional Drivers 
              <span className="text-blue-200"> Anywhere in India</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Connect with verified, experienced drivers for cars, trucks, two-wheelers, and more. 
              Safe, reliable, and affordable driver services at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/browse-drivers"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                Find a Driver
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/auth/signup?role=driver"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center"
              >
                Become a Driver
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8" />
                  </div>
                  <div className="text-2xl font-bold">5000+</div>
                  <div className="text-blue-200">Verified Drivers</div>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Star className="h-8 w-8" />
                  </div>
                  <div className="text-2xl font-bold">4.8/5</div>
                  <div className="text-blue-200">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-8 w-8" />
                  </div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-blue-200">Verified Documents</div>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <ArrowRight className="h-8 w-8" />
                  </div>
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-blue-200">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
