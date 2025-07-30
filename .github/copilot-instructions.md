<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Hire Drive Website - Copilot Instructions

This is a "Hire a Driver" website built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Project Overview
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes with Supabase integration
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with role-based access
- **File Storage**: Supabase Storage for document uploads
- **Deployment**: Vercel

## User Roles
1. **Driver**: Register with documents, wait for admin approval
2. **Customer**: Browse and hire approved drivers
3. **Admin**: Approve driver registrations, manage users

## Key Features
- Multi-vehicle support (cars, trucks, two-wheelers, private jets, JCBs, etc.)
- Document upload system for driver verification
- Admin approval workflow
- Search and filter functionality for customers
- Indian user-focused design and content

## Code Style Guidelines
- Use TypeScript for all components and API routes
- Follow Next.js 15 App Router conventions
- Use Tailwind CSS for styling with Indian design preferences
- Implement proper error handling and validation
- Use Supabase client for database operations
- Follow security best practices for file uploads and user data
