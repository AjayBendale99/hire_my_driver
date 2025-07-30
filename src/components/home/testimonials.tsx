import { Star, Quote } from 'lucide-react'

export function Testimonials() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Mumbai, Maharashtra",
      rating: 5,
      text: "Excellent service! I hired a driver for my truck delivery to Pune. The driver was very professional and delivered on time. Highly recommended!",
      vehicleType: "Truck"
    },
    {
      name: "Priya Sharma",
      location: "Delhi, NCR",
      rating: 5,
      text: "I was worried about hiring a driver for my car, but Hire Drive made it so easy. The driver was verified, punctual, and very courteous. Will use again!",
      vehicleType: "Car"
    },
    {
      name: "Anil Reddy",
      location: "Bangalore, Karnataka",
      rating: 5,
      text: "Needed a two-wheeler driver for daily office commute. Found an experienced driver through this platform. Great experience and affordable rates!",
      vehicleType: "Two Wheeler"
    },
    {
      name: "Sunita Patel",
      location: "Ahmedabad, Gujarat",
      rating: 5,
      text: "Professional service for hiring a private jet pilot. All documents were verified and the booking process was smooth. Excellent platform!",
      vehicleType: "Private Jet"
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our satisfied customers 
            have to say about their experience with Hire Drive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <Quote className="h-8 w-8 text-blue-600 mr-3" />
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {testimonial.vehicleType}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-blue-600 text-white rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Join Thousands of Happy Customers</h3>
            <p className="text-xl text-blue-100 mb-6">
              Start your journey with Hire Drive today and experience the best driver booking service in India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/browse-drivers"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Find a Driver Now
              </a>
              <a
                href="/auth/signup?role=driver"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Start Earning as Driver
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
