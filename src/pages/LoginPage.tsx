import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'

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

      // Handle demo credentials
      if (formData.email === 'demo@example.com' && formData.password === 'Demo123!@') {
        // Generate transaction history from 2015 to present
        const transactions = [
          // 2015 - Initial and early deposits
          { date: '2015-01-15', type: 'deposit', amount: 50000, description: 'Initial Account Funding', balance: 50000 },
          { date: '2015-03-20', type: 'deposit', amount: 15000, description: 'Monthly Contribution', balance: 65000 },
          { date: '2015-04-10', type: 'dividend', amount: 245, description: 'Dividend - AAPL', balance: 65245 },
          { date: '2015-06-15', type: 'deposit', amount: 20000, description: 'Monthly Contribution', balance: 85245 },
          { date: '2015-09-30', type: 'interest', amount: 180, description: 'Interest Earned', balance: 85425 },
          { date: '2015-12-15', type: 'deposit', amount: 25000, description: 'Year-End Deposit', balance: 110425 },
          
          // 2016 - Regular deposits and investment growth
          { date: '2016-01-15', type: 'deposit', amount: 18000, description: 'Monthly Contribution', balance: 128425 },
          { date: '2016-02-20', type: 'trade', amount: 3400, description: 'Trading Profit - MSFT', balance: 131825 },
          { date: '2016-03-15', type: 'deposit', amount: 18000, description: 'Monthly Contribution', balance: 149825 },
          { date: '2016-04-10', type: 'dividend', amount: 685, description: 'Dividend Distribution', balance: 150510 },
          { date: '2016-06-15', type: 'deposit', amount: 18000, description: 'Monthly Contribution', balance: 168510 },
          { date: '2016-09-15', type: 'deposit', amount: 20000, description: 'Monthly Contribution', balance: 188510 },
          { date: '2016-12-15', type: 'deposit', amount: 30000, description: 'Year-End Deposit', balance: 218510 },
          
          // 2017 - Accelerated growth
          { date: '2017-01-15', type: 'deposit', amount: 20000, description: 'Monthly Contribution', balance: 238510 },
          { date: '2017-02-10', type: 'trade', amount: 5200, description: 'Trading Profit - GOOGL', balance: 243710 },
          { date: '2017-03-15', type: 'deposit', amount: 20000, description: 'Monthly Contribution', balance: 263710 },
          { date: '2017-04-20', type: 'dividend', amount: 1245, description: 'Dividend Distribution', balance: 264955 },
          { date: '2017-06-15', type: 'deposit', amount: 22000, description: 'Monthly Contribution', balance: 286955 },
          { date: '2017-09-15', type: 'deposit', amount: 22000, description: 'Monthly Contribution', balance: 308955 },
          { date: '2017-12-15', type: 'deposit', amount: 35000, description: 'Year-End Deposit & Bonus', balance: 343955 },
          
          // 2018 - Market volatility period
          { date: '2018-01-15', type: 'deposit', amount: 20000, description: 'Monthly Contribution', balance: 363955 },
          { date: '2018-02-20', type: 'trade', amount: -2100, description: 'Trading Loss - Market Correction', balance: 361855 },
          { date: '2018-03-15', type: 'deposit', amount: 20000, description: 'Monthly Contribution', balance: 381855 },
          { date: '2018-04-15', type: 'dividend', amount: 980, description: 'Dividend Distribution', balance: 382835 },
          { date: '2018-06-15', type: 'deposit', amount: 20000, description: 'Monthly Contribution', balance: 402835 },
          { date: '2018-09-15', type: 'deposit', amount: 20000, description: 'Monthly Contribution', balance: 422835 },
          { date: '2018-12-15', type: 'deposit', amount: 32000, description: 'Year-End Deposit', balance: 454835 },
          
          // 2019 - Recovery and growth
          { date: '2019-01-15', type: 'deposit', amount: 22000, description: 'Monthly Contribution', balance: 476835 },
          { date: '2019-02-10', type: 'trade', amount: 4350, description: 'Trading Profit - Tech Rally', balance: 481185 },
          { date: '2019-03-15', type: 'deposit', amount: 22000, description: 'Monthly Contribution', balance: 503185 },
          { date: '2019-04-20', type: 'dividend', amount: 1890, description: 'Dividend Distribution', balance: 505075 },
          { date: '2019-06-15', type: 'deposit', amount: 25000, description: 'Monthly Contribution', balance: 530075 },
          { date: '2019-09-15', type: 'deposit', amount: 25000, description: 'Monthly Contribution', balance: 555075 },
          { date: '2019-12-15', type: 'deposit', amount: 40000, description: 'Year-End Deposit & Bonus', balance: 595075 },
          
          // 2020 - COVID year - mixed results
          { date: '2020-01-15', type: 'deposit', amount: 23000, description: 'Monthly Contribution', balance: 618075 },
          { date: '2020-02-28', type: 'trade', amount: -3200, description: 'COVID Market Correction', balance: 614875 },
          { date: '2020-03-15', type: 'deposit', amount: 23000, description: 'Monthly Contribution', balance: 637875 },
          { date: '2020-04-10', type: 'trade', amount: 8900, description: 'Recovery Trade Profit', balance: 646775 },
          { date: '2020-04-20', type: 'dividend', amount: 1240, description: 'Dividend Distribution', balance: 648015 },
          { date: '2020-06-15', type: 'deposit', amount: 25000, description: 'Monthly Contribution', balance: 673015 },
          { date: '2020-09-15', type: 'deposit', amount: 25000, description: 'Monthly Contribution', balance: 698015 },
          { date: '2020-12-15', type: 'deposit', amount: 45000, description: 'Year-End Deposit & Bonus', balance: 743015 },
          
          // 2021 - Strong bull market
          { date: '2021-01-15', type: 'deposit', amount: 25000, description: 'Monthly Contribution', balance: 768015 },
          { date: '2021-02-10', type: 'trade', amount: 12500, description: 'Bull Market Trading Gain', balance: 780515 },
          { date: '2021-03-15', type: 'deposit', amount: 25000, description: 'Monthly Contribution', balance: 805515 },
          { date: '2021-04-20', type: 'dividend', amount: 2180, description: 'Dividend Distribution', balance: 807695 },
          { date: '2021-06-15', type: 'deposit', amount: 28000, description: 'Monthly Contribution', balance: 835695 },
          { date: '2021-09-15', type: 'deposit', amount: 28000, description: 'Monthly Contribution', balance: 863695 },
          { date: '2021-12-15', type: 'deposit', amount: 50000, description: 'Year-End Deposit & Bonus', balance: 913695 },
          
          // 2022 - Market downturn
          { date: '2022-01-15', type: 'deposit', amount: 26000, description: 'Monthly Contribution', balance: 939695 },
          { date: '2022-02-20', type: 'trade', amount: -5400, description: 'Inflation Concerns Trade Loss', balance: 934295 },
          { date: '2022-03-15', type: 'deposit', amount: 26000, description: 'Monthly Contribution', balance: 960295 },
          { date: '2022-04-15', type: 'dividend', amount: 1650, description: 'Dividend Distribution', balance: 961945 },
          { date: '2022-06-15', type: 'deposit', amount: 26000, description: 'Monthly Contribution', balance: 987945 },
          { date: '2022-09-15', type: 'deposit', amount: 26000, description: 'Monthly Contribution', balance: 1013945 },
          { date: '2022-12-15', type: 'deposit', amount: 45000, description: 'Year-End Deposit', balance: 1058945 },
          
          // 2023 - Recovery and large deposit
          { date: '2023-01-15', type: 'deposit', amount: 30000, description: 'Monthly Contribution', balance: 1088945 },
          { date: '2023-02-10', type: 'trade', amount: 9800, description: 'Tech Recovery Trade', balance: 1098745 },
          { date: '2023-03-15', type: 'deposit', amount: 30000, description: 'Monthly Contribution', balance: 1128745 },
          { date: '2023-04-20', type: 'dividend', amount: 2560, description: 'Dividend Distribution', balance: 1131305 },
          { date: '2023-06-15', type: 'deposit', amount: 35000, description: 'Monthly Contribution', balance: 1166305 },
          { date: '2023-09-15', type: 'deposit', amount: 35000, description: 'Monthly Contribution', balance: 1201305 },
          { date: '2023-12-15', type: 'deposit', amount: 100000, description: 'Large Year-End Deposit', balance: 1301305 },
          
          // 2024 - Strong growth year
          { date: '2024-01-15', type: 'deposit', amount: 35000, description: 'Monthly Contribution', balance: 1336305 },
          { date: '2024-02-10', type: 'trade', amount: 15600, description: 'AI Boom Trading Gain', balance: 1351905 },
          { date: '2024-03-15', type: 'deposit', amount: 35000, description: 'Monthly Contribution', balance: 1386905 },
          { date: '2024-04-20', type: 'dividend', amount: 3245, description: 'Dividend Distribution', balance: 1390150 },
          { date: '2024-06-15', type: 'deposit', amount: 40000, description: 'Monthly Contribution', balance: 1430150 },
          { date: '2024-09-15', type: 'deposit', amount: 40000, description: 'Monthly Contribution', balance: 1470150 },
          { date: '2024-12-15', type: 'deposit', amount: 120000, description: 'Year-End Large Deposit', balance: 1590150 },
          
          // 2025 - Continued growth
          { date: '2025-01-15', type: 'deposit', amount: 40000, description: 'Monthly Contribution', balance: 1630150 },
          { date: '2025-02-10', type: 'trade', amount: 18400, description: 'Tech Stock Rally Trading Profit', balance: 1648550 },
          { date: '2025-03-15', type: 'deposit', amount: 40000, description: 'Monthly Contribution', balance: 1688550 },
          { date: '2025-04-20', type: 'dividend', amount: 3890, description: 'Dividend Distribution', balance: 1692440 },
          { date: '2025-06-15', type: 'deposit', amount: 45000, description: 'Monthly Contribution', balance: 1737440 },
          { date: '2025-09-15', type: 'deposit', amount: 45000, description: 'Monthly Contribution', balance: 1782440 },
          { date: '2025-12-15', type: 'deposit', amount: 150000, description: 'Year-End Large Deposit', balance: 1932440 },
          
          // 2026 - Current year
          { date: '2026-01-15', type: 'deposit', amount: 45000, description: 'Monthly Contribution', balance: 1977440 },
          { date: '2026-02-10', type: 'trade', amount: 22560, description: 'Current Month Trading Profit', balance: 2000000 },
        ]

        // Create demo user with realistic portfolio data
        const demoUser = {
          id: 'demo-user-001',
          email: 'demo@example.com',
          firstName: 'Demo',
          lastName: 'User',
          accountType: 'individual',
          account: {
            id: 'demo-account-001',
            accountNumber: 'U123456789',
            createdAt: '2015-01-15', // Account opened on this date
            balance: 2000000,
            buyingPower: 45670.23,
            marginLevel: 2.0,
            totalDeposits: 1875440,
            unrealizedGains: 124560,
            positions: [
              { symbol: 'AAPL', quantity: 50, avgCost: 185.20, currentPrice: 189.95, unrealizedPL: 237.50, unrealizedPLPercent: 2.56 },
              { symbol: 'GOOGL', quantity: 30, avgCost: 138.50, currentPrice: 142.80, unrealizedPL: 128.90, unrealizedPLPercent: 3.10 },
              { symbol: 'MSFT', quantity: 25, avgCost: 375.00, currentPrice: 378.50, unrealizedPL: 87.50, unrealizedPLPercent: 0.93 },
              { symbol: 'TSLA', quantity: 15, avgCost: 245.30, currentPrice: 238.90, unrealizedPL: -96.00, unrealizedPLPercent: -2.60 },
            ],
            transactions: transactions
          }
        }

        localStorage.setItem('token', 'demo-token-' + Date.now())
        localStorage.setItem('user', JSON.stringify(demoUser))
        localStorage.setItem('isDemo', 'true')

        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true')
          localStorage.setItem('email', formData.email)
        }

        navigate('/dashboard')
        return
      }

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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
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
    <div className="min-h-screen bg-[var(--mh-primary-dark)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-[var(--mh-primary)]/10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-[var(--mh-primary)] rounded-lg flex items-center justify-center shadow-lg border border-[var(--mh-primary)]">
                <span className="text-white font-bold text-lg">MH</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[var(--mh-primary)] mb-2 tracking-tight">Sign In</h1>
            <p className="text-[var(--mh-ink)]/70 font-medium">Access your bank account</p>
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
              className="w-full px-6 py-3 bg-[var(--mh-primary)] text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
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

          {/* Demo Banner */}
          <div className="mt-8 pt-8 border-t-2 border-[var(--mh-primary)]/10">
            <div className="bg-[var(--mh-accent-soft)] p-4 rounded-lg border border-[var(--mh-primary)]/10">
              <p className="text-sm font-semibold text-[var(--mh-primary)] mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[var(--mh-primary)]" />
                Try the Demo Account
              </p>
              <p className="text-xs text-[var(--mh-ink)]/70 mb-3">
                Explore the banking dashboard with ready-made account data, savings activity, and secure account actions.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFormData({ email: 'demo@example.com', password: 'Demo123!@', rememberMe: false })
                }}
                className="w-full px-4 py-2 bg-[var(--mh-primary)] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-colors"
              >
                Load Demo Credentials
              </button>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-ibkr-gray-400 text-xs mt-6 font-medium">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
