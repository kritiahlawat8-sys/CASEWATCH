import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfUse from './pages/TermsOfUse'
import Disclaimer from './pages/Disclaimer'
import Grievance from './pages/Grievance'
import LegalInfoPage from './pages/LegalInfoPage'
import TrackCasePage from './pages/TrackCasePage'

import HowItWorksPage from './pages/HowItWorksPage'

import About from './pages/About'
import FeaturesPage from './pages/FeaturesPage'

import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/grievance" element={<Grievance />} />
        <Route path="/legal-info/:slug" element={<LegalInfoPage />} />
        <Route path="/track-case" element={<TrackCasePage />} />
        <Route path="/track-case.html" element={<TrackCasePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/how-it-works.html" element={<HowItWorksPage />} />
      </Routes>
    </Router>
  )
}

export default App