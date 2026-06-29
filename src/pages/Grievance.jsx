import React from 'react';
import LegalPageLayout from './LegalPageLayout';
import { grievanceContent } from '../config/legalContent';

export default function Grievance() {
  return (
    <LegalPageLayout 
      title="Grievance Redressal" 
      content={grievanceContent} 
    />
  );
}
