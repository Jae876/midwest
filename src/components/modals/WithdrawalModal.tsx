import { useState } from 'react'
import { X, AlertCircle, ChevronDown } from 'lucide-react'

interface WithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
  availableBalance: number
  onConfirm: (amount: number, bankName: string, accountNumber: string, routingNumber: string) => void
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
  { name: 'Banco de Bogotá', code: 'BOGOTA' },
  { name: 'Davivienda', code: 'DAVIVIENDA' },
  { name: 'Bancolombia', code: 'BANCOLOMBIA' },
  { name: 'Colombia Bank', code: 'COLOMBIA_BANK' },
  { name: 'Other', code: 'OTHER' },
]

export default function WithdrawalModal({ isOpen, onClose, availableBalance, onConfirm }: WithdrawalModalProps) {
  const [step, setStep] = useState<'amount' | 'bank' | 'confirm'>('amount')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false)
  const [accountNumber, setAccountNumber] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Calculate account age and withdrawal fee percentage
  const calculateFeePercentage = (): { percentage: number; reason: string } => {
    return { percentage: 0, reason: `This withdrawal is routed through a secure bank transfer.` }
  }

  const feeInfo = calculateFeePercentage()

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

    setStep('confirm')
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
    onClose()
  }

  if (!isOpen) return null

  const withdrawAmount_num = parseFloat(withdrawAmount) || 0

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
          {/* Withdrawal flow is now available for all eligible bank transfers. */}
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
                    <span className="font-semibold">Transfer review:</span> This withdrawal proceeds through the secure banking transfer queue.
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
                  Next: Review Withdrawal
                </button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-900 mb-1">Ready to Withdraw</p>
                <p className="text-xs text-green-800">
                  Confirm the transfer to your selected bank account and receive a withdrawal receipt.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Withdrawal Amount:</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${withdrawAmount_num.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bank:</span>
                  <span className="font-semibold text-gray-900">
                    {US_BANKS.find(b => b.code === selectedBank)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account:</span>
                  <span className="font-semibold text-gray-900">••••{accountNumber.slice(-4)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Routing:</span>
                  <span className="font-semibold text-gray-900">{routingNumber}</span>
                </div>
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
                    '✓ Confirm Withdrawal'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
