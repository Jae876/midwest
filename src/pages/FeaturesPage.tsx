export default function FeaturesPage() {
  const features = [
    {
      category: 'Trading',
      items: [
        { name: 'Order Types', desc: 'Market, limit, stop, trail, bracket, and more' },
        { name: 'Asset Classes', desc: 'Stocks, options, futures, forex, bonds, and crypto' },
        { name: 'Algorithmic Trading', desc: 'Build and deploy custom trading algorithms' },
        { name: 'Portfolio Margin', desc: 'Advanced risk management for experienced traders' }
      ]
    },
    {
      category: 'Research & Tools',
      items: [
        { name: 'Real-time Quotes', desc: 'Level II data and streaming market information' },
        { name: 'Advanced Charting', desc: 'Technical analysis with 100+ indicators' },
        { name: 'Screeners', desc: 'Custom stock and option screeners' },
        { name: 'Research Reports', desc: 'Professional analyst reports and news' }
      ]
    },
    {
      category: 'Account Management',
      items: [
        { name: 'Multiple Accounts', desc: 'Manage several accounts from one login' },
        { name: 'Margin Loans', desc: 'Competitive margin rates starting at 1.58%' },
        { name: 'Account Analytics', desc: 'Detailed P&L and performance analysis' },
        { name: 'Tax Tools', desc: 'Tax reporting and accounting integration' }
      ]
    }
  ]

  return (
    <div className="bg-white">
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white border-b border-gray-200">
        <div className="container-max">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Features</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Everything you need to trade professionally, all in one platform.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {features.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.category}</h2>
                <div className="space-y-6">
                  {section.items.map((item, i) => (
                    <div key={i}>
                      <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container-max">
          <h2 className="section-title text-center">Advanced Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Mobile Trading', 'API Access', 'Paper Trading', 'Risk Analytics', 'Global Access', 'Multi-Currency', 'Automated Trading', 'Portfolio Tracking'].map((cap, idx) => (
              <div key={idx} className="card p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-ibkr-blue font-bold">✓</span>
                </div>
                <h3 className="font-bold text-gray-900">{cap}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
