import { Hero } from '@/components/home/hero'
import { Features } from '@/components/home/features'
import { VehicleTypes } from '@/components/home/vehicle-types'
import { HowItWorks } from '@/components/home/how-it-works'
import { Testimonials } from '@/components/home/testimonials'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <VehicleTypes />
      <HowItWorks />
      <Testimonials />
    </>
  )
}
