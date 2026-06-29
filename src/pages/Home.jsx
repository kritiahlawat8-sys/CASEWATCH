import React from 'react';
import CourtMap from '../components/CourtMap';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhyCaseWatch from '../components/WhyCaseWatch';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

import { ReactLenis } from 'lenis/react';

export default function Home() {
  return (
    <ReactLenis root>
      <Navbar />
      <Hero />
      <WhyCaseWatch />
      <CourtMap />
      <FAQ />
      <Footer />
    </ReactLenis>
  );
}
