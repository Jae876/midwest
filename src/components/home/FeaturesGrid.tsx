import { Link } from 'react-router-dom'
import { Home, Landmark, PiggyBank, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: Home,
    title: 'Dream Home. Dream Loan.',
    description: 'Get pre-qualified 7 days a week for your dream home with expert mortgage guidance.'
  },
  {
    icon: Landmark,
    title: 'Utilize Your Home’s Equity',
    description: 'Leverage home equity to finance upgrades, consolidate debt, or unlock new flexibility.'
  },
  {
    icon: PiggyBank,
    title: 'Bank with Benefits',
    description: 'Online convenience, personalized support, and checking and savings options that fit your life.'
  },
  {
    icon: ShieldCheck,
    title: 'Save on Insurance',
    description: 'Bundle your home and auto insurance to unlock savings and feel more protected.'
  }
]

export default function FeaturesGrid() {
  return (
    <section className="py-24 bg-[var(--mh-surface)]">
      <div className="container-max">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center mb-4 px-4 py-2 rounded-full border border-[var(--mh-primary)]/15 bg-white text-[var(--mh-primary)] font-semibold text-sm">
            Financial services for every stage of life
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--mh-primary)] mb-4">Built for your next move.</h2>
          <p className="text-lg text-[var(--mh-ink)]/75 leading-relaxed">
            Discover practical banking, mortgage, insurance, and investment support shaped around your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <article key={idx} className="bg-white rounded-2xl p-8 border border-[var(--mh-primary)]/10 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-[var(--mh-accent-soft)] text-[var(--mh-primary)] flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--mh-primary)] mb-4">{feature.title}</h3>
                <p className="text-[var(--mh-ink)]/75 leading-relaxed mb-6 min-h-[96px]">{feature.description}</p>
                <Link to="/login" className="inline-flex items-center gap-2 text-[var(--mh-primary)] font-semibold hover:text-[var(--mh-accent)] transition-colors duration-200">
                  Explore options <span aria-hidden="true">→</span>
                </Link>
              </article>
            )
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-4 gap-4">
          {[
            { title: 'Bank', links: ['Personal', 'Business'] },
            { title: 'Borrow', links: ['Personal', 'Business'] },
            { title: 'Insure', links: ['Personal', 'Business'] },
            { title: 'Invest', links: ['Personal', 'Business'] }
          ].map((group) => (
            <div key={group.title} className="rounded-2xl bg-white border border-[var(--mh-primary)]/10 p-5 shadow-sm">
              <div className="text-xl font-bold text-[var(--mh-primary)] mb-4">{group.title}</div>
              <div className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <Link key={link} to="/login" className="text-[var(--mh-ink)]/80 hover:text-[var(--mh-primary)] font-medium transition-colors duration-200">
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
