import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Download } from 'lucide-react'

interface Transaction {
  date: string
  type: 'deposit' | 'withdrawal' | 'dividend' | 'interest' | 'trade' | 'fee'
  amount: number
  description: string
  balance: number
}

interface User {
  firstName: string
  lastName: string
  account?: {
    transactions: Transaction[]
  }
}

export default function TransactionsPage() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        navigate('/login')
        return
      }

      const userData: User = JSON.parse(userStr)

      if (userData.account?.transactions) {
        const txns = [...userData.account.transactions].reverse() // Show newest first
        setTransactions(txns)
        setFilteredTransactions(txns)
      }
    } catch (err) {
      console.error('Error loading transactions:', err)
      navigate('/login')
    }
  }, [navigate])

  const handleFilter = (type: string) => {
    setFilterType(type)
    if (type === 'all') {
      setFilteredTransactions(transactions)
    } else {
      setFilteredTransactions(transactions.filter(t => t.type === type))
    }
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="w-4 h-4 text-green-600" />
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />
      case 'dividend':
        return <TrendingUp className="w-4 h-4 text-blue-600" />
      case 'interest':
        return <TrendingUp className="w-4 h-4 text-blue-600" />
      case 'trade':
        return <TrendingUp className="w-4 h-4 text-purple-600" />
      case 'fee':
        return <TrendingDown className="w-4 h-4 text-gray-600" />
      default:
        return null
    }
  }

  const getColorForType = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-700 bg-green-50'
      case 'withdrawal':
        return 'text-red-700 bg-red-50'
      case 'dividend':
        return 'text-blue-700 bg-blue-50'
      case 'interest':
        return 'text-blue-700 bg-blue-50'
      case 'trade':
        return 'text-purple-700 bg-purple-50'
      case 'fee':
        return 'text-gray-700 bg-gray-50'
      default:
        return 'text-gray-700 bg-gray-50'
    }
  }

  const getAmountColor = (amount: number) => {
    return amount >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const stats = {
    totalDeposits: transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0),
    totalDividends: transactions
      .filter(t => t.type === 'dividend')
      .reduce((sum, t) => sum + t.amount, 0),
    totalTrades: transactions
      .filter(t => t.type === 'trade')
      .reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container-max py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account History</h1>
              <p className="text-gray-600">Transaction history and account activity</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="container-max py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200">
            <p className="text-green-700 text-sm font-medium mb-2">Total Deposits</p>
            <h3 className="text-2xl font-bold text-green-900">
              ${stats.totalDeposits.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </h3>
          </div>

          <div className="card p-6 bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200">
            <p className="text-red-700 text-sm font-medium mb-2">Total Withdrawals</p>
            <h3 className="text-2xl font-bold text-red-900">
              -${stats.totalWithdrawals.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </h3>
          </div>

          <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200">
            <p className="text-blue-700 text-sm font-medium mb-2">Total Dividends & Interest</p>
            <h3 className="text-2xl font-bold text-blue-900">
              ${(stats.totalDividends).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </h3>
          </div>

          <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200">
            <p className="text-purple-700 text-sm font-medium mb-2">Trading Profits/Losses</p>
            <h3 className={`text-2xl font-bold ${stats.totalTrades >= 0 ? 'text-purple-900' : 'text-red-900'}`}>
              {stats.totalTrades >= 0 ? '+' : ''}{stats.totalTrades.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </h3>
          </div>

          <div className="card p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200">
            <p className="text-gray-700 text-sm font-medium mb-2">Total Transactions</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {transactions.length}
            </h3>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="card p-6 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">Filter by Type:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-ibkr-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilter('deposit')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'deposit'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => handleFilter('dividend')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'dividend'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dividends
            </button>
            <button
              onClick={() => handleFilter('interest')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'interest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Interest
            </button>
            <button
              onClick={() => handleFilter('trade')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'trade'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Trades
            </button>
            <button
              onClick={() => handleFilter('withdrawal')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'withdrawal'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Withdrawals
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Description</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getColorForType(transaction.type)}`}>
                        {getIconForType(transaction.type)}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{transaction.description}</span>
                    </td>
                    <td className={`px-6 py-4 text-right font-semibold text-sm ${getAmountColor(transaction.amount)}`}>
                      {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-sm text-gray-900">
                      ${transaction.balance.toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
