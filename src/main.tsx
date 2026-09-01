import { StrictMode, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Stock101Page from './pages/Stock101Page.tsx'
import RetirementPage from './pages/RetirementPage.tsx'
import BeginnersPortfolioPage from './pages/BeginnersPortfolioPage.tsx'
import CloseCommunityPage from './pages/CloseCommunityPage.tsx'

const RouteTracker = () => {
  const location = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'PageView')
    }
  }, [location.pathname])

  /**
   * Scroll to #hash after a cross-route navigation.
   *
   * React Router does not do this. In declarative BrowserRouter mode a
   * navigation to /stock-101#register renders the page and leaves the reader at
   * the top, hash ignored - so a cross-page anchor link silently half-works:
   * right URL, wrong position. Same-page `href="#register"` anchors are fine
   * because the browser handles those natively, which is why nothing has
   * noticed until now.
   *
   * Fixed here rather than in the one component that needed it, so the next
   * cross-page anchor link works without anybody rediscovering this.
   *
   * Two frames of grace. Routes are eagerly imported so the target usually
   * exists on the first, but these pages are long and image-heavy; one retry
   * covers a section that has not laid out yet without turning into a poll.
   */
  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    let frame = 0
    const tryScroll = () => {
      const el = document.getElementById(id)
      if (el) {
        // Smooth, matching the global `html { scroll-behavior: smooth }` and
        // the getElementById(...).scrollIntoView pattern already used by
        // FreeResources and GDRSection.
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      if (frame < 2) {
        frame += 1
        requestAnimationFrame(tryScroll)
      }
    }
    requestAnimationFrame(tryScroll)
  }, [location.pathname, location.hash])

  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/stock-101" element={<Stock101Page />} />
        <Route path="/retirement" element={<RetirementPage />} />
        <Route path="/beginners-portfolio" element={<BeginnersPortfolioPage />} />
        <Route path="/close-community" element={<CloseCommunityPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
