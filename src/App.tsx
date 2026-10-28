import ChatBot from './components/ChatBot'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StorySection from './components/StorySection'
import ServicesSection from './components/ServicesSection'
import DifferentiatorsSection from './components/DifferentiatorsSection'
import GDRSection from './components/GDRSection'
import InstitutionsRow from './components/InstitutionsRow'
import DarkQuoteSection from './components/DarkQuoteSection'
import FreeResources from './components/FreeResources'
import TestimonialsSection from './components/TestimonialsSection'
import WhoItsForSection from './components/WhoItsForSection'
import GrantsTeaser from './components/GrantsTeaser'
import FinalCTA from './components/FinalCTA'
import AssistantSection from './components/AssistantSection'
import Footer from './components/Footer'
import { ClassAnnouncement } from './components/ClassAnnouncement'
import { useAnimations } from './hooks/useAnimations'

export default function App() {
  useAnimations()

  return (
    <main className="flex flex-col">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <StorySection />
      <DifferentiatorsSection />
      <GDRSection />
      <InstitutionsRow />
      <DarkQuoteSection />
      <FreeResources />
      <WhoItsForSection />
      <TestimonialsSection />
      <GrantsTeaser />
      <FinalCTA />
      <AssistantSection />
      <Footer />
      <ChatBot />
      {/* Mounted per page rather than in main.tsx, so the surfaces it appears
          on stay a deliberate list: here, /beginners-portfolio and /stock-101.
          Sitewide would put it over /retirement and /close-community too, which
          sell something else. See the component header. */}
      <ClassAnnouncement />
    </main>
  )
}
