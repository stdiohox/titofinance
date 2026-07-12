import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StorySection from './components/StorySection'
import ServicesSection from './components/ServicesSection'
import DifferentiatorsSection from './components/DifferentiatorsSection'
import GDRSection from './components/GDRSection'
import InstitutionsRow from './components/InstitutionsRow'
import DarkQuoteSection from './components/DarkQuoteSection'
import CredentialMarquee from './components/CredentialMarquee'
import FreeResources from './components/FreeResources'
import WhoItsForSection from './components/WhoItsForSection'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import { useAnimations } from './hooks/useAnimations'

export default function App() {
  useAnimations()

  return (
    <main className="flex flex-col">
      <Navbar />
      <HeroSection />
      <StorySection />
      <ServicesSection />
      <DifferentiatorsSection />
      <GDRSection />
      <InstitutionsRow />
      <DarkQuoteSection />
      <CredentialMarquee />
      <FreeResources />
      <WhoItsForSection />
      <FinalCTA />
      <Footer />
    </main>
  )
}
