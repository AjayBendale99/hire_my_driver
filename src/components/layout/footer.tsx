import Link from 'next/link'
import { Car, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Car className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Hire Drive</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              India&apos;s trusted platform for hiring professional drivers. Whether you need a driver for your car, 
              truck, or any other vehicle, we connect you with verified and experienced drivers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse-drivers" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Browse Drivers
                </Link>
              </li>
              <li>
                <Link href="/auth/signup?role=driver" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Become a Driver
                </Link>
              </li>
              <li>
                <a href="https://three-ai-project-one.vercel.app" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="https://startupzero.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">support@hiredrive.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} Hire Drive. All rights reserved. Made with ❤️ in India.
          </p>
        </div>
      </div>
    </footer>
  )
}
