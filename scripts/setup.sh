#!/bin/bash

# Setup script for Hire Drive development environment

echo "🚗 Setting up Hire Drive development environment..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "⚠️  Please update .env.local with your actual Supabase credentials"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Set up your Supabase database using database/schema.sql"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "For detailed setup instructions, see README.md"
