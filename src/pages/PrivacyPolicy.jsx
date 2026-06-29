import React from 'react';
import LegalPageLayout from './LegalPageLayout';
import { privacyPolicyContent } from '../config/legalContent';

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout 
      title="Privacy Policy" 
      content={privacyPolicyContent} 
    />
  );
}
