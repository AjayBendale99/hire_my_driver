import Link from 'next/link'
import { ArrowRight, Star, Users, Shield, Sparkles, Car, Truck, Bike } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-green-400/20 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-40 w-8 h-8 bg-pink-400/20 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* Floating vehicle icons */}
        <div className="absolute top-20 left-1/4 opacity-20 animate-float">
          <Car className="h-8 w-8 text-white" />
        </div>
        <div className="absolute top-60 right-1/4 opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>
          <Truck className="h-10 w-10 text-white" />
        </div>
        <div className="absolute bottom-32 left-1/3 opacity-20 animate-float" style={{ animationDelay: '2.5s' }}>
          <Bike className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in slide-in-from-left-8 duration-1000">
            <div className="flex items-center mb-6">
              <Sparkles className="h-6 w-6 text-yellow-400 mr-2 animate-pulse" />
              <span className="text-sm font-medium text-blue-200 uppercase tracking-wider">India&apos;s #1 Driver Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Hire Professional Drivers
              </span>
              <br />
              <span className="text-yellow-400 animate-pulse"> Anywhere in India</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              🚗 Connect with verified, experienced drivers for cars, trucks, two-wheelers, and more. 
              <br />
              <span className="text-yellow-200 font-medium">Safe, reliable, and affordable</span> driver services at your fingertips.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                href="/browse-drivers"
                className="group bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-yellow-50 transition-all duration-300 flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                <span className="relative z-10 flex items-center">
                  🔍 Find a Driver
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
              
              <Link 
                href="/auth/signup?role=driver"
                className="group border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                <span className="relative z-10 flex items-center">
                  💼 Become a Driver
                  <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                </span>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 text-sm text-blue-200">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1 text-green-400" />
                100% Verified
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                4.8/5 Rating
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-blue-400" />
                5000+ Drivers
              </div>
            </div>
          </div>
          
          <div className="relative animate-in slide-in-from-right-8 duration-1000" style={{ animationDelay: '300ms' }}>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
              
              <div className="relative z-10">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center group cursor-pointer">
                    <div className="bg-gradient-to-br from-white/20 to-white/10 rounded-2xl p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/30">
                      <Users className="h-10 w-10 text-blue-200 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">5000+</div>
                    <div className="text-blue-200">Verified Drivers</div>
                  </div>
                  
                  <div className="text-center group cursor-pointer">
                    <div className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-yellow-400/30">
                      <Star className="h-10 w-10 text-yellow-400 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <div className="text-3xl font-bold text-yellow-400">4.8/5</div>
                    <div className="text-blue-200">Average Rating</div>
                  </div>
                  
                  <div className="text-center group cursor-pointer">
                    <div className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-2xl p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-green-400/30">
                      <Shield className="h-10 w-10 text-green-400 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <div className="text-3xl font-bold text-green-400">100%</div>
                    <div className="text-blue-200">Verified Documents</div>
                  </div>
                  
                  <div className="text-center group cursor-pointer">
                    <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-2xl p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-purple-400/30">
                      <ArrowRight className="h-10 w-10 text-purple-400 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <div className="text-3xl font-bold text-purple-400">24/7</div>
                    <div className="text-blue-200">Support</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements around the stats card */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-green-400 rounded-full animate-pulse opacity-75"></div>
            <div className="absolute top-1/2 -left-6 w-4 h-4 bg-purple-400 rounded-full animate-bounce opacity-75"></div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-12 fill-gray-50 dark:fill-gray-900">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  )
}
