import { useState } from 'react'
import { X, TrendingUp, TrendingDown, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'

interface PlaceTradeModalProps {
  isOpen: boolean
  onClose: () => void
  accountBalance: number
}

type OrderType = 'BUY' | 'SELL'
type OrderMethod = 'MARKET' | 'LIMIT' | 'STOP'

export default function PlaceTradeModal({ isOpen, onClose, accountBalance }: PlaceTradeModalProps) {
  const [orderType, setOrderType] = useState<OrderType>('BUY')
  const [orderMethod, setOrderMethod] = useState<OrderMethod>('MARKET')
  const [symbol, setSymbol] = useState('AAPL')
  const [quantity, setQuantity] = useState('100')
  const [limitPrice, setLimitPrice] = useState('150.00')
  const [stopPrice, setStopPrice] = useState('140.00')
  const [orderStatus, setOrderStatus] = useState<'form' | 'preview' | 'confirmed'>('form')

  // Mock market data
  const mockPrices: { [key: string]: number } = {
    AAPL: 150.25,
    MSFT: 380.45,
    GOOGL: 140.25,
    AMZN: 175.50,
    TSLA: 242.80,
    NFLX: 450.30,
    META: 320.15,
    NVDA: 875.20
  }

  const currentPrice = mockPrices[symbol] || 150.00
  const qty = parseInt(quantity) || 0
  const tradeValue = qty * (orderMethod === 'MARKET' ? currentPrice : parseFloat(limitPrice) || currentPrice)
  const estimatedCommission = tradeValue * 0.001 // 0.1% commission
  const totalCost = orderType === 'BUY' ? tradeValue + estimatedCommission : tradeValue - estimatedCommission
  const buyingPower = accountBalance
  const canExecute = orderType === 'BUY' ? totalCost <= buyingPower : qty > 0

  const handleSubmit = () => {
    if (canExecute) {
      setOrderStatus('preview')
    }
  }

  const handleConfirm = () => {
    setOrderStatus('confirmed')
    setTimeout(() => {
      setOrderStatus('form')
      onClose()
    }, 2500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            {orderType === 'BUY' ? (
              <TrendingUp className="w-6 h-6 text-green-600" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-600" />
            )}
            {orderStatus === 'form' && 'Place Trade'}
            {orderStatus === 'preview' && 'Review Order'}
            {orderStatus === 'confirmed' && 'Order Confirmed'}
          </h2>
          {orderStatus !== 'confirmed' && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          )}
        </div>

        <div className="p-6">
          {/* Form View */}
          {orderStatus === 'form' && (
            <div className="space-y-6">
              {/* Order Type Selector */}
              <div className="flex gap-4">
                <button
                  onClick={() => setOrderType('BUY')}
                  className={`flex-1 p-4 rounded-lg font-bold border-2 transition-all ${
                    orderType === 'BUY'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-gray-50 text-gray-900 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    BUY
                  </div>
                </button>
                <button
                  onClick={() => setOrderType('SELL')}
                  className={`flex-1 p-4 rounded-lg font-bold border-2 transition-all ${
                    orderType === 'SELL'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-gray-50 text-gray-900 hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    SELL
                  </div>
                </button>
              </div>

              {/* Symbol Input */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Symbol</label>
                <select
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-bold text-lg"
                >
                  {Object.keys(mockPrices).map((s) => (
                    <option key={s} value={s}>
                      {s} - ${mockPrices[s].toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-bold text-lg"
                  min="1"
                />
              </div>

              {/* Order Method */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Order Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['MARKET', 'LIMIT', 'STOP'] as OrderMethod[]).map((method) => (
                    <button
                      key={method}
                      onClick={() => setOrderMethod(method)}
                      className={`p-3 rounded-lg font-semibold text-sm transition-all border-2 ${
                        orderMethod === method
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-gray-50 text-gray-900 hover:border-blue-300'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Price Inputs */}
              {orderMethod === 'LIMIT' && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Limit Price</label>
                  <input
                    type="number"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-bold"
                    step="0.01"
                  />
                </div>
              )}

              {orderMethod === 'STOP' && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Stop Price</label>
                  <input
                    type="number"
                    value={stopPrice}
                    onChange={(e) => setStopPrice(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-bold"
                    step="0.01"
                  />
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Price:</span>
                    <span className="font-bold text-gray-900">${currentPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trade Value:</span>
                    <span className="font-bold text-gray-900">${tradeValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Commission:</span>
                    <span className="font-bold text-gray-900">${estimatedCommission.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 flex justify-between">
                    <span className="font-bold text-gray-900">Total Cost:</span>
                    <span className="font-bold text-lg text-blue-700">${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {!canExecute && orderType === 'BUY' && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-900">Insufficient Funds</p>
                    <p className="text-sm text-red-700">Need ${totalCost.toFixed(2)}, have ${buyingPower.toFixed(2)}</p>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canExecute}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
                    canExecute
                      ? orderType === 'BUY'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Review Order
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Preview View */}
          {orderStatus === 'preview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
                <div className="text-center mb-6">
                  <p className="text-gray-600 text-sm mb-2">Order Preview</p>
                  <p className={`text-3xl font-bold ${orderType === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                    {orderType} {qty} {symbol}
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-gray-700">Order Type:</span>
                    <span className="font-bold text-gray-900">{orderMethod}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-gray-700">Price per Share:</span>
                    <span className="font-bold text-gray-900">${(orderMethod === 'MARKET' ? currentPrice : parseFloat(limitPrice) || currentPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-gray-700">Quantity:</span>
                    <span className="font-bold text-gray-900">{qty}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-gray-700">Est. Commission:</span>
                    <span className="font-bold text-gray-900">${estimatedCommission.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-white rounded px-3 border-2 border-blue-300">
                    <span className="font-bold text-gray-900">Estimated Total:</span>
                    <span className={`text-2xl font-bold ${orderType === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                      ${totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setOrderStatus('form')}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold text-white transition-all ${
                    orderType === 'BUY'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirm & Send Order
                </button>
              </div>
            </div>
          )}

          {/* Confirmation View */}
          {orderStatus === 'confirmed' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Order Submitted</h3>
                <p className="text-gray-600 mb-6">Your {orderType} order has been placed successfully</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Order ID:</span>
                  <span className="font-bold font-mono">#ORD{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Status:</span>
                  <span className="font-bold text-green-600">PENDING</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Closing in 2 seconds...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
