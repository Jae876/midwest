import { TrendingUp, Lock, Zap, BarChart3 } from 'lucide-react'

export default function TradingPage() {
  const tradingTypes = [
    {
      icon: TrendingUp,
      title: 'Stocks & ETFs',
      description: 'Trade thousands of US and international stocks with competitive pricing.',
      specs: ['Free US markets', '13 international exchanges', 'Fractional shares', 'Dividend reinvestment']
    },
    {
      icon: BarChart3,
      title: 'Options',
      description: 'Access all US options exchanges with advanced order types.',
      specs: ['All US options', 'Multi-leg strategies', 'Covered call automation', 'Probability analysis']
    },
    {
      icon: Zap,
      title: 'Futures',
      description: 'Trade micro and standard futures contracts globally.',
      specs: ['50+ markets', 'Low commissions', 'Portfolio margin', 'Spread trading']
    },
    {
      icon: Lock,
      title: 'Forex',
      description: 'Trade major currency pairs with tight spreads.',
      specs: ['28+ currency pairs', '0.2 pip spreads', 'Leverage up to 20:1', 'Silver bullion']
    }
  ]

  return (
    <div className="bg-white">
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white border-b border-gray-200">
        <div className="container-max">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Trading Products</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Access the most comprehensive trading platform with support for all major asset classes.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-max">
          <div className="grid-auto-fit">
            {tradingTypes.map((type, idx) => {
              const Icon = type.icon
              return (
                <div key={idx} className="card p-8 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-center w-14 h-14 bg-blue-100 rounded-lg mb-6">
                    <Icon className="w-8 h-8 text-ibkr-blue" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{type.title}</h3>
                  <p className="text-gray-600 mb-6">{type.description}</p>
                  <ul className="space-y-2">
                    {type.specs.map((spec, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-center">
                        <span className="w-1.5 h-1.5 bg-ibkr-blue rounded-full mr-2"></span>
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container-max">
          <h2 className="section-title text-center">Advanced Order Types</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Execute your trading strategy with our comprehensive order management system
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Market Orders', 'Limit Orders', 'Stop Orders', 'Trailing Stops', 'Bracket Orders', 'Iceberg Orders', 'Algorithmic Orders', 'Pegged Orders'].map((order, idx) => (
              <div key={idx} className="card p-6 text-center hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-900 text-sm">{order}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
