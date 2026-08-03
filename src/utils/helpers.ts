/**
 * Format currency values
 */
export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format percentage values
 */
export const formatPercent = (value: number, decimals: number = 2): string => {
  return `${value > 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

/**
 * Format large numbers with K, M, B suffixes
 */
export const formatNumber = (value: number): string => {
  if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B'
  if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M'
  if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K'
  return value.toFixed(2)
}

/**
 * Format date and time
 */
export const formatDate = (date: Date | string, format: 'short' | 'long' = 'short'): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { isValid: boolean; feedback: string[] } => {
  const feedback: string[] = []
  
  if (password.length < 8) feedback.push('Password must be at least 8 characters')
  if (!/[A-Z]/.test(password)) feedback.push('Password must contain uppercase letter')
  if (!/[a-z]/.test(password)) feedback.push('Password must contain lowercase letter')
  if (!/[0-9]/.test(password)) feedback.push('Password must contain number')
  if (!/[!@#$%^&*]/.test(password)) feedback.push('Password must contain special character')
  
  return {
    isValid: feedback.length === 0,
    feedback,
  }
}

/**
 * Calculate profit/loss percentage
 */
export const calculatePLPercent = (entryPrice: number, exitPrice: number): number => {
  return ((exitPrice - entryPrice) / entryPrice) * 100
}

/**
 * Calculate profit/loss amount
 */
export const calculatePLAmount = (entryPrice: number, exitPrice: number, quantity: number): number => {
  return (exitPrice - entryPrice) * quantity
}

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): T => {
  let timeout: NodeJS.Timeout
  
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number): T => {
  let inThrottle: boolean
  
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }) as T
}

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token')
}

/**
 * Get authentication token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

/**
 * Set authentication token
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token)
}

/**
 * Clear authentication token
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem('auth_token')
}
