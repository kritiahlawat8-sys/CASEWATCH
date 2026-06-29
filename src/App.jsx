import { useState } from 'react'
import './App.css'
import CourtMap from './components/CourtMap'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhyCaseWatch from './components/WhyCaseWatch'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

import { ReactLenis } from 'lenis/react'

function App() {
  return (
    <ReactLenis root>
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Why CaseWatch & Overview */}
      <WhyCaseWatch />

      {/* Map Section */}
      <CourtMap />

      {/* FAQ */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </ReactLenis>
  )
}

export default App