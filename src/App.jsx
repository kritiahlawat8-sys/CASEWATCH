import { useState } from 'react'
import './App.css'
import CourtMap from './components/CourtMap'

function App() {
  return (
    <>
      {/* Navbar */}
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="hero">
        <h1>CaseWatch</h1>
        <p>Placeholder - hero content coming soon</p>
      </section>

      {/* Why CaseWatch */}
      <section id="why-casewatch">
        <h2>Why CaseWatch?</h2>
        <p>Placeholder - content coming soon</p>
      </section>

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