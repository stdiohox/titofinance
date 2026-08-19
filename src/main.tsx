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
