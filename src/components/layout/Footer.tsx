import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[var(--mh-primary-dark)] text-white mt-12">
      <div className="container-max py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
          <div>
            <h3 className="font-bold text-white mb-5 text-lg border-b border-[var(--mh-accent)] pb-2">About</h3>
            <ul className="space-y-3 text-sm text-white/75">
              <li><Link to="/login" className="hover:text-[var(--mh-accent)] transition duration-200">Who We Are</Link></li>
              <li><Link to="/login" className="hover:text-[var(--mh-accent)] transition duration-200">Careers</Link></li>
              <li><Link to="/login" className="hover:text-[var(--mh-accent)] transition duration-200">Locations</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-5 text-lg border-b border-[var(--mh-accent)] pb-2">Bank</h3>
            <ul className="space-y-3 text-sm text-white/75">
              <li><Link to="/login" className="hover:text-[var(--mh-accent)] transition duration-200">Personal</Link></li>
              <li><Link to="/login" className="hover:text-[var(--mh-accent)] transition duration-200">Business</Link></li>
              <li><Link to="/login" className="hover:text-[var(--mh-accent)] transition duration-200">Checking & Savings</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-5 text-lg border-b border-[var(--mh-accent)] pb-2">Borrow</h3>
            <ul className="space-y-3 text-sm text-white/75">
              <li><Link to="/login" className="hover:text-[var(--mh-accent)] transition duration-200">Mortgage Loans</Link></li>
              <li><Link to="/login" className="hover:text-[var(--mh-accent)] transition duration-200">Home Equity</Link></li>
              <li><Link to="/login" className="hover:text-[var(--mh-accent)] transition duration-200">Business Lending</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-5 text-lg border-b border-[var(--mh-accent)] pb-2">Legal</h3>
            <ul className="space-y-3 text-sm text-white/75">
              <li><Link to="/login" className="hover:text-[var(--mh-accent)] transition duration-200">Privacy Policy</Link></li>
              <li><Link to="/login" className="hover:text-[var(--mh-accent)] transition duration-200">Text Terms</Link></li>
              <li><Link to="/login" className="hover:text-[var(--mh-accent)] transition duration-200">USA Patriot Act</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-5 text-lg border-b border-[var(--mh-accent)] pb-2">Contact</h3>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[var(--mh-accent)]" />
                <a href="tel:8007820521" className="hover:text-[var(--mh-accent)] transition duration-200">800-782-0521</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[var(--mh-accent)]" />
                <a href="mailto:customerservice@midwestheritage.com" className="hover:text-[var(--mh-accent)] transition duration-200">customerservice@midwestheritage.com</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-[var(--mh-accent)]" />
                <span>Chariton, Iowa</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-[var(--mh-primary)] font-bold text-sm flex items-center justify-center">MH</div>
              <div>
                <div className="font-bold text-white text-lg">Midwest Heritage</div>
                <div className="text-white/60 text-xs uppercase tracking-[0.25em]">Member FDIC</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/70 text-sm">
              <ShieldCheck className="w-4 h-4 text-[var(--mh-accent)]" />
              <span>Insurance and investment products are not FDIC insured, not a deposit, and may lose value.</span>
            </div>
          </div>

          <div className="mt-6 text-center text-white/60 text-sm">
            &copy; {currentYear} Midwest Heritage. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
