import { useState } from 'react'
import { X, AlertCircle, Copy } from 'lucide-react'

interface AddFundsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (amount: number, paymentMethod: string, reference: string) => void
}

const PAYMENT_OPTIONS = [
  { key: 'ACH', label: 'ACH Transfer', detail: 'Direct bank-to-bank transfer' },
  { key: 'WIRE', label: 'Wire Transfer', detail: 'Institutional same-day transfer' },
  { key: 'INTERNAL', label: 'Internal Transfer', detail: 'Funds transfer from linked account' }
]

export default function AddFundsModal({ isOpen, onClose, onConfirm }: AddFundsModalProps) {
  const [step, setStep] = useState<'select' | 'amount' | 'confirm'>('select')
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [reference, setReference] = useState('')
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method)
    setStep('amount')
    setError('')
  }

  const handleAmountSubmit = () => {
    setError('')
    const parsedAmount = parseFloat(amount)

    if (!amount || isNaN(parsedAmount)) {
      setError('Please enter a valid amount')
      return
    }

    if (parsedAmount <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    setStep('confirm')
  }

  const handleConfirm = async () => {
    setError('')
    const parsedAmount = parseFloat(amount)

    if (!selectedMethod) {
      setError('Please select a payment method')
      return
    }

    if (!reference.trim()) {
      setError('Please enter a transfer reference or remittance ID')
      return
    }

    setIsProcessing(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      onConfirm(parsedAmount, selectedMethod, reference.trim())
      handleClose()
    } catch {
      setError('Failed to process transfer. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setStep('select')
    setSelectedMethod(null)
    setAmount('')
    setReference('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-ibkr-blue to-ibkr-navy p-6 flex justify-between items-center sticky top-0 z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Add Funds</h2>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Select payment method */}
          {step === 'select' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-6">
                Choose a secure payment method to add funds to your account.
              </p>

              {PAYMENT_OPTIONS.map((method) => (
                <button
                  key={method.key}
                  onClick={() => handleSelectMethod(method.key)}
                  className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-ibkr-blue hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold bg-[var(--mh-primary)]">
                      {method.key.slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{method.label}</h3>
                      <p className="text-xs text-gray-500">{method.detail}</p>
                    </div>
                    <div className="text-gray-400">→</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Enter Amount */}
          {step === 'amount' && selectedMethod && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => {
                    setStep('select')
                    setError('')
                  }}
                  className="text-ibkr-blue font-semibold text-sm hover:text-ibkr-navy"
                >
                  ← Change
                </button>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold bg-[var(--mh-primary)]">
                  {selectedMethod.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{PAYMENT_OPTIONS.find((m) => m.key === selectedMethod)?.label}</h3>
                  <p className="text-xs text-gray-500">{PAYMENT_OPTIONS.find((m) => m.key === selectedMethod)?.detail}</p>
                </div>
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-900 mb-2">
                  Add Funds Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value)
                      setError('')
                    }}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-ibkr-blue focus:outline-none text-lg"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Add a secure bank transfer or internal transfer amount.</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-900">{error}</p>
                </div>
              )}

              <button
                onClick={handleAmountSubmit}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Confirm Transfer
              </button>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && selectedMethod && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <span className="font-semibold text-gray-900">{PAYMENT_OPTIONS.find((m) => m.key === selectedMethod)?.label}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="font-bold text-lg text-gray-900">${parseFloat(amount).toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label htmlFor="reference" className="block text-sm font-semibold text-gray-900 mb-2">
                  Transfer Reference / Remittance ID
                </label>
                <input
                  id="reference"
                  type="text"
                  value={reference}
                  onChange={(e) => {
                    setReference(e.target.value)
                    setError('')
                  }}
                  placeholder="e.g., ACH-2026-001"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-ibkr-blue focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-2">This reference is stored in the transfer history for your receipt.</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-800">
                  Secure transfer submission is instant once approved. Your account history will show the added funds entry with the transfer detail.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-900">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('amount')}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isProcessing || !reference.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    '✓ Confirm Transfer'
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
