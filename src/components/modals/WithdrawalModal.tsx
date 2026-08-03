import { useState } from 'react'
import { X, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react'

interface WithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
  availableBalance: number
  accountTarget?: number
  accountInfo?: { createdAt: string }
  onConfirm: (amount: number, bankName: string, accountNumber: string, routingNumber: string) => void
  onDepositRequired?: (amount: number, withdrawAmount: number, bankName: string, accountNumber: string, routingNumber: string) => void
}

const US_BANKS = [
  { name: 'Bank of America', code: 'BOA' },
  { name: 'Chase Bank', code: 'CHASE' },
  { name: 'Wells Fargo', code: 'WF' },
  { name: 'Citibank', code: 'CITI' },
  { name: 'U.S. Bank', code: 'USB' },
  { name: 'PNC Bank', code: 'PNC' },
  { name: 'Capital One', code: 'CON' },
  { name: 'TD Bank', code: 'TDB' },
  { name: 'Ally Bank', code: 'ALLY' },
  { name: 'Charles Schwab Bank', code: 'CSB' },
  { name: 'Fidelity Bank', code: 'FB' },
  { name: 'Other', code: 'OTHER' },
]

export default function WithdrawalModal({ isOpen, onClose, availableBalance, accountTarget = 5000000, accountInfo, onConfirm, onDepositRequired }: WithdrawalModalProps) {
  const [step, setStep] = useState<'amount' | 'bank' | 'deposit' | 'confirm' | 'rescheduled'>('amount')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false)
  const [accountNumber, setAccountNumber] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [depositConfirmed, setDepositConfirmed] = useState(false)

  // Calculate account age and withdrawal fee percentage
  const calculateFeePercentage = (): { percentage: number; reason: string } => {
    const accountTarget = 4000000 // $4M target
    const accountAgeDays = accountInfo?.createdAt 
      ? Math.floor((new Date().getTime() - new Date(accountInfo.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0
    const accountAgeYears = accountAgeDays / 365

    // If balance >= $4M OR account >= 5 years old: 10% fee, otherwise 20%
    if (availableBalance >= accountTarget || accountAgeYears >= 5) {
      const reason = availableBalance >= accountTarget 
        ? `✓ Account balance meets $4M target`
        : `✓ Account is ${Math.floor(accountAgeYears)} years old (5+ years)`
      return { percentage: 10, reason }
    } else {
      const yearsLeft = (5 - accountAgeYears).toFixed(1)
      return { 
        percentage: 20, 
        reason: `Account is ${Math.floor(accountAgeYears)} years old (${yearsLeft} years until 10% rate)`
      }
    }
  }

  const feeInfo = calculateFeePercentage()

  const calculateDepositRequired = (amount: number): number => {
    return Math.ceil(amount * (feeInfo.percentage / 100))
  }

  const handleAmountSubmit = () => {
    setError('')
    const amount = parseFloat(withdrawAmount)

    if (!withdrawAmount || isNaN(amount)) {
      setError('Please enter a valid amount')
      return
    }

    if (amount <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    if (amount > availableBalance) {
      setError(`Amount cannot exceed available balance of $${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
      return
    }

    setStep('bank')
  }

  const handleBankDetailsSubmit = () => {
    setError('')

    if (!selectedBank.trim()) {
      setError('Please select a bank')
      return
    }

    if (!accountNumber.trim()) {
      setError('Please enter your account number')
      return
    }

    if (accountNumber.length < 8) {
      setError('Account number must be at least 8 digits')
      return
    }

    if (!routingNumber.trim()) {
      setError('Please enter your routing number')
      return
    }

    if (routingNumber.length !== 9) {
      setError('Routing number must be 9 digits')
      return
    }

    setStep('deposit')
  }

  const handleDepositConfirm = async () => {
    setError('')
    
    // Call the callback to trigger crypto deposit
    if (onDepositRequired) {
      const depositAmount = calculateDepositRequired(parseFloat(withdrawAmount))
      const selectedBankObj = US_BANKS.find(b => b.code === selectedBank)
      const bankName = selectedBankObj?.name || selectedBank
      
      onDepositRequired(depositAmount, parseFloat(withdrawAmount), bankName, accountNumber, routingNumber)
      // Modal will close and AddFundsModal will open from parent
    }
  }

  const handleFinalConfirm = async () => {
    setError('')
    setIsProcessing(true)

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      const amount = parseFloat(withdrawAmount)
      const selectedBankObj = US_BANKS.find(b => b.code === selectedBank)
      const bankName = selectedBankObj?.name || selectedBank

      onConfirm(amount, bankName, accountNumber, routingNumber)
      handleClose()
    } catch (err) {
      setError('Failed to process withdrawal. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setStep('amount')
    setWithdrawAmount('')
    setSelectedBank('')
    setAccountNumber('')
    setRoutingNumber('')
    setError('')
    setDepositConfirmed(false)
    onClose()
  }

  if (!isOpen) return null

  const withdrawAmount_num = parseFloat(withdrawAmount) || 0
  const depositRequired = withdrawAmount_num > 0 ? calculateDepositRequired(withdrawAmount_num) : 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-ibkr-blue to-ibkr-navy p-6 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Withdraw Funds</h2>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Check if target is not met - show rescheduled state */}
          {availableBalance < accountTarget && (
            <div className="space-y-6">
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6 text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Withdrawal Rescheduled</h3>
                <p className="text-sm text-amber-800 mb-4">
                  Withdrawals are temporarily paused while you're building toward your account target.
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Current Balance</p>
                      <p className="text-lg font-bold text-gray-900">
                        ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Target Amount</p>
                      <p className="text-lg font-bold text-amber-600">
                        ${accountTarget.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 font-medium mb-2">Progress to Target</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((availableBalance / accountTarget) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-700 mt-2 font-semibold">
                      {((availableBalance / accountTarget) * 100).toFixed(1)}% complete
                    </p>
                  </div>
                </div>

                <p className="text-xs text-amber-700 mb-4">
                  Once you reach your target of ${accountTarget.toLocaleString('en-US', { minimumFractionDigits: 0 })}, you'll be able to withdraw funds.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* Original withdrawal flow - only show if target is met */}
          {availableBalance >= accountTarget && (
            <>
          {/* Step 1: Enter Amount */}
          {step === 'amount' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Available Balance
                </label>
                <div className="text-3xl font-bold text-ibkr-blue">
                  ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-900 mb-2">
                  Withdrawal Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                  <input
                    id="amount"
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => {
                      setWithdrawAmount(e.target.value)
                      setError('')
                    }}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-ibkr-blue focus:outline-none text-lg"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {withdrawAmount_num > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">{feeInfo.percentage}% Deposit Required:</span> You'll need to deposit ${depositRequired.toLocaleString('en-US', { minimumFractionDigits: 2 })} via cryptocurrency to proceed.
                  </p>
                  <p className="text-xs text-blue-700 italic">{feeInfo.reason}</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-900">{error}</p>
                </div>
              )}

              <button
                onClick={handleAmountSubmit}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Bank Details
              </button>
            </div>
          )}

          {/* Step 2: Bank Details */}
          {step === 'bank' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">Bank Account Required</p>
                  <p className="text-xs text-amber-800">
                    Please enter the bank account where your withdrawal will be sent
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Bank
                </label>
                <div className="relative">
                  <button
                    onClick={() => setBankDropdownOpen(!bankDropdownOpen)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-ibkr-blue focus:outline-none text-left flex justify-between items-center bg-white hover:border-gray-400 transition-colors"
                  >
                    <span className="text-gray-900">
                      {selectedBank ? US_BANKS.find(b => b.code === selectedBank)?.name : 'Select a bank'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${bankDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {bankDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {US_BANKS.map((bank) => (
                        <button
                          key={bank.code}
                          onClick={() => {
                            setSelectedBank(bank.code)
                            setBankDropdownOpen(false)
                            setError('')
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-ibkr-light-blue hover:text-ibkr-blue text-gray-900 font-medium border-b border-gray-200 last:border-b-0 transition-colors"
                        >
                          {bank.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="account" className="block text-sm font-semibold text-gray-900 mb-2">
                  Account Number
                </label>
                <input
                  id="account"
                  type="text"
                  value={accountNumber}
                  onChange={(e) => {
                    setAccountNumber(e.target.value.replace(/\D/g, ''))
                    setError('')
                  }}
                  placeholder="Enter account number"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-ibkr-blue focus:outline-none"
                  maxLength={17}
                />
                <p className="text-xs text-gray-500 mt-1">8-17 digits</p>
              </div>

              <div>
                <label htmlFor="routing" className="block text-sm font-semibold text-gray-900 mb-2">
                  Routing Number
                </label>
                <input
                  id="routing"
                  type="text"
                  value={routingNumber}
                  onChange={(e) => {
                    setRoutingNumber(e.target.value.replace(/\D/g, ''))
                    setError('')
                  }}
                  placeholder="Enter routing number"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-ibkr-blue focus:outline-none"
                  maxLength={9}
                />
                <p className="text-xs text-gray-500 mt-1">9 digits (ABA routing number)</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-900">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep('amount')
                    setError('')
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleBankDetailsSubmit}
                  className="flex-1 btn-primary"
                >
                  Next: Crypto Deposit
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Deposit Required */}
          {step === 'deposit' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900">Deposit Required</p>
                  <p className="text-xs text-green-800 mt-1">
                    You must deposit cryptocurrency to proceed with this withdrawal
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Withdrawal Amount:</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${withdrawAmount_num.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">{feeInfo.percentage}% Crypto Deposit Required:</span>
                  <span className="text-lg font-bold text-green-600">
                    ${depositRequired.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <p className="text-sm text-blue-900">
                  Click the button below to deposit the required amount using Bitcoin, USDT, or USDC. You'll be redirected to the deposit form with the specific amount required.
                </p>
                <p className="text-xs text-blue-700 italic">{feeInfo.reason}</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-900">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep('bank')
                    setError('')
                  }}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleDepositConfirm}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    '→ Deposit Crypto'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 'confirm' && depositConfirmed && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900">Deposit Confirmed</p>
                  <p className="text-xs text-green-800 mt-1">
                    Your ${depositRequired.toLocaleString('en-US', { minimumFractionDigits: 2 })} deposit has been verified
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-2">WITHDRAWAL DETAILS:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-gray-900">
                        ${withdrawAmount_num.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank:</span>
                      <span className="font-bold text-gray-900">
                        {US_BANKS.find(b => b.code === selectedBank)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account:</span>
                      <span className="font-bold text-gray-900">
                        ••••{accountNumber.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">New Balance:</span>
                  <span className="text-lg font-bold text-ibkr-blue">
                    ${(availableBalance - withdrawAmount_num).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('deposit')}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleFinalConfirm}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    '✓ Complete Withdrawal'
                  )}
                </button>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
