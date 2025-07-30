import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'customer' | 'driver' | 'admin'
          full_name: string
          phone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'customer' | 'driver' | 'admin'
          full_name: string
          phone: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'customer' | 'driver' | 'admin'
          full_name?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      driver_profiles: {
        Row: {
          id: string
          user_id: string
          experience_years: number
          vehicle_types: string[]
          license_number: string
          license_document_url: string
          aadhar_document_url: string
          profile_image_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          bio: string | null
          location: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          experience_years: number
          vehicle_types: string[]
          license_number: string
          license_document_url: string
          aadhar_document_url: string
          profile_image_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          bio?: string | null
          location: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          experience_years?: number
          vehicle_types?: string[]
          license_number?: string
          license_document_url?: string
          aadhar_document_url?: string
          profile_image_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          bio?: string | null
          location?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          customer_id: string
          driver_id: string
          start_date: string
          end_date: string
          pickup_location: string
          destination: string
          vehicle_type: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          driver_id: string
          start_date: string
          end_date: string
          pickup_location: string
          destination: string
          vehicle_type: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          driver_id?: string
          start_date?: string
          end_date?: string
          pickup_location?: string
          destination?: string
          vehicle_type?: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
