import { Link } from 'react-router-dom'
import { ChevronRight, Play, Landmark, Wallet, HeartHandshake, ShieldCheck } from 'lucide-react'

const statCards = [
  { label: 'Savings', value: '$45.2M', icon: Wallet },
  { label: 'Loans', value: '$12.8M', icon: Landmark },
  { label: 'Trusted', value: '90+ yrs', icon: ShieldCheck }
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-24 bg-[linear-gradient(135deg,var(--mh-primary-dark)_0%,var(--mh-primary)_55%,#20443f_100%)] text-white">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[var(--mh-accent)]/20 blur-3xl -mr-24 -mt-24" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/10 blur-3xl -ml-28 -mb-24" />

      <div className="container-max relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center mb-6 px-4 py-2 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm">
              <span className="text-sm font-semibold text-[var(--mh-accent-soft)]">More than just a bank.</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-white">
              Banking that feels <span className="text-[var(--mh-accent)]">rooted in your community.</span>
            </h1>

            <p className="text-lg text-white/85 mb-8 leading-relaxed max-w-2xl font-medium">
              From mortgages and home equity to checking, savings, insurance and investment guidance, we help families and businesses balance it all with local service and real expertise.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-10">
              <Link to="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[var(--mh-primary)] font-semibold rounded-lg hover:bg-[var(--mh-accent-soft)] shadow-lg transition-all duration-200">
                Open an Account
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-white/40 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200">
                <Play className="w-4 h-4" />
                Meet our team
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-white/20">
              {[
                { value: '90+', label: 'Years of service' },
                { value: '24/7', label: 'Customer support' },
                { value: '100%', label: 'Local relationship banking' }
              ].map((item, index) => (
                <div key={index} className="rounded-xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white mb-1">{item.value}</div>
                  <div className="text-sm text-white/80">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative h-[430px]">
            <div className="absolute inset-0 rounded-[28px] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-3 h-3 rounded-full bg-[var(--mh-accent)]" />
                <span className="w-3 h-3 rounded-full bg-orange-300" />
                <span className="w-3 h-3 rounded-full bg-emerald-300" />
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 h-full p-6 flex flex-col justify-between">
                <div>
                  <div className="text-sm uppercase tracking-[0.3em] text-white/70 mb-4">Routing number</div>
                  <div className="text-3xl font-bold text-white mb-3">073902436</div>
                  <div className="text-white/80 text-sm">Community-first financial solutions for modern living.</div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {statCards.map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div key={idx} className="rounded-xl bg-white/10 border border-white/10 p-3 text-center">
                        <Icon className="w-5 h-5 mx-auto text-[var(--mh-accent)] mb-2" />
                        <div className="text-white text-sm font-semibold">{item.value}</div>
                        <div className="text-white/70 text-[11px] mt-1">{item.label}</div>
                      </div>
                    )
                  })}
                </div>

                <div className="rounded-2xl bg-[var(--mh-accent-soft)] p-4 text-[var(--mh-primary)]">
                  <div className="flex items-center gap-2 font-semibold mb-2">
                    <HeartHandshake className="w-4 h-4" />
                    Personalized guidance
                  </div>
                  <div className="text-sm">Mortgage, lending, and insurance products aligned to your goals.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
