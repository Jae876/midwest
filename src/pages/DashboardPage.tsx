import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowUpRight, Settings, Download, Send, Plus, Landmark, Wallet, ShieldCheck, PiggyBank } from 'lucide-react'
import WithdrawalModal from '@components/modals/WithdrawalModal'
import AddFundsModal from '@components/modals/AddFundsModal'
import PlaceTradeModal from '@components/modals/PlaceTradeModal'
import AdvancedChartsModal from '@components/modals/AdvancedChartsModal'
import AlertsModal from '@components/modals/AlertsModal'

function formatCardNumber(accountNumber = '') {
  const digits = accountNumber.replace(/\D/g, '')
  const numberSource = digits.padEnd(12, '0')
  const full = `4532${numberSource}`.slice(0, 16)
  return full.replace(/(.{4})/g, '$1 ').trim()
}

function formatAccountNumber(accountNumber = '') {
  const digits = accountNumber.replace(/\D/g, '')
  if (!digits) {
    return 'Pending'
  }
  return digits.padStart(10, '0').replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
}

function formatRoutingNumber(routingNumber = '') {
  const digits = routingNumber.replace(/\D/g, '')
  if (!digits) {
    return 'Pending'
  }
  return digits.padStart(9, '0').replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
}

function generateFallbackAccountNumber() {
  return `${Math.floor(1000 + Math.random() * 9000)}${Math.floor(100000 + Math.random() * 900000)}`
}

function generateFallbackRoutingNumber() {
  return `${Math.floor(100 + Math.random() * 900)}${Math.floor(100 + Math.random() * 900)}${Math.floor(100 + Math.random() * 900)}`
}

function generateCardExpiry(createdAt?: string) {
  const issued = new Date(createdAt || Date.now())
  if (Number.isNaN(issued.getTime())) {
    issued.setTime(Date.now())
  }
  const month = String(issued.getMonth() + 1).padStart(2, '0')
  const year = String(issued.getFullYear() + 4).slice(-2)
  return `${month}/${year}`
}

function generateCardCVV(accountNumber = '') {
  const digits = accountNumber.replace(/\D/g, '')
  if (digits.length < 3) {
    return '***'
  }
  return digits.slice(-3)
}

interface Position {
  symbol: string
  quantity: number
  avgCost: number
  currentPrice: number
  unrealizedPL: number
  unrealizedPLPercent: number
}

interface Transaction {
  date: string
  type: string
  amount: number
  description: string
  balance: number
}

interface PaymentMethodDetails {
  accountNumber: string
  routingNumber: string
  notes: string
}

interface User {
  firstName: string
  lastName: string
  account?: {
    balance: number
    buyingPower: number
    createdAt?: string
    totalDeposits?: number
    unrealizedGains?: number
    target?: number
    positions: Position[]
    transactions?: Transaction[]
    accountNumber?: string
    routingNumber?: string
  }
}

interface CardDetails {
  cardNumber: string
  expiry: string
  cvv: string
  cardHolder: string
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [positions, setPositions] = useState<Position[]>([])
  const [accountValue, setAccountValue] = useState(0)
  const [dayChange, setDayChange] = useState(0)
  const [dayChangePercent, setDayChangePercent] = useState(0)
  const [totalDeposits, setTotalDeposits] = useState(0)
  const [unrealizedGains, setUnrealizedGains] = useState(0)
  const [accountTarget, setAccountTarget] = useState(5000000)
  const [expandedCard, setExpandedCard] = useState<'accountValue' | 'netGains' | null>(null)
  const [showCardDetails, setShowCardDetails] = useState(false)
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false)
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false)
  const [isPlaceTradeOpen, setIsPlaceTradeOpen] = useState(false)
  const [isAdvancedChartsOpen, setIsAdvancedChartsOpen] = useState(false)
  const [isAlertsOpen, setIsAlertsOpen] = useState(false)
  const [withdrawalReceipt, setWithdrawalReceipt] = useState<{
    amount: number
    bankName: string
    accountNumber: string
    routingNumber: string
    message?: string
  } | null>(null)
  const [paymentDetails, setPaymentDetails] = useState<Record<string, PaymentMethodDetails>>({
    ACH: { accountNumber: '', routingNumber: '', notes: '' },
    WIRE: { accountNumber: '', routingNumber: '', notes: '' },
    INTERNAL: { accountNumber: '', routingNumber: '', notes: '' }
  })
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '4532 0000 0000 0000',
    expiry: '12/30',
    cvv: '000',
    cardHolder: 'Cardholder Name'
  })

  useEffect(() => {
    loadUserData()

    const loadPaymentDetails = async () => {
      try {
        const token = localStorage.getItem('token') || ''
        const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/admin/payment-settings`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setPaymentDetails({
            ACH: data.ACH || { accountNumber: '', routingNumber: '', notes: '' },
            WIRE: data.WIRE || { accountNumber: '', routingNumber: '', notes: '' },
            INTERNAL: data.INTERNAL || { accountNumber: '', routingNumber: '', notes: '' }
          })
          return
        }
      } catch (err) {
        console.warn('Failed to load payment details from server', err)
      }

      const stored = localStorage.getItem('adminPaymentSettings')
      if (stored) {
        try {
          setPaymentDetails(JSON.parse(stored))
        } catch {
          // ignore invalid stored settings
        }
      }
    }

    loadPaymentDetails()
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

      if (userData.account) {
        const positionsData = userData.account.positions || []
        setPositions(positionsData)

        const accountNumberValue = userData.account.accountNumber || generateFallbackAccountNumber()
        const routingNumberValue = userData.account.routingNumber || generateFallbackRoutingNumber()
        userData.account.accountNumber = accountNumberValue
        userData.account.routingNumber = routingNumberValue

        const totalUnrealizedPL = positionsData.reduce((sum, pos) => sum + pos.unrealizedPL, 0)
        setAccountValue(userData.account.balance)
        setDayChange(totalUnrealizedPL)
        setDayChangePercent((totalUnrealizedPL / Math.max(userData.account.balance, 1)) * 100)
        setTotalDeposits(userData.account.totalDeposits || 0)
        setUnrealizedGains(userData.account.unrealizedGains || 0)
        setAccountTarget(userData.account.target || 5000000)

        setCardDetails({
          cardNumber: formatCardNumber(accountNumberValue),
          expiry: generateCardExpiry(userData.account.createdAt),
          cvv: generateCardCVV(accountNumberValue),
          cardHolder: `${userData.firstName} ${userData.lastName}`
        })

        localStorage.setItem('user', JSON.stringify(userData))
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      navigate('/login')
    }
  }

  const handleAddFunds = async (amount: number, paymentMethod: string, reference: string) => {
    try {
      const userStr = localStorage.getItem('user')
      if (!userStr) return

      const userData: User = JSON.parse(userStr)
      if (!userData.account) return

      const newBalance = userData.account.balance + amount
      const description = `Bank transfer deposit via ${paymentMethod} — ref ${reference}`

      const newTransaction: Transaction = {
        date: new Date().toISOString().split('T')[0],
        type: 'deposit',
        amount,
        description,
        balance: newBalance
      }

      userData.account.balance = newBalance
      userData.account.totalDeposits = (userData.account.totalDeposits || 0) + amount

      if (!userData.account.transactions) userData.account.transactions = []
      userData.account.transactions.push(newTransaction)

      // Persist to server-side DB
      try {
        const token = localStorage.getItem('token') || ''
        await fetch(`${import.meta.env.VITE_API_URL || '/api'}/admin/users`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ operation: 'deposit', amount, paymentMethod, reference })
        })
      } catch (err) {
        console.warn('Server deposit failed, storing locally as fallback')
      }

      localStorage.setItem('user', JSON.stringify(userData))
      loadUserData()
    } catch (err) {
      console.error('Error processing deposit:', err)
    }
  }

  const handleWithdrawalConfirm = async (amount: number, bankName: string, accountNumber: string, routingNumber: string) => {
    try {
      const userStr = localStorage.getItem('user')
      if (!userStr) return

      const userData: User = JSON.parse(userStr)
      if (!userData.account) return

      const token = localStorage.getItem('token') || ''
      const resp = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/admin/users`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ operation: 'withdrawal', amount, bankName, accountNumber, routingNumber })
      })

      const data = await resp.json().catch(() => ({}))
      if (!resp.ok) {
        console.warn('Server withdrawal failed:', data)
      }

      const newBalance = userData.account.balance - amount
      const newTransaction: Transaction = {
        date: new Date().toISOString().split('T')[0],
        type: 'withdrawal',
        amount: -amount,
        description: `Withdrawal to ${bankName} (••••${accountNumber.slice(-4)}) - routing ${routingNumber}`,
        balance: newBalance
      }

      userData.account.balance = newBalance
      if (!userData.account.transactions) userData.account.transactions = []
      userData.account.transactions.push(newTransaction)
      localStorage.setItem('user', JSON.stringify(userData))
      loadUserData()

      setWithdrawalReceipt({
        amount,
        bankName,
        accountNumber,
        routingNumber,
        message: data.receipt?.reference || 'Withdrawal processed successfully.'
      })
    } catch (err) {
      console.error('Error processing withdrawal:', err)
    }
  }

  return (
    <div className="bg-[var(--mh-surface)] min-h-screen">
      <div className="bg-white border-b border-[var(--mh-primary)]/10 sticky top-16 z-40">
        <div className="container-max py-6">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-[var(--mh-primary)]/65 mb-1">Member FDIC</div>
              <h1 className="text-3xl font-bold text-[var(--mh-primary)]">Banking Dashboard</h1>
              <p className="text-[var(--mh-ink)]/70">Welcome back, {user ? `${user.firstName} ${user.lastName}` : 'User'} — your checking, savings, and mortgage details are all in one secure place.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-[var(--mh-accent-soft)] rounded-lg transition-colors" title="Download statement">
                <Download className="w-6 h-6 text-[var(--mh-primary)]" />
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="p-2 hover:bg-[var(--mh-accent-soft)] rounded-lg transition-colors"
                title="Account Settings"
              >
                <Settings className="w-6 h-6 text-[var(--mh-primary)]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-max py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div
            onClick={() => setExpandedCard(expandedCard === 'accountValue' ? null : 'accountValue')}
            className={`rounded-2xl bg-white border border-[var(--mh-primary)]/10 p-6 cursor-pointer shadow-sm transition-all duration-300 hover:shadow-lg ${expandedCard === 'accountValue' ? 'md:col-span-2 row-span-2' : ''}`}
          >
            <p className="text-[var(--mh-ink)]/70 text-sm font-medium mb-2">Available Balance</p>
            <h3 className={`font-bold text-[var(--mh-primary)] mb-2 transition-all duration-300 ${expandedCard === 'accountValue' ? 'text-5xl' : 'text-2xl'}`}>
              ${accountValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </h3>
            <div className="flex items-center space-x-2 text-emerald-600">
              <ArrowUpRight className={`transition-all duration-300 ${expandedCard === 'accountValue' ? 'w-6 h-6' : 'w-4 h-4'}`} />
              <span className={`font-medium transition-all duration-300 ${expandedCard === 'accountValue' ? 'text-lg' : 'text-sm'}`}>
                +${dayChange.toLocaleString('en-US', { minimumFractionDigits: 0 })} ({dayChangePercent.toFixed(2)}%)
              </span>
            </div>
            {expandedCard === 'accountValue' && (
              <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <div className="grid gap-3 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Account Number</span>
                    <span className="tracking-[0.2em]">{formatAccountNumber(user?.account?.accountNumber || '')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Routing Number</span>
                    <span className="tracking-[0.2em]">{formatRoutingNumber(user?.account?.routingNumber || '')}</span>
                  </div>
                </div>
              </div>
            )}
            {expandedCard === 'accountValue' && (
              <div className="mt-6 pt-6 border-t border-[var(--mh-primary)]/10 space-y-4">
                <div>
                  <p className="text-[var(--mh-ink)]/70 text-sm font-medium mb-2">Target Savings</p>
                  <p className="text-2xl font-bold text-[var(--mh-primary)]">
                    ${accountTarget.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--mh-ink)]/70 text-sm font-medium mb-2">Amount to Target</p>
                  <p className="text-lg font-semibold text-[var(--mh-primary)]">
                    ${Math.max(0, accountTarget - accountValue).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--mh-ink)]/70 text-sm font-medium mb-2">Progress</p>
                  <div className="w-full bg-[var(--mh-accent-soft)] rounded-full h-2 mb-1">
                    <div
                      className="bg-[var(--mh-primary)] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((accountValue / accountTarget) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm font-semibold text-[var(--mh-primary)]">
                    {Math.min((accountValue / accountTarget) * 100, 100).toFixed(1)}% of target
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate('/profile')
                  }}
                  className="w-full mt-4 px-3 py-2 bg-[var(--mh-accent-soft)] text-[var(--mh-primary)] font-medium rounded-lg hover:opacity-90 transition text-sm"
                >
                  Edit Target
                </button>
                <p className="text-xs text-[var(--mh-ink)]/60 text-center">Click to collapse</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white border border-[var(--mh-primary)]/10 p-6 shadow-sm">
            <p className="text-[var(--mh-ink)]/70 text-sm font-medium mb-2">Total Deposits</p>
            <h3 className="text-2xl font-bold text-[var(--mh-primary)] mb-2">${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 0 })}</h3>
            <p className="text-sm text-[var(--mh-ink)]/60">Lifetime activity</p>
          </div>

          <div
            onClick={() => setExpandedCard(expandedCard === 'netGains' ? null : 'netGains')}
            className={`rounded-2xl bg-white border border-[var(--mh-primary)]/10 p-6 cursor-pointer shadow-sm transition-all duration-300 hover:shadow-lg ${expandedCard === 'netGains' ? 'md:col-span-2 row-span-2' : ''}`}
          >
            <p className="text-[var(--mh-ink)]/70 text-sm font-medium mb-2">Interest Gains</p>
            <h3 className={`font-bold text-emerald-600 mb-2 transition-all duration-300 ${expandedCard === 'netGains' ? 'text-5xl' : 'text-2xl'}`}>
              ${unrealizedGains.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </h3>
            <p className={`text-[var(--mh-ink)]/60 transition-all duration-300 ${expandedCard === 'netGains' ? 'text-base' : 'text-sm'}`}>
              Savings & dividends
            </p>
            {expandedCard === 'netGains' && (
              <div className="mt-4 pt-4 border-t border-[var(--mh-primary)]/10 text-sm text-[var(--mh-ink)]/70">
                <p>Click to collapse</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white border border-[var(--mh-primary)]/10 p-6 shadow-sm">
            <p className="text-[var(--mh-ink)]/70 text-sm font-medium mb-2">Active Services</p>
            <h3 className="text-2xl font-bold text-[var(--mh-primary)] mb-2">{positions.length || 3}</h3>
            <p className="text-sm text-[var(--mh-ink)]/60">Membership services ready to use</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 mb-12">
          <button
            type="button"
            onClick={() => setShowCardDetails((prev) => !prev)}
            className="group rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-8 shadow-2xl border border-white/5 text-left hover:shadow-2xl transition-all duration-300"
            aria-expanded={showCardDetails}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Digital Visa Debit</p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight">Your Bank Card</h2>
              </div>
              <div className="text-right text-xs text-slate-500">{showCardDetails ? 'Details visible' : 'Tap to reveal'}</div>
            </div>

            <div className="mt-8">
              {showCardDetails ? (
                <div className="space-y-6">
                  <div className="text-lg tracking-[0.22em] font-semibold">{cardDetails.cardNumber}</div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                    <div>
                      <p className="uppercase text-[0.65rem] tracking-[0.25em] text-slate-500">Card Holder</p>
                      <p className="mt-2 font-medium text-white">{cardDetails.cardHolder}</p>
                    </div>
                    <div>
                      <p className="uppercase text-[0.65rem] tracking-[0.25em] text-slate-500">Expires</p>
                      <p className="mt-2 font-medium text-white">{cardDetails.expiry}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="uppercase tracking-[0.2em] text-slate-500">CVV</span>
                      <span className="font-semibold text-white">{cardDetails.cvv}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl bg-white/5 p-6 text-slate-300">
                  <p className="text-2xl tracking-[0.22em] font-semibold">•••• •••• •••• ••••</p>
                  <p className="mt-3 text-sm text-slate-400">Tap to reveal your virtual debit card details.</p>
                </div>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 transition-opacity duration-300">
              {showCardDetails ? (
                <p>Tap again to hide sensitive card details.</p>
              ) : (
                <p>Tap this card to show your full debit card information.</p>
              )}
            </div>
          </button>

          <div className="grid grid-cols-1 gap-6">
            <button onClick={() => setIsAddFundsOpen(true)} className="rounded-2xl bg-white border border-[var(--mh-primary)]/10 p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-[var(--mh-primary)]">Add Funds</h3>
                  <p className="text-xs text-[var(--mh-ink)]/60">Transfer in money from your linked account</p>
                </div>
              </div>
            </button>

            <button onClick={() => {
              setWithdrawalReceipt(null)
              setIsWithdrawalOpen(true)
            }} className="rounded-2xl bg-white border border-[var(--mh-primary)]/10 p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Send className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-[var(--mh-primary)]">Withdraw</h3>
                  <p className="text-xs text-[var(--mh-ink)]/60">Move funds securely to a bank account</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {[
            { key: 'checking', title: 'Checking', icon: Wallet, desc: 'Manage daily spending and transfers' },
            { key: 'loan', title: 'Mortgage', icon: Landmark, desc: 'Review home loan details and support' },
            { key: 'insurance', title: 'Insurance', icon: ShieldCheck, desc: 'Protection, claims, and coverage tools' },
            { key: 'savings', title: 'Savings', icon: PiggyBank, desc: 'Grow your reserves with high-yield options' }
          ].map((item) => {
            const Icon = item.icon
            return (
              <button key={item.key} onClick={() => setIsPlaceTradeOpen(true)} className="rounded-2xl bg-white border border-[var(--mh-primary)]/10 p-6 text-left hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[var(--mh-accent-soft)] text-[var(--mh-primary)] flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="font-bold text-[var(--mh-primary)] mb-1">{item.title}</div>
                <div className="text-sm text-[var(--mh-ink)]/70">{item.desc}</div>
              </button>
            )
          })}
        </div>

        <div className="card">
          <div className="p-6 border-b border-[var(--mh-primary)]/10">
            <h2 className="text-xl font-bold text-[var(--mh-primary)]">Recent Activity</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--mh-accent-soft)] border-b border-[var(--mh-primary)]/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[var(--mh-primary)]">Type</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-[var(--mh-primary)]">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[var(--mh-primary)]">Description</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-[var(--mh-primary)]">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--mh-primary)]/10">
                {(user?.account?.transactions || []).slice(0, 6).map((transaction, index) => (
                  <tr key={`${transaction.description}-${index}`} className="hover:bg-[var(--mh-accent-soft)]/40 transition-colors">
                    <td className="px-6 py-4 text-sm text-[var(--mh-ink)] font-semibold capitalize">{transaction.type}</td>
                    <td className={`px-6 py-4 text-sm text-right font-semibold ${transaction.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {transaction.amount >= 0 ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--mh-ink)]/80">{transaction.description}</td>
                    <td className="px-6 py-4 text-sm text-right text-[var(--mh-ink)]">${transaction.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <button onClick={() => navigate('/profile')} className="rounded-2xl bg-white border border-[var(--mh-primary)]/10 p-8 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="font-bold text-[var(--mh-primary)] mb-2">Account Details</h3>
            <p className="text-[var(--mh-ink)]/70 text-sm">Manage your profile and secure access</p>
          </button>

          <button onClick={() => navigate('/transactions')} className="rounded-2xl bg-white border border-[var(--mh-primary)]/10 p-8 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="font-bold text-[var(--mh-primary)] mb-2">Statements</h3>
            <p className="text-[var(--mh-ink)]/70 text-sm">Review deposits, transfers, and activity</p>
          </button>

          <button onClick={() => setIsAlertsOpen(true)} className="rounded-2xl bg-white border border-[var(--mh-primary)]/10 p-8 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="font-bold text-[var(--mh-primary)] mb-2">Alerts</h3>
            <p className="text-[var(--mh-ink)]/70 text-sm">Stay on top of your account goals</p>
          </button>

          <Link to="/transactions" className="rounded-2xl bg-white border border-[var(--mh-primary)]/10 p-8 text-center hover:shadow-lg transition-shadow cursor-pointer hover:bg-[var(--mh-accent-soft)]">
            <div className="text-4xl mb-4">🏦</div>
            <h3 className="font-bold text-[var(--mh-primary)] mb-2">History</h3>
            <p className="text-[var(--mh-ink)]/70 text-sm">Full transaction history</p>
          </Link>
        </div>
      </div>

      {withdrawalReceipt && (
        <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-sm text-emerald-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-emerald-900">Withdrawal receipt</p>
              <p className="mt-3">Amount: ${withdrawalReceipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              <p>Bank: {withdrawalReceipt.bankName}</p>
              <p>Account: ••••{withdrawalReceipt.accountNumber.slice(-4)}</p>
              <p>Routing: {withdrawalReceipt.routingNumber}</p>
              {withdrawalReceipt.message && <p className="mt-3 text-emerald-800">{withdrawalReceipt.message}</p>}
            </div>
            <button
              onClick={() => setWithdrawalReceipt(null)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <WithdrawalModal
        isOpen={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
        availableBalance={accountValue}
        onConfirm={handleWithdrawalConfirm}
      />

      <AddFundsModal
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
        onConfirm={handleAddFunds}
      paymentDetails={paymentDetails}
      />

      <PlaceTradeModal
        isOpen={isPlaceTradeOpen}
        onClose={() => setIsPlaceTradeOpen(false)}
        accountBalance={accountValue}
      />

      <AdvancedChartsModal
        isOpen={isAdvancedChartsOpen}
        onClose={() => setIsAdvancedChartsOpen(false)}
      />

      <AlertsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
      />
    </div>
  )
}
