// Helper function to get the correct base URL for redirects
export const getBaseUrl = () => {
  // In production, use the NEXT_PUBLIC_APP_URL
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  // In development, use localhost
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Fallback for server-side
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

// Helper function to get auth redirect URLs
export const getAuthRedirectUrl = (path: string = '') => {
  const baseUrl = getBaseUrl()
  return `${baseUrl}${path}`
}
