import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Stock101Page from './pages/Stock101Page.tsx'
import RetirementPage from './pages/RetirementPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/stock-101" element={<Stock101Page />} />
        <Route path="/retirement" element={<RetirementPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
