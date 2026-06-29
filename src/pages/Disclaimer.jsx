import React from 'react';
import LegalPageLayout from './LegalPageLayout';
import { disclaimerContent } from '../config/legalContent';

export default function Disclaimer() {
  return (
    <LegalPageLayout 
      title="Disclaimer" 
      content={disclaimerContent}
      showDisclaimerNote={true}
    />
  );
}
