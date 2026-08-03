import { useState } from 'react'
import { X, TrendingUp, Settings2 } from 'lucide-react'

interface AdvancedChartsModalProps {
  isOpen: boolean
  onClose: () => void
}

type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y'
type ChartType = 'line' | 'candlestick' | 'bars'

export default function AdvancedChartsModal({ isOpen, onClose }: AdvancedChartsModalProps) {
  const [symbol, setSymbol] = useState('AAPL')
  const [timeframe, setTimeframe] = useState<Timeframe>('1D')
  const [chartType, setChartType] = useState<ChartType>('line')

  const mockPrices: { [key: string]: { current: number; high: number; low: number; change: number } } = {
    AAPL: { current: 150.25, high: 152.80, low: 148.50, change: 2.35 },
    MSFT: { current: 380.45, high: 385.20, low: 378.90, change: 4.10 },
    GOOGL: { current: 140.25, high: 142.60, low: 139.10, change: 1.85 },
    AMZN: { current: 175.50, high: 178.90, low: 174.25, change: 3.50 },
    TSLA: { current: 242.80, high: 248.50, low: 240.20, change: 5.25 },
    NFLX: { current: 450.30, high: 455.80, low: 448.50, change: 6.75 },
    META: { current: 320.15, high: 325.90, low: 318.70, change: 4.45 },
    NVDA: { current: 875.20, high: 885.30, low: 870.50, change: 12.50 }
  }

  const data = mockPrices[symbol]

  // Generate mock data points for chart
  const generateChartData = () => {
    const points = []
    let value = data.current
    for (let i = 0; i < 50; i++) {
      const change = (Math.random() - 0.5) * 5
      value += change
      points.push({
        x: i,
        y: Math.max(data.low, Math.min(data.high, value)),
        open: value - 1,
        high: value + 1,
        low: value - 1.5,
        close: value
      })
    }
    return points
  }

  const chartData = generateChartData()
  const maxPrice = Math.max(...chartData.map((p) => p.high))
  const minPrice = Math.min(...chartData.map((p) => p.low))
  const priceRange = maxPrice - minPrice

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Advanced Charts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Symbol</label>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-bold"
              >
                {Object.keys(mockPrices).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as Timeframe)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-bold"
              >
                {(['1D', '1W', '1M', '3M', '1Y'] as Timeframe[]).map((tf) => (
                  <option key={tf} value={tf}>
                    {tf}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Chart Type</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as ChartType)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-bold"
              >
                <option value="line">Line</option>
                <option value="candlestick">Candlestick</option>
                <option value="bars">Bars</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Settings2 className="w-4 h-4" />
                Indicators
              </button>
            </div>
          </div>

          {/* Price Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <p className="text-xs text-gray-600 font-semibold mb-1 uppercase">Current Price</p>
              <p className="text-2xl font-bold text-blue-600">${data.current.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <p className="text-xs text-gray-600 font-semibold mb-1 uppercase">24h High</p>
              <p className="text-2xl font-bold text-green-600">${data.high.toFixed(2)}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
              <p className="text-xs text-gray-600 font-semibold mb-1 uppercase">24h Low</p>
              <p className="text-2xl font-bold text-red-600">${data.low.toFixed(2)}</p>
            </div>
            <div className={`rounded-lg p-4 border-2 ${data.change > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className="text-xs text-gray-600 font-semibold mb-1 uppercase">Change</p>
              <p className={`text-2xl font-bold ${data.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.change > 0 ? '+' : ''}{data.change.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Chart Area */}
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 h-64 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-right pr-2 text-xs text-gray-600 font-semibold">
              <span>${maxPrice.toFixed(0)}</span>
              <span>${((maxPrice + minPrice) / 2).toFixed(0)}</span>
              <span>${minPrice.toFixed(0)}</span>
            </div>

            {/* SVG Chart */}
            <svg className="w-full h-full ml-12" viewBox="0 0 600 200" preserveAspectRatio="none">
              {/* Grid */}
              <line x1="0" y1="50" x2="600" y2="50" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="150" x2="600" y2="150" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />

              {/* Chart Type: Line */}
              {chartType === 'line' && (
                <polyline
                  points={chartData
                    .map((p) => {
                      const x = (p.x / chartData.length) * 600
                      const y = 200 - ((p.y - minPrice) / priceRange) * 200
                      return `${x},${y}`
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Chart Type: Candlestick */}
              {chartType === 'candlestick' && (
                <>
                  {chartData.map((p, idx) => {
                    const x = (p.x / chartData.length) * 600
                    const width = 600 / chartData.length * 0.6
                    const yHigh = 200 - ((p.high - minPrice) / priceRange) * 200
                    const yLow = 200 - ((p.low - minPrice) / priceRange) * 200
                    const yOpen = 200 - ((p.open - minPrice) / priceRange) * 200
                    const yClose = 200 - ((p.close - minPrice) / priceRange) * 200
                    const isGreen = p.close > p.open
                    const color = isGreen ? '#10b981' : '#ef4444'

                    return (
                      <g key={idx}>
                        {/* Wick */}
                        <line x1={x + width / 2} y1={yHigh} x2={x + width / 2} y2={yLow} stroke={color} strokeWidth="1" />
                        {/* Body */}
                        <rect
                          x={x}
                          y={Math.min(yOpen, yClose)}
                          width={width}
                          height={Math.abs(yClose - yOpen) || 2}
                          fill={color}
                          opacity="0.8"
                        />
                      </g>
                    )
                  })}
                </>
              )}

              {/* Chart Type: Bars */}
              {chartType === 'bars' && (
                <>
                  {chartData.map((p, idx) => {
                    const x = (p.x / chartData.length) * 600
                    const width = 600 / chartData.length * 0.5
                    const yHigh = 200 - ((p.high - minPrice) / priceRange) * 200
                    const yLow = 200 - ((p.low - minPrice) / priceRange) * 200
                    const isGreen = p.close > p.open
                    const color = isGreen ? '#2563eb' : '#60a5fa'

                    return (
                      <g key={idx}>
                        {/* Wick line */}
                        <line x1={x + width / 2} y1={yHigh} x2={x + width / 2} y2={yLow} stroke={color} strokeWidth="1" />
                        {/* Bar */}
                        <rect x={x} y={yHigh} width={width} height={yLow - yHigh} fill={color} opacity="0.7" />
                      </g>
                    )
                  })}
                </>
              )}
            </svg>
          </div>

          {/* Technical Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'RSI (14)', value: '65.2' },
              { label: 'MACD', value: 'Bullish' },
              { label: 'SMA (50)', value: `$${(data.current * 0.98).toFixed(2)}` },
              { label: 'Bollinger', value: 'Mid Band' }
            ].map((indicator, idx) => (
              <div key={idx} className="card p-4">
                <p className="text-xs text-gray-600 font-semibold mb-2 uppercase">{indicator.label}</p>
                <p className="text-lg font-bold text-gray-900">{indicator.value}</p>
              </div>
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close Charts
          </button>
        </div>
      </div>
    </div>
  )
}
