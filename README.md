<<<<<<< HEAD
# Hire Drive - Professional Driver Booking Platform

A comprehensive web platform that connects customers with verified professional drivers across India. Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## 🚗 Features

### For Customers
- Browse and search verified drivers by vehicle type, location, and experience
- Filter drivers by ratings, experience, and vehicle specialization
- Book drivers for various time periods
- Rate and review drivers after service
- Secure payment integration
- Real-time booking status updates

### For Drivers
- Complete registration with document verification
- Upload driving license, Aadhar card, and profile photos
- Manage availability and booking requests
- Receive ratings and build reputation
- Earn money by providing professional driving services
- Dashboard to track bookings and earnings

### For Admins
- Review and approve driver registrations
- Verify uploaded documents
- Manage user accounts and resolve disputes
- Monitor platform activity and analytics
- Content moderation and quality control

**Admin Login Credentials:**
- URL: `/admin/login`
- Username: `admin`
- Password: `admin@123`

## 🛠 Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth with Row Level Security
- **File Storage**: Supabase Storage for document uploads
- **Styling**: Tailwind CSS with responsive design
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hire_drive_website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `database/schema.sql`
   - Execute the SQL commands to create tables and policies

5. Configure Storage:
   - In Supabase dashboard, go to Storage
   - Create a bucket named `documents`
   - Set appropriate policies for file uploads

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── driver/            # Driver-specific pages
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── layout/           # Layout components (Navbar, Footer)
│   ├── home/             # Homepage components
│   └── ui/               # Generic UI components
├── lib/                  # Utility functions and configurations
│   ├── supabase.ts       # Supabase client configuration
│   ├── utils.ts          # Helper functions
│   └── validations.ts    # Form validation schemas
database/
├── schema.sql            # Database schema and setup
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Go to Project Settings > API to get your credentials
3. Enable Email authentication in Authentication > Settings
4. Set up the database schema using the provided SQL file
5. Configure Row Level Security policies
6. Set up storage bucket for document uploads

### Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (keep secret)
- `NEXT_PUBLIC_APP_URL`: Your app URL (for production deployment)

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Configure Supabase for Production

1. Update allowed origins in Supabase Authentication settings
2. Configure email templates for production
3. Set up custom SMTP for email delivery
4. Review and adjust RLS policies if needed

## 👥 User Roles

### Customer (`customer`)
- Can browse and book drivers
- View booking history
- Rate and review drivers
- Manage profile settings

### Driver (`driver`) 
- Must complete registration with document verification
- Can receive booking requests when approved
- Manage availability and profile
- View earnings and ratings

### Admin (`admin`)
- Review and approve driver applications
- Manage user accounts
- Access platform analytics
- Handle disputes and support

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Secure file upload with access controls
- Email verification for new accounts
- Document verification for drivers
- Protected API routes
- Input validation and sanitization

## 🎨 Vehicle Types Supported

- 🚗 Cars (Personal, Luxury)
- 🚚 Trucks (Delivery, Moving)
- 🏍️ Two Wheelers (Motorcycle, Scooter)
- 🛺 Auto Rickshaw
- 🚌 Bus
- 🚕 Taxi
- 🚜 JCB/Construction Equipment
- 🏗️ Crane
- ✈️ Private Jet
- 🛥️ Yacht

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@hiredrive.in
- Phone: +91 98765 43210

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time chat between customers and drivers
- [ ] GPS tracking integration
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Referral program
- [ ] Push notifications

---

Made with ❤️ in India for the Indian market.
