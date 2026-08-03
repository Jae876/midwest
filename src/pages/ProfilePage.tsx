import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, DollarSign, Target, LogOut } from 'lucide-react'

interface User {
  firstName: string
  lastName: string
  account?: {
    balance: number
    target?: number
    buyingPower: number
    createdAt?: string
    totalDeposits?: number
    unrealizedGains?: number
  }
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [targetAmount, setTargetAmount] = useState(5000000)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadUserData()
  }, [navigate])

  const loadUserData = () => {
    try {
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        navigate('/login')
        return
      }

      const userData: User = JSON.parse(userStr)
      setUser(userData)
      
      // Load existing target or default to 5M
      if (userData.account?.target) {
        setTargetAmount(userData.account.target)
      }
    } catch (err) {
      console.error('Error loading profile data:', err)
      navigate('/login')
    }
  }

  const handleSaveTarget = async () => {
    if (targetAmount <= 0) {
      setError('Target must be greater than $0')
      return
    }

    if (targetAmount < 100000) {
      setError('Target must be at least $100,000')
      return
    }

    setSaving(true)
    setError('')

    try {
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        navigate('/login')
        return
      }

      const userData: User = JSON.parse(userStr)
      if (!userData.account) {
        userData.account = { balance: 0, buyingPower: 0 }
      }

      userData.account.target = targetAmount
      localStorage.setItem('user', JSON.stringify(userData))
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Failed to save target')
      console.error('Error saving target:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminAuthTime')
    localStorage.removeItem('adminUser')
    navigate('/login')
  }

  if (!user) return null

  const currentBalance = user.account?.balance || 0
  const progressPercent = (currentBalance / targetAmount) * 100
  const amountToTarget = Math.max(0, targetAmount - currentBalance)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container-max py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Profile</h1>
              <p className="text-gray-600">{user.firstName} {user.lastName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-max py-8">
        <div className="max-w-2xl">
          {/* Account Summary */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Summary</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Current Balance</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Buying Power</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${(user.account?.buyingPower || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Account Created</p>
              <p className="text-gray-900">
                {user.account?.createdAt 
                  ? new Date(user.account.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })
                  : 'January 15, 2015'
                }
              </p>
            </div>
          </div>

          {/* Account Target Section */}
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Account Target</h2>
            </div>

            {/* Current Target Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Current Target</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${targetAmount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Amount to Target</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${amountToTarget.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Progress</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {Math.min(progressPercent, 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">
                  {currentBalance >= targetAmount
                    ? '🎉 Target achieved! Consider setting a new goal.'
                    : `${amountToTarget > 0 ? 'Need $' + amountToTarget.toLocaleString('en-US', { minimumFractionDigits: 0 }) + ' more to reach target' : 'Loading...'}`
                  }
                </p>
              </div>
            </div>

            {/* Set New Target */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  Set Your Target Amount
                </div>
              </label>
              
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">$</span>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => {
                    setTargetAmount(Math.max(0, parseInt(e.target.value) || 0))
                    setError('')
                  }}
                  min="100000"
                  step="100000"
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg font-semibold"
                  placeholder="5,000,000"
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Minimum target: $100,000
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Success Message */}
            {saved && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
                ✓ Target saved successfully!
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSaveTarget}
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Target'}
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-blue-900 mb-2">💡 About Your Target</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your target is displayed on your Account Value card</li>
              <li>• Progress is tracked and updated as your account grows</li>
              <li>• You can update your target at any time</li>
              <li>• Targets help you stay focused on your investment goals</li>
            </ul>
          </div>

          {/* Logout Section */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Sign Out
            </h3>
            <p className="text-sm text-red-800 mb-4">
              You will be logged out of your account and redirected to the login page.
            </p>
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
