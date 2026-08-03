import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-white border-b border-[var(--mh-primary)]/10 sticky top-0 z-50 shadow-sm">
      <div className="container-max flex justify-between items-center h-16">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
          <div className="w-10 h-10 rounded-full bg-[var(--mh-primary)] text-white font-bold text-base flex items-center justify-center shadow-md">
            MH
          </div>
          <div>
            <div className="text-[var(--mh-primary)] font-bold text-lg tracking-tight">Midwest Heritage</div>
            <div className="text-[var(--mh-primary)]/70 text-[11px] uppercase tracking-[0.2em]">Bank</div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center space-x-1">
          <div className="relative group">
            <button className="px-4 py-2 rounded-lg text-[var(--mh-ink)] font-semibold hover:bg-[var(--mh-accent-soft)] hover:text-[var(--mh-primary)] transition-all duration-200 flex items-center border border-transparent hover:border-[var(--mh-primary)]/20">
              Personal <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            <div className="hidden group-hover:block absolute left-0 mt-1 w-56 bg-white border border-[var(--mh-primary)]/10 rounded-lg shadow-lg z-50">
              <Link to="/login" className="block px-5 py-3 text-[var(--mh-ink)] hover:bg-[var(--mh-accent-soft)] hover:text-[var(--mh-primary)] font-semibold border-b border-[var(--mh-primary)]/10 transition-colors duration-150">Banking</Link>
              <Link to="/login" className="block px-5 py-3 text-[var(--mh-ink)] hover:bg-[var(--mh-accent-soft)] hover:text-[var(--mh-primary)] font-semibold border-b border-[var(--mh-primary)]/10 transition-colors duration-150">Borrowing</Link>
              <Link to="/login" className="block px-5 py-3 text-[var(--mh-ink)] hover:bg-[var(--mh-accent-soft)] hover:text-[var(--mh-primary)] font-semibold transition-colors duration-150">Insurance</Link>
            </div>
          </div>

          <Link to="/login" className="px-4 py-2 rounded-lg text-[var(--mh-ink)] font-semibold hover:bg-[var(--mh-accent-soft)] hover:text-[var(--mh-primary)] transition-all duration-200 border border-transparent hover:border-[var(--mh-primary)]/20">Business</Link>
          <Link to="/login" className="px-4 py-2 rounded-lg text-[var(--mh-ink)] font-semibold hover:bg-[var(--mh-accent-soft)] hover:text-[var(--mh-primary)] transition-all duration-200 border border-transparent hover:border-[var(--mh-primary)]/20">Locations</Link>
          <Link to="/login" className="px-4 py-2 rounded-lg text-[var(--mh-ink)] font-semibold hover:bg-[var(--mh-accent-soft)] hover:text-[var(--mh-primary)] transition-all duration-200 border border-transparent hover:border-[var(--mh-primary)]/20">Careers</Link>
        </div>

        <div className="hidden lg:flex items-center space-x-3">
          <Link to="/login" className="px-5 py-2.5 text-[var(--mh-primary)] font-semibold hover:bg-[var(--mh-accent-soft)] rounded-lg border border-[var(--mh-primary)] transition-all duration-200">
            Sign In
          </Link>
          <Link to="/login" className="px-5 py-2.5 bg-[var(--mh-primary)] text-white rounded-lg font-semibold hover:opacity-90 shadow-sm transition-all duration-200">
            Open an Account
          </Link>
        </div>

        <button onClick={toggleMenu} className="lg:hidden p-2 rounded-lg hover:bg-[var(--mh-accent-soft)] transition-colors duration-200">
          {isOpen ? <X className="w-6 h-6 text-[var(--mh-primary)]" /> : <Menu className="w-6 h-6 text-[var(--mh-primary)]" />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-[var(--mh-primary)]/10">
          <div className="container-max py-4 space-y-2">
            <MobileMenuItem to="/login" label="Personal" />
            <MobileMenuItem to="/login" label="Business" />
            <MobileMenuItem to="/login" label="Locations" />
            <MobileMenuItem to="/login" label="Careers" />
            <div className="pt-4 space-y-3 border-t border-[var(--mh-primary)]/10">
              <Link to="/login" className="block px-5 py-2.5 text-[var(--mh-primary)] font-semibold hover:bg-[var(--mh-accent-soft)] rounded-lg border border-[var(--mh-primary)] transition-all duration-200">
                Sign In
              </Link>
              <Link to="/login" className="block px-5 py-2.5 bg-[var(--mh-primary)] text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-200 text-center">
                Open an Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

function MobileMenuItem({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="block px-5 py-3 text-[var(--mh-ink)] hover:bg-[var(--mh-accent-soft)] hover:text-[var(--mh-primary)] rounded-lg font-semibold border border-transparent hover:border-[var(--mh-primary)]/10 transition-all duration-200">
      {label}
    </Link>
  )
}
