import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from '@components/layout/Navbar'
import Footer from '@components/layout/Footer'
import LiveChatWidget from '@components/LiveChatWidget'
import HomePage from '@pages/HomePage'
import TradingPage from '@pages/TradingPage'
import PlatformsPage from '@pages/PlatformsPage'
import FeaturesPage from '@pages/FeaturesPage'
import PricingPage from '@pages/PricingPage'
import LoginPage from '@pages/LoginPage'
import SignupPage from '@pages/SignupPage'
import DashboardPage from '@pages/DashboardPage'
import ProfilePage from '@pages/ProfilePage'
import TransactionsPage from '@pages/TransactionsPage'
import MarketDataPage from '@pages/MarketDataPage'
import AdminPage from '@pages/AdminPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trading" element={<TradingPage />} />
            <Route path="/platforms" element={<PlatformsPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/market-data" element={<MarketDataPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
        <LiveChatWidget />
      </div>
    </Router>
  )
}

export default App
