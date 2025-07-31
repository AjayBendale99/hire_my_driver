'use client'

import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get initial theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light')
    
    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const html = document.documentElement
    
    if (newTheme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-12 h-12 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse">
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative group p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-500 transform hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative">
        {theme === 'light' ? (
          <div className="relative">
            <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-all duration-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500 opacity-20"></div>
          </div>
        ) : (
          <div className="relative">
            <Sun className="h-5 w-5 text-yellow-500 dark:text-yellow-400 transition-all duration-500 group-hover:text-yellow-400 dark:group-hover:text-yellow-300 group-hover:rotate-180" />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 opacity-30"></div>
          </div>
        )}
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 scale-0 group-hover:scale-110 transition-transform duration-500 blur-sm"></div>
    </button>
  )
}
