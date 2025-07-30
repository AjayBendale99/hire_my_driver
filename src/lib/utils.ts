import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const vehicleTypes = [
  { id: 'car', label: 'Car', icon: '🚗' },
  { id: 'truck', label: 'Truck', icon: '🚚' },
  { id: 'two-wheeler', label: 'Two Wheeler', icon: '🏍️' },
  { id: 'auto-rickshaw', label: 'Auto Rickshaw', icon: '🛺' },
  { id: 'bus', label: 'Bus', icon: '🚌' },
  { id: 'taxi', label: 'Taxi', icon: '🚕' },
  { id: 'jcb', label: 'JCB', icon: '🚜' },
  { id: 'crane', label: 'Crane', icon: '🏗️' },
  { id: 'private-jet', label: 'Private Jet', icon: '✈️' },
  { id: 'yacht', label: 'Yacht', icon: '🛥️' },
]

export function formatDate(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}
