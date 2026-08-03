import { Check } from 'lucide-react'

interface PricingTier {
  name: string
  description: string
  monthlyFee: string
  features: string[]
  highlighted?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    description: 'For new traders',
    monthlyFee: '$0',
    features: [
      'Basic trading',
      'US markets only',
      'Delayed quotes',
      'Limited research',
      'Email support'
    ]
  },
  {
    name: 'Professional',
    description: 'For active traders',
    monthlyFee: '$29',
    features: [
      'All trading types',
      '150+ markets',
      'Real-time quotes',
      'Advanced tools',
      'Priority support',
      'Portfolio margin',
      'API access'
    ],
    highlighted: true
  },
  {
    name: 'Institutional',
    description: 'For institutions',
    monthlyFee: 'Custom',
    features: [
      'Dedicated account manager',
      'Custom integrations',
      'White-label solutions',
      'Institutional pricing',
      '24/5 premium support',
      'OMS integration',
      'Custom reporting'
    ]
  }
]

export default function PricingPage() {
  return (
    <div className="bg-white">
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white border-b border-gray-200">
        <div className="container-max">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            No hidden fees. Pay only for what you use. All tiers include access to global markets.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, idx) => (
              <div 
                key={idx} 
                className={`rounded-xl border-2 transition-all duration-300 ${
                  tier.highlighted 
                    ? 'border-ibkr-blue bg-blue-50 shadow-xl scale-105' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {tier.highlighted && (
                  <div className="bg-ibkr-blue text-white py-2 px-4 rounded-t-lg font-bold text-center">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <p className="text-gray-600 text-sm mb-6">{tier.description}</p>

                  <div className="mb-8">
                    <span className="text-4xl font-bold text-gray-900">{tier.monthlyFee}</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>

                  <button className={`w-full py-3 rounded-lg font-bold mb-8 transition-colors ${
                    tier.highlighted
                      ? 'btn-primary'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}>
                    Get Started
                  </button>

                  <div className="space-y-4">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container-max">
          <h2 className="section-title text-center">Commission Structure</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="card p-8 text-center">
              <div className="text-4xl font-bold text-ibkr-blue mb-2">$0</div>
              <h3 className="font-bold text-gray-900 mb-2">US Stocks & ETFs</h3>
              <p className="text-gray-600 text-sm">Per share, $1 minimum</p>
            </div>

            <div className="card p-8 text-center">
              <div className="text-4xl font-bold text-ibkr-blue mb-2">$0.65</div>
              <h3 className="font-bold text-gray-900 mb-2">Options</h3>
              <p className="text-gray-600 text-sm">Per contract, $1 minimum</p>
            </div>

            <div className="card p-8 text-center">
              <div className="text-4xl font-bold text-ibkr-blue mb-2">0.2 pips</div>
              <h3 className="font-bold text-gray-900 mb-2">Forex</h3>
              <p className="text-gray-600 text-sm">Competitive spreads</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
