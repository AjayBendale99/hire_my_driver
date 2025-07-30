import { CheckCircle, Shield, Clock, Star, Users, Headphones } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Verified Drivers",
      description: "All drivers undergo thorough background checks and document verification for your safety and peace of mind."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      title: "Licensed & Experienced",
      description: "Only drivers with valid licenses and proven experience are allowed on our platform."
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: "Quick Booking",
      description: "Book a driver in minutes. Our streamlined process gets you connected with available drivers instantly."
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      title: "Rated & Reviewed",
      description: "Read reviews from other customers and choose drivers based on their ratings and feedback."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Wide Network",
      description: "Access to thousands of drivers across India, covering all major cities and routes."
    },
    {
      icon: <Headphones className="h-8 w-8 text-blue-600" />,
      title: "24/7 Support",
      description: "Our customer support team is available round the clock to assist you with any queries or issues."
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Hire Drive?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide the most reliable and secure platform for hiring professional drivers. 
            Here&apos;s what makes us different.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
