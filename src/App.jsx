import { useState } from 'react'
import './App.css'
import CourtMap from './components/CourtMap'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhyCaseWatch from './components/WhyCaseWatch'

function App() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Why CaseWatch & Overview */}
      <WhyCaseWatch />

      {/* Map Section */}
      <CourtMap />

      {/* FAQ */}
      <section id="faq">
        <h2>FAQ</h2>
        <p>Placeholder - FAQ coming soon</p>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2024 CaseWatch</p>
      </footer>
    </>
  )
}

export default App