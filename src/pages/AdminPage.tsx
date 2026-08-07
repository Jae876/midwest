import { useState, useEffect, type FormEvent } from 'react'
import { Lock, AlertCircle, Eye, EyeOff, Trash2, Edit2, X, Save, LogOut, UserPlus } from 'lucide-react'

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  balance: number
  buyingPower: number
  transactionCount: number
  createdAt: string
}

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalVolume: number
  totalDeposits: number
  totalAccounts: number
  averageBalance: number
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [createError, setCreateError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', accountType: '' })
  const [createForm, setCreateForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    balance: '50000'
  })

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const authTime = localStorage.getItem('adminAuthTime')

    if (token && authTime) {
      const elapsed = Date.now() - Number(authTime)
      if (elapsed < 24 * 60 * 60 * 1000) {
        setAuthenticated(true)
      }
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api'
      const response = await fetch(`${apiUrl}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (response.ok && data.token) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminAuthTime', Date.now().toString())
        localStorage.setItem('adminUser', JSON.stringify(data.admin))
        setAuthenticated(true)
        setPassword('')
      } else {
        setError(data.error || data.message || 'Invalid admin credentials')
        setPassword('')
      }
    } catch (err) {
      console.error('Admin auth failed:', err)
      setError('Unable to authenticate with admin service')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminAuthTime')
    localStorage.removeItem('adminUser')
    setAuthenticated(false)
  }

  const parseResponseData = async (response: Response) => {
    const text = await response.text()
    if (!text) return {}

    try {
      return JSON.parse(text)
    } catch {
      return { message: text }
    }
  }

  const loadUsers = async () => {
    setLoadingUsers(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await parseResponseData(response)

      if (response.ok) {
        setUsers(data.users || [])
      } else {
        setUsers([])
        setError(data.error || data.message || 'Unable to load users from server')
      }
    } catch (err) {
      console.error('Error loading users:', err)
      setUsers([])
    } finally {
      setLoadingUsers(false)
    }
  }

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await parseResponseData(response)

      if (response.ok) {
        setStats(data.stats)
      } else {
        setStats(null)
        setError(data.error || data.message || 'Unable to load stats')
      }
    } catch (err) {
      console.error('Error loading stats:', err)
      setStats(null)
    }
  }

  useEffect(() => {
    if (authenticated) {
      loadUsers()
      loadStats()
      const loadPaymentSettings = async () => {
        try {
          const token = localStorage.getItem('adminToken')
          const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/admin/payment-settings`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          if (!response.ok) {
            return
          }

          const data = await response.json()
          setPaymentSettings({
            ACH: data.ACH || { accountNumber: '', routingNumber: '', notes: '' },
            WIRE: data.WIRE || { accountNumber: '', routingNumber: '', notes: '' },
            INTERNAL: data.INTERNAL || { accountNumber: '', routingNumber: '', notes: '' }
          })
        } catch (err) {
          console.warn('Failed to load payment settings', err)
        }
      }

      loadPaymentSettings()
    }
  }, [authenticated])

  const handleCreateUser = async () => {
    setCreateError('')
    setError('')

    if (!createForm.email || !createForm.password) {
      setCreateError('Email and password are required')
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        setCreateError('Admin authentication is required to create users')
        return
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/admin/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: createForm.email,
          password: createForm.password,
          firstName: createForm.firstName,
          lastName: createForm.lastName,
          balance: Number(createForm.balance || 50000)
        })
      })

      const serverData = await parseResponseData(response)
      if (!response.ok) {
        setCreateError(serverData?.error || serverData?.message || 'Unable to create user. Please check the database connection.')
        return
      }

      setShowCreateModal(false)
      setCreateForm({ email: '', firstName: '', lastName: '', password: '', balance: '50000' })
      setError('')
      setNotice(`User ${createForm.email} created successfully.`)
      await loadUsers()
    } catch (err) {
      console.error('Error creating user:', err)
      setCreateError('Unable to create user: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      accountType: 'Standard'
    })
    setShowEditModal(true)
  }

  const [paymentSettings, setPaymentSettings] = useState<Record<string, { accountNumber: string; routingNumber: string; notes: string }>>({
    ACH: { accountNumber: '', routingNumber: '', notes: '' },
    WIRE: { accountNumber: '', routingNumber: '', notes: '' },
    INTERNAL: { accountNumber: '', routingNumber: '', notes: '' }
  })
  const [transferForm, setTransferForm] = useState({
    userId: 0,
    paymentMethod: 'ACH',
    accountNumber: '',
    routingNumber: '',
    notes: ''
  })

  useEffect(() => {
    const stored = localStorage.getItem('adminPaymentSettings')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setPaymentSettings({
          ACH: { accountNumber: parsed.ACH?.accountNumber || '', routingNumber: parsed.ACH?.routingNumber || '', notes: parsed.ACH?.notes || '' },
          WIRE: { accountNumber: parsed.WIRE?.accountNumber || '', routingNumber: parsed.WIRE?.routingNumber || '', notes: parsed.WIRE?.notes || '' },
          INTERNAL: { accountNumber: parsed.INTERNAL?.accountNumber || '', routingNumber: parsed.INTERNAL?.routingNumber || '', notes: parsed.INTERNAL?.notes || '' }
        })
      } catch {
        // ignore invalid stored settings
      }
    }
  }, [])

  const handleTransferUser = (user: User) => {
    const settings = paymentSettings['ACH']
    setTransferForm({
      userId: user.id,
      paymentMethod: 'ACH',
      accountNumber: settings.accountNumber,
      routingNumber: settings.routingNumber,
      notes: settings.notes
    })
    setShowTransferModal(true)
  }

  const handleTransferSubmit = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/admin/payment-settings`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentMethod: transferForm.paymentMethod,
          accountNumber: transferForm.accountNumber,
          routingNumber: transferForm.routingNumber,
          notes: transferForm.notes
        })
      })

      const data = await parseResponseData(response)
      if (!response.ok) {
        setError(data.error || data.message || 'Unable to save payment settings')
        return
      }

      const nextSettings = {
        ...paymentSettings,
        [transferForm.paymentMethod]: {
          accountNumber: transferForm.accountNumber,
          routingNumber: transferForm.routingNumber,
          notes: transferForm.notes
        }
      }

      setPaymentSettings(nextSettings)
      localStorage.setItem('adminPaymentSettings', JSON.stringify(nextSettings))
      setShowTransferModal(false)
      setNotice(`Payment instructions saved for ${transferForm.paymentMethod}.`)
      setError('')
    } catch (err) {
      console.error('Error saving payment settings:', err)
      setError('Unable to save payment settings')
    }
  }

  const handleSaveUser = async () => {
    if (!editingUser) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/admin/users`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: editingUser.id,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          accountType: editForm.accountType,
          balance: editingUser.balance
        })
      })

      if (response.ok) {
        const currentUserStr = localStorage.getItem('user')
        if (currentUserStr) {
          const currentUserData = JSON.parse(currentUserStr)
          if (currentUserData?.email === editingUser.email) {
            currentUserData.account = {
              ...(currentUserData.account || {}),
              balance: editingUser.balance,
              buyingPower: editingUser.buyingPower || currentUserData.account?.buyingPower || 0,
            }
            localStorage.setItem('user', JSON.stringify(currentUserData))
          }
        }

        setNotice(`Balance updated for ${editingUser.email}.`)
        setShowEditModal(false)
        setEditingUser(null)
        await loadUsers()
      } else {
        setError('Unable to update user balance')
      }
    } catch (err) {
      console.error('Error saving user:', err)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/admin/users`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        setDeleteConfirm(null)
        await loadUsers()
        return
      }

      const data = await parseResponseData(response)
      setError(data.error || data.message || 'Unable to delete user. Please try again.')
    } catch (err) {
      console.error('Error deleting user:', err)
      setError('Unable to delete user. Please ensure the database is reachable.')
    }
  }

  if (authenticated) {
    return (
      <div className="min-h-screen bg-[var(--mh-primary-dark)] py-12 px-4">
        <div className="container-max">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                Bank Admin Dashboard
              </h1>
              <p className="text-emerald-100 font-medium">Member Services & Account Management</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white text-ibkr-navy font-bold hover:bg-ibkr-light-blue transition"
            >
              <UserPlus className="w-4 h-4" />
              Create User
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Users', value: (stats?.totalUsers || 0).toLocaleString(), color: 'from-emerald-500 to-ibkr-blue' },
              { label: 'Active Users (30d)', value: (stats?.activeUsers || 0).toLocaleString(), color: 'from-green-500 to-emerald-600' },
              { label: 'Total Volume', value: '$' + (stats?.totalVolume || 0).toLocaleString('en-US', { maximumFractionDigits: 0 }), color: 'from-amber-500 to-yellow-600' },
              { label: 'Total Accounts', value: (stats?.totalAccounts || 0).toLocaleString(), color: 'from-teal-500 to-cyan-600' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/10 border-2 border-white/20 rounded-xl p-6 backdrop-blur-md hover:border-white/40 transition-all duration-300">
                <p className="text-white/60 text-sm font-semibold mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-white mb-2">{stat.value}</p>
                <div className={`h-1 rounded-full bg-gradient-to-r ${stat.color}`}></div>
              </div>
            ))}
          </div>

          {notice && (
            <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg text-emerald-900 font-semibold">
              {notice}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-900 font-semibold">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-ibkr-navy mb-6">User Management</h2>

            {loadingUsers ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Balance</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Transactions</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user.firstName} {user.lastName}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 capitalize">Standard</td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900">${(user.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="px-6 py-4 text-sm text-center text-gray-900">{user.transactionCount || 0}</td>
                        <td className="px-6 py-4 text-sm text-center space-x-2">
                          <button
                            onClick={() => handleTransferUser(user)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs font-medium"
                          >
                            <Save className="w-3 h-3" />
                            Add Funds
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition text-xs font-medium"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          {deleteConfirm === user.id ? (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs font-medium"
                            >
                              Confirm
                            </button>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(user.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs font-medium"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          )}
                          {deleteConfirm === user.id && (
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-xs font-medium"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold"
            >
              <LogOut className="w-5 h-5" />
              Logout from Admin
            </button>
          </div>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create User</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">First Name</label>
                    <input
                      type="text"
                      value={createForm.firstName}
                      onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={createForm.lastName}
                      onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                  <input
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Account Balance</label>
                  <input
                    type="number"
                    value={createForm.balance}
                    onChange={(e) => setCreateForm({ ...createForm, balance: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {createError && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-900 text-sm">
                  {createError}
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
                >
                  <UserPlus className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {showTransferModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add Funds to User</h3>
                <button onClick={() => setShowTransferModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Payment Method</label>
                  <select
                    value={transferForm.paymentMethod}
                    onChange={(e) => {
                      const method = e.target.value
                      const methodSettings = paymentSettings[method] || { accountNumber: '', routingNumber: '', notes: '' }
                      setTransferForm({
                        ...transferForm,
                        paymentMethod: method,
                        accountNumber: methodSettings.accountNumber,
                        routingNumber: methodSettings.routingNumber,
                        notes: methodSettings.notes
                      })
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 outline-none"
                  >
                    <option value="ACH">ACH</option>
                    <option value="WIRE">Wire</option>
                    <option value="INTERNAL">Internal Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Destination Account Number</label>
                  <input
                    type="text"
                    value={transferForm.accountNumber}
                    onChange={(e) => setTransferForm({ ...transferForm, accountNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Routing Number</label>
                  <input
                    type="text"
                    value={transferForm.routingNumber}
                    onChange={(e) => setTransferForm({ ...transferForm, routingNumber: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 outline-none"
                    maxLength={9}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Optional Notes</label>
                  <input
                    type="text"
                    value={transferForm.notes}
                    onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 outline-none"
                  />
                </div>
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700">
                  These instructions are stored as the user-facing payment method details when customers select this payment option in Add Funds.
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransferSubmit}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Save Method
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
                <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">First Name</label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Account Type</label>
                  <select
                    value={editForm.accountType}
                    onChange={(e) => setEditForm({ ...editForm, accountType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 outline-none"
                  >
                    <option value="individual">Individual</option>
                    <option value="joint">Joint</option>
                    <option value="ira">IRA</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Balance</label>
                  <input
                    type="number"
                    value={editingUser.balance}
                    onChange={(e) => {
                      const nextValue = Number(e.target.value)
                      setEditingUser({ ...editingUser, balance: Number.isNaN(nextValue) ? 0 : nextValue })
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ibkr-dark via-ibkr-navy to-ibkr-blue flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-ibkr-gray-300">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-ibkr-blue to-ibkr-navy rounded-lg flex items-center justify-center shadow-lg border border-ibkr-blue">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[var(--mh-primary)] mb-2 tracking-tight">Admin Access</h1>
            <p className="text-[var(--mh-ink)]/70 font-medium">Secure bank operations area</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-ibkr-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-ibkr-blue" />
                  Admin Password
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="input-field pr-10"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ibkr-gray-500 hover:text-ibkr-blue transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-ibkr-gray-500 mt-2 font-medium">This area is restricted to authorized personnel only</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-b from-ibkr-blue to-ibkr-navy hover:shadow-lg border border-ibkr-navy"
            >
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t-2 border-ibkr-gray-300">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-300">
              <p className="text-xs text-amber-900 font-semibold">
                🔐 This access is logged and monitored. Unauthorized access attempts will be recorded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
