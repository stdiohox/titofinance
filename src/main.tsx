import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Stock101Page from './pages/Stock101Page.tsx'
import RetirementPage from './pages/RetirementPage.tsx'

const RouteTracker = () => {
  const location = useLocation()

  useEffect(() => {
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
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
