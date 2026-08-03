import { useState } from 'react'
import { X, AlertCircle, Copy } from 'lucide-react'

interface AddFundsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (amount: number, cryptoType: string, txHash: string) => void
}

const CRYPTO_OPTIONS = {
  BITCOIN: {
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: '₿',
    address: '1A1z7agoat7SFLb23c9UYGY67SV7gAXhdy',
    decimals: 8,
    color: '#F7931A'
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether (USDT)',
    icon: '₮',
    address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023D60C95600',
    decimals: 6,
    color: '#26A17B'
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin (USDC)',
    icon: '◎',
    address: 'EPjFWaYZgrkZQw7Z7V2P8L6g5gSzfEJbFi5r9aJXvLjq',
    decimals: 6,
    color: '#2775CA'
  }
}

type CryptoType = keyof typeof CRYPTO_OPTIONS

export default function AddFundsModal({ isOpen, onClose, onConfirm }: AddFundsModalProps) {
  const [step, setStep] = useState<'select' | 'amount' | 'confirm'>('select')
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType | null>(null)
  const [amount, setAmount] = useState('')
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)

  const handleSelectCrypto = (crypto: CryptoType) => {
    setSelectedCrypto(crypto)
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

    if (selectedCrypto === 'BITCOIN' && parsedAmount < 0.001) {
      setError('Minimum BTC deposit is 0.001 BTC')
      return
    }

    if ((selectedCrypto === 'USDT' || selectedCrypto === 'USDC') && parsedAmount < 10) {
      setError(`Minimum ${selectedCrypto} deposit is $10`)
      return
    }

    setStep('confirm')
  }

  const handleCopyAddress = () => {
    if (selectedCrypto) {
      navigator.clipboard.writeText(CRYPTO_OPTIONS[selectedCrypto].address)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    }
  }

  const handleConfirm = async () => {
    setError('')
    const parsedAmount = parseFloat(amount)

    if (!txHash.trim()) {
      setError('Please enter a transaction hash')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (selectedCrypto) {
        onConfirm(parsedAmount, selectedCrypto, txHash.trim())
      }
      handleClose()
    } catch (err) {
      setError('Failed to process deposit. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setStep('select')
    setSelectedCrypto(null)
    setAmount('')
    setTxHash('')
    setError('')
    setCopiedAddress(false)
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
          {/* Step 1: Select Crypto */}
          {step === 'select' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-6">
                Select cryptocurrency to deposit into your account
              </p>

              {Object.entries(CRYPTO_OPTIONS).map(([key, crypto]) => (
                <button
                  key={key}
                  onClick={() => handleSelectCrypto(key as CryptoType)}
                  className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-ibkr-blue hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                      style={{ backgroundColor: crypto.color }}
                    >
                      {crypto.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{crypto.name}</h3>
                      <p className="text-xs text-gray-500">{crypto.symbol}</p>
                    </div>
                    <div className="text-gray-400">→</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Enter Amount */}
          {step === 'amount' && selectedCrypto && (
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
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: CRYPTO_OPTIONS[selectedCrypto].color }}
                >
                  {CRYPTO_OPTIONS[selectedCrypto].icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{CRYPTO_OPTIONS[selectedCrypto].name}</h3>
                  <p className="text-xs text-gray-500">{CRYPTO_OPTIONS[selectedCrypto].symbol}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-900 font-semibold mb-2">Deposit Address:</p>
                <div className="flex gap-2 items-center">
                  <code className="flex-1 text-xs bg-white p-2 rounded border border-blue-200 overflow-x-auto font-mono text-gray-800">
                    {CRYPTO_OPTIONS[selectedCrypto].address}
                  </code>
                  <button
                    onClick={handleCopyAddress}
                    className="p-2 hover:bg-blue-100 rounded transition-colors"
                    title="Copy address"
                  >
                    <Copy className={`w-4 h-4 ${copiedAddress ? 'text-green-600' : 'text-blue-600'}`} />
                  </button>
                </div>
                {copiedAddress && (
                  <p className="text-xs text-green-600 mt-2 font-semibold">✓ Copied to clipboard</p>
                )}
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-900 mb-2">
                  Amount ({CRYPTO_OPTIONS[selectedCrypto].symbol})
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    {CRYPTO_OPTIONS[selectedCrypto].icon}
                  </span>
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
                    step="0.00000001"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {selectedCrypto === 'BITCOIN' ? 'Minimum: 0.001 BTC' : `Minimum: $10 ${selectedCrypto}`}
                </p>
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
                Next: Verify Deposit
              </button>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && selectedCrypto && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cryptocurrency:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: CRYPTO_OPTIONS[selectedCrypto].color }}
                    >
                      {CRYPTO_OPTIONS[selectedCrypto].icon}
                    </div>
                    <span className="font-semibold text-gray-900">{CRYPTO_OPTIONS[selectedCrypto].symbol}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="font-bold text-lg text-gray-900">
                    {parseFloat(amount).toFixed(8)} {CRYPTO_OPTIONS[selectedCrypto].symbol}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="txHash" className="block text-sm font-semibold text-gray-900 mb-2">
                  Transaction Hash (TxHash)
                </label>
                <input
                  id="txHash"
                  type="text"
                  value={txHash}
                  onChange={(e) => {
                    setTxHash(e.target.value)
                    setError('')
                  }}
                  placeholder="e.g., 0x123abc456def..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-ibkr-blue focus:outline-none font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  The blockchain transaction ID for your deposit
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  Please ensure you've sent the exact amount to the address provided. Once confirmed, it may take 10-30 minutes for the deposit to appear in your account.
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
                  disabled={isProcessing || !txHash.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    '✓ Confirm Deposit'
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
