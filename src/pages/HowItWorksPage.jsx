import React from 'react';
import Navbar from '../components/Navbar';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import { ReactLenis } from 'lenis/react';

export default function HowItWorksPage() {
  return (
    <ReactLenis root>
      <Navbar />
      <div style={{ paddingTop: '72px' }}>
        <HowItWorks />
      </div>
      <Footer />
    </ReactLenis>
  );
}
