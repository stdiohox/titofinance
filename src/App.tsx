import ChatBot from './components/ChatBot'
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
import TestimonialsSection from './components/TestimonialsSection'
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
      <ServicesSection />
      <StorySection />
      <DifferentiatorsSection />
      <GDRSection />
      <InstitutionsRow />
      <DarkQuoteSection />
      <CredentialMarquee />
      <FreeResources />
      <WhoItsForSection />
      <TestimonialsSection />
      <FinalCTA />
      <section style={{ background: '#F8F5EE', padding: '80px 24px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <p style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            letterSpacing: '0.12em',
            color: '#C9A84C',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            ASK TITO'S ASSISTANT
          </p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '36px',
            fontWeight: 500,
            color: '#1A3A16',
            marginBottom: '32px',
            lineHeight: 1.2
          }}>
            Have a question? Start here.
          </h2>
          <ChatBot embedded={true} />
        </div>
      </section>
      <Footer />
      <ChatBot />
    </main>
  )
}
