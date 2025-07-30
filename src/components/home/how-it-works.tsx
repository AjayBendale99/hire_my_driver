import { UserPlus, Search, MessageCircle, Car } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: <UserPlus className="h-12 w-12 text-blue-600" />,
      title: "Sign Up",
      description: "Create your account in minutes. Choose whether you're looking to hire a driver or become one.",
      number: "01"
    },
    {
      icon: <Search className="h-12 w-12 text-blue-600" />,
      title: "Find Your Driver",
      description: "Browse through verified drivers, filter by vehicle type, experience, and location to find the perfect match.",
      number: "02"
    },
    {
      icon: <MessageCircle className="h-12 w-12 text-blue-600" />,
      title: "Connect & Book",
      description: "Contact the driver directly, discuss your requirements, and confirm your booking with all the details.",
      number: "03"
    },
    {
      icon: <Car className="h-12 w-12 text-blue-600" />,
      title: "Enjoy the Ride",
      description: "Sit back and relax while your professional driver takes care of the driving. Rate your experience afterward.",
      number: "04"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting a professional driver has never been easier. Follow these simple steps 
            to book your driver today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-blue-200 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-200 rounded-full"></div>
                </div>
              )}
              
              <div className="relative z-10 bg-white">
                <div className="bg-blue-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center relative">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Ready to get started? Join thousands of satisfied customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign Up as Customer
            </a>
            <a
              href="/auth/signup?role=driver"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              Become a Driver
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
