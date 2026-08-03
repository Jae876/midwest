import { Laptop, Smartphone, Monitor, Code } from 'lucide-react'

const platforms = [
  {
    icon: Laptop,
    name: 'Trader Workstation',
    description: 'Professional desktop platform with advanced analytics, charting, and order management.',
    features: ['Advanced charting', 'Portfolio margin', 'Option analytics', 'Backtesting'],
    badge: 'Most Popular'
  },
  {
    icon: Monitor,
    name: 'Web Terminal',
    description: 'Access your account from any web browser with full trading capabilities.',
    features: ['Browser-based', 'No installation', 'Multi-account', 'Real-time data'],
    badge: 'Easy to Use'
  },
  {
    icon: Smartphone,
    name: 'Mobile App',
    description: 'Trade on the go with our powerful native iOS and Android applications.',
    features: ['iOS & Android', 'Push notifications', 'Biometric login', 'Quick trading'],
    badge: 'On the Go'
  },
  {
    icon: Code,
    name: 'API',
    description: 'Build custom trading solutions with our comprehensive REST and WebSocket APIs.',
    features: ['REST API', 'WebSocket', 'Webhooks', 'Documentation'],
    badge: 'For Developers'
  }
]

export default function PlatformsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white border-b border-gray-200">
        <div className="container-max">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Trading Platforms</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Choose the platform that works best for your trading style. All platforms offer the same powerful features and market access.
          </p>
        </div>
      </section>

      {/* Platforms Grid */}
      <section className="py-20">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {platforms.map((platform, idx) => {
              const Icon = platform.icon
              return (
                <div key={idx} className="card p-8 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                  {platform.badge && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-ibkr-blue text-white text-xs font-bold px-3 py-1 rounded-full">
                        {platform.badge}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center w-14 h-14 bg-blue-100 rounded-lg mb-6">
                    <Icon className="w-8 h-8 text-ibkr-blue" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{platform.name}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{platform.description}</p>

                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {platform.features.map((feature, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-ibkr-blue rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="btn-primary w-full">
                    Get Started
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-gray-50">
        <div className="container-max">
          <h2 className="section-title text-center">Platform Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Feature</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-900">TWS</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-900">Web</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-900">Mobile</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-900">API</th>
                </tr>
              </thead>
              <tbody>
                {['Real-time quotes', 'Advanced charting', 'Portfolio margin', 'Algorithmic trading', 'Mobile access', '24/5 support'].map((feature, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-white transition-colors">
                    <td className="py-3 px-4 text-gray-900">{feature}</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4">✓</td>
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
