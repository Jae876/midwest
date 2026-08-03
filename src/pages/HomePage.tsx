import HeroSection from '@components/home/HeroSection'
import FeaturesGrid from '@components/home/FeaturesGrid'
import CTASection from '@components/home/CTASection'

export default function HomePage() {
  return (
    <div className="bg-white">
      <HeroSection />
      <FeaturesGrid />
      <CTASection />
    </div>
  )
}
