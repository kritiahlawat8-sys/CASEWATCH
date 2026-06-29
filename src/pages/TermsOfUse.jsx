import React from 'react';
import LegalPageLayout from './LegalPageLayout';
import { termsOfUseContent } from '../config/legalContent';

export default function TermsOfUse() {
  return (
    <LegalPageLayout 
      title="Terms of Use" 
      content={termsOfUseContent}
      showDisclaimerNote={true}
    />
  );
}
