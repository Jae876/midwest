import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Smartphone, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react'

const helpLinks = [
  '800-782-0521',
  'Find a Location',
  'Email Us',
  'Hy-Vee Employees',
  'Careers',
  'Privacy Policy'
]

export default function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div className="rounded-[28px] bg-[var(--mh-primary)] text-white p-10 lg:p-12 shadow-xl">
            <div className="text-sm uppercase tracking-[0.25em] text-[var(--mh-accent)] mb-4">Midwest Roots. Midwest Service.</div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-5">Your relationship banking partner.</h2>
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl mb-8">
              Midwest Heritage has served communities with practical guidance, trusted lending, and local support for more than 90 years.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
                <div className="text-2xl font-bold mb-2">$563</div>
                <div className="text-white/80">Potential annual savings through bundled insurance options.</div>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
                <div className="text-2xl font-bold mb-2">Full-service</div>
                <div className="text-white/80">Banking, lending, insurance, and investment advice in one place.</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[var(--mh-primary)] rounded-lg font-semibold hover:bg-[var(--mh-accent-soft)] transition-all duration-200">
                Explore Personal Options
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-white/40 text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-200">
                Open an Account
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] bg-[var(--mh-accent-soft)] p-8 border border-[var(--mh-primary)]/10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[var(--mh-primary)] text-white flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[var(--mh-primary)]">Need More Help?</h3>
                <p className="text-[var(--mh-ink)]/70 text-sm">Real people. Real support.</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {helpLinks.map((link, idx) => (
                <Link key={idx} to="/login" className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-[var(--mh-primary)] font-semibold border border-[var(--mh-primary)]/10 hover:border-[var(--mh-primary)]/30 hover:bg-white transition-all duration-200">
                  {idx === 0 ? <Phone className="w-4 h-4" /> : idx === 1 ? <MapPin className="w-4 h-4" /> : idx === 2 ? <Mail className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  {link}
                </Link>
              ))}
            </div>

            <div className="rounded-2xl bg-white p-5 border border-[var(--mh-primary)]/10">
              <div className="flex items-center gap-2 text-[var(--mh-primary)] font-bold mb-3">
                <Smartphone className="w-4 h-4" />
                Financial tools at your fingertips
              </div>
              <p className="text-[var(--mh-ink)]/75 leading-relaxed mb-4">
                Manage your money, submit remote deposits, and stay connected through the Midwest Heritage mobile experience.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--mh-primary)]/5 px-3 py-2 text-sm font-semibold text-[var(--mh-primary)]">
                  <Smartphone className="w-4 h-4" />
                  Download App
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--mh-primary)]/5 px-3 py-2 text-sm font-semibold text-[var(--mh-primary)]">
                  <ShieldCheck className="w-4 h-4" />
                  Member FDIC
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
