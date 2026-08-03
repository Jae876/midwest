import { useState } from 'react'
import { Search, TrendingUp, TrendingDown } from 'lucide-react'

interface MarketIndex {
  name: string
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: string
}

const marketIndices: MarketIndex[] = [
  { name: 'S&P 500', symbol: '^GSPC', price: 4783.45, change: 34.20, changePercent: 0.72, volume: '1.2B' },
  { name: 'NASDAQ-100', symbol: '^NDX', price: 16485.32, change: 48.95, changePercent: 0.30, volume: '2.3B' },
  { name: 'Dow Jones', symbol: '^DJI', price: 37485.00, change: -12.50, changePercent: -0.33, volume: '890M' },
  { name: 'Russell 2000', symbol: '^RUT', price: 1892.45, change: 18.30, changePercent: 0.98, volume: '450M' },
]

const trendingStocks = [
  { symbol: 'NVDA', price: 875.30, change: 12.45, changePercent: 1.44 },
  { symbol: 'MSTR', price: 258.90, change: -8.30, changePercent: -3.11 },
  { symbol: 'TRUMP', price: 34.50, change: 2.10, changePercent: 6.49 },
  { symbol: 'MARA', price: 12.75, change: 0.45, changePercent: 3.65 },
]

export default function MarketDataPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-blue-50 to-white border-b border-gray-200">
        <div className="container-max">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Market Data</h1>
          <p className="text-lg text-gray-600 mb-8">Real-time market data and analysis</p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stocks, crypto, forex... (e.g., AAPL, BTC, EURUSD)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ibkr-blue focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Market Indices */}
      <section className="py-12 border-b border-gray-200">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Market Indices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketIndices.map((index) => (
              <div key={index.symbol} className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{index.name}</h3>
                    <p className="text-xs text-gray-500">{index.symbol}</p>
                  </div>
                  {index.change > 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="text-2xl font-bold text-gray-900">{index.price.toLocaleString()}</h4>
                  <p className={`text-sm font-medium ${index.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {index.change > 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                  </p>
                </div>

                <p className="text-xs text-gray-600">Vol: {index.volume}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Stocks */}
      <section className="py-12 border-b border-gray-200">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending Stocks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingStocks.map((stock) => (
              <div key={stock.symbol} className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{stock.symbol}</h3>
                <div className="mb-3">
                  <p className="text-2xl font-bold text-gray-900">${stock.price.toFixed(2)}</p>
                  <p className={`text-sm font-medium ${stock.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </p>
                </div>
                <button className="w-full py-2 bg-gray-100 text-gray-900 rounded font-medium hover:bg-gray-200 transition-colors text-sm">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Economic Calendar */}
      <section className="py-12">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Economic Events</h2>
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Country</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Event</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Impact</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Forecast</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { date: 'Feb 21, 08:30', country: 'US', event: 'Initial Jobless Claims', impact: 'High', forecast: '205K' },
                  { date: 'Feb 21, 10:00', country: 'US', event: 'Existing Home Sales', impact: 'Medium', forecast: '4.0M' },
                  { date: 'Feb 22, 14:00', country: 'EUR', event: 'Services PMI', impact: 'High', forecast: '52.1' },
                  { date: 'Feb 23, 13:30', country: 'US', event: 'PCE Price Index', impact: 'High', forecast: '2.8%' },
                ].map((event, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-700">{event.date}</td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{event.country}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{event.event}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        event.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.impact}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-700">{event.forecast}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
