import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { parseResponse } from '../utils/helpers'

export default function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    if (formData.password.length < 6) {
      setError('Please enter your password')
      return
    }

    try {
      setLoading(true)

      // API call to login for regular users
      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await parseResponse(response)

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed')
      }

      // Store auth data
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true')
        localStorage.setItem('email', formData.email)
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(31,80,121,0.2),_transparent_40%),linear-gradient(135deg,#0b2d4d_0%,#123f63_50%,#0d1f36_100%)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 rounded-3xl shadow-[0_25px_80px_-20px_rgba(1,26,48,0.65)] p-10 border border-[var(--mh-primary)]/15 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-[var(--mh-primary)] rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                <span className="text-white font-bold text-lg tracking-[0.22em]">MH</span>
              </div>
            </div>
            <div className="text-[11px] uppercase tracking-[0.35em] text-[var(--mh-primary)]/65 mb-2">Midwest Heritage</div>
            <h1 className="text-3xl font-bold text-[var(--mh-primary)] mb-2 tracking-tight">Secure Sign In</h1>
            <p className="text-[var(--mh-ink)]/70 font-medium">Member online banking access</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-ibkr-danger rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-ibkr-danger flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-ibkr-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-ibkr-blue" />
                  Email Address
                </div>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="input-field"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-ibkr-gray-900">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-ibkr-blue" />
                    Password
                  </div>
                </label>
                <Link 
                  to="#" 
                  className="text-xs font-semibold text-ibkr-blue hover:text-ibkr-navy transition"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ibkr-gray-500 hover:text-ibkr-blue transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-2 border-ibkr-gray-300 text-ibkr-blue focus:ring-2 focus:ring-ibkr-blue cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-sm text-ibkr-gray-600 font-medium cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-[var(--mh-primary)] text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--mh-primary)]/20"
            >
              {loading ? 'Signing In...' : 'Secure Sign In'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-ibkr-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-ibkr-gray-600 font-medium">or</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-ibkr-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-ibkr-blue hover:text-ibkr-navy transition">
                Create one now
              </Link>
            </p>
          </form>

        </div>

        {/* Footer Text */}
        <p className="text-center text-ibkr-gray-400 text-xs mt-6 font-medium">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
