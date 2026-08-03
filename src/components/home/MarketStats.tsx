import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
}

const marketData: MarketData[] = [
  { symbol: 'SPY', price: 478.52, change: 2.45, changePercent: 0.52, high: 480.00, low: 474.10 },
  { symbol: 'AAPL', price: 189.95, change: -1.23, changePercent: -0.64, high: 192.50, low: 188.20 },
  { symbol: 'EURUSD', price: 1.0925, change: 0.0045, changePercent: 0.41, high: 1.0950, low: 1.0850 },
  { symbol: 'GOLD', price: 2054.30, change: 12.45, changePercent: 0.61, high: 2060.00, low: 2040.10 },
]

export default function MarketStats() {
  return (
    <section className="py-20 bg-white border-b-2 border-ibkr-gray-300">
      <div className="container-max">
        <div className="flex items-center gap-3 mb-12">
          <TrendingUp className="w-6 h-6 text-ibkr-blue" />
          <h3 className="text-3xl font-bold text-ibkr-navy">Market Overview</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketData.map((data) => (
            <div key={data.symbol} className="card-premium p-7 group hover:border-ibkr-blue transition-all duration-300">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h4 className="font-bold text-2xl text-ibkr-navy group-hover:text-ibkr-blue transition-colors duration-300">{data.symbol}</h4>
                  <p className="text-xs text-ibkr-gray-500 font-semibold mt-1">Last Price</p>
                </div>
                <div className={`p-2 rounded-lg ${data.change > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {data.change > 0 ? (
                    <ArrowUpRight className="w-5 h-5 text-ibkr-success" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-ibkr-danger" />
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-ibkr-navy">${data.price.toFixed(2)}</div>
                  <div className={`text-sm font-bold mt-2 flex items-center gap-1 ${data.change > 0 ? 'text-ibkr-success' : 'text-ibkr-danger'}`}>
                    {data.change > 0 ? '+' : ''}{data.change} ({data.changePercent}%)
                  </div>
                </div>

                <div className="border-t-2 border-ibkr-gray-300 pt-4">
                  <div className="flex justify-between text-xs text-ibkr-gray-600 mb-3 font-semibold">
                    <span>High: ${data.high.toFixed(2)}</span>
                    <span>Low: ${data.low.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-ibkr-gray-300 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-ibkr-blue to-ibkr-navy h-2 rounded-full" 
                      style={{ width: '45%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-ibkr-light-blue border-l-4 border-ibkr-blue rounded-lg">
          <p className="text-sm text-ibkr-gray-700 font-medium text-center">
            Market data is delayed by 15 minutes. For real-time data, open an account.
          </p>
        </div>
      </div>
    </section>
  )
}
