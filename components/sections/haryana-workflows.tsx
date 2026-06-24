'use client';

import React, { useState, useEffect } from 'react';
import { HARYANA_TEMPLATES, HaryanaWorkflowTemplate, FilingStep, getFilingStepLabel } from '@/lib/utils/telemetry';
import { GlassInput } from '../ui/glass-input';
import { TerminalCard } from '../ui/terminal-card';
import { cn } from '@/lib/utils';
import { FileText, Award, Layers, ShieldCheck, CheckCircle2, RefreshCw, ChevronRight, Eye, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function HaryanaWorkflows() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(HARYANA_TEMPLATES[0].id);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedDraft, setGeneratedDraft] = useState('');
  
  // Filing process states
  const [filingStatus, setFilingStatus] = useState<FilingStep | null>(null);
  const [filingLogs, setFilingLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [finalCRN, setFinalCRN] = useState('');

  const activeTemplate = HARYANA_TEMPLATES.find(t => t.id === selectedTemplateId) || HARYANA_TEMPLATES[0];

  // Set initial form states on template change
  useEffect(() => {
    const initialForm: Record<string, string> = {};
    activeTemplate.fields.forEach(field => {
      initialForm[field.name] = '';
    });
    setFormData(initialForm);
    setGeneratedDraft('');
    setFilingStatus(null);
    setFilingLogs([]);
    setProgress(0);
    setFinalCRN('');
  }, [selectedTemplateId, activeTemplate]);

  // Dynamically update draft
  useEffect(() => {
    let draft = activeTemplate.baseDraft;
    const now = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Replace standard placeholders
    draft = draft
      .replace('[DATE]', now.getDate().toString())
      .replace('[MONTH]', months[now.getMonth()])
      .replace('[YEAR]', now.getFullYear().toString());

    // Replace form-filled fields
    Object.keys(formData).forEach(key => {
      const val = formData[key] || `[${key.toUpperCase()}]`;
      draft = draft.replace(new RegExp(`\\[${key.toUpperCase()}\\]`, 'g'), val);
    });

    setGeneratedDraft(draft);
  }, [formData, activeTemplate]);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Run specialized filing sequence
  const startFilingSimulation = async () => {
    // Validate form inputs
    const requiredEmpty = activeTemplate.fields.filter(f => f.required && !formData[f.name]);
    if (requiredEmpty.length > 0) {
      alert(`Please fill out the required fields: ${requiredEmpty.map(f => f.label).join(', ')}`);
      return;
    }

    setFilingStatus('INITIATING');
    setProgress(0);
    setFilingLogs([]);
    setFinalCRN('');

    const steps: FilingStep[] = [
      'INITIATING',
      'VALIDATING',
      'CALCULATING_STAMP',
      'PAYING_STAMP',
      'SIGNING',
      'SUBMITTING',
      'COMPLETED'
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setFilingStatus(step);
      setProgress(((i + 1) / steps.length) * 100);
      
      const label = getFilingStepLabel(step);
      setFilingLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${label}`]);
      
      // Delay to simulate computation/network
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (step === 'CALCULATING_STAMP') {
        const randStamp = Math.floor(200 + Math.random() * 800);
        setFilingLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Stamp duty calculated: ₹${randStamp} (Court Fee Act Schedule I-A)`]);
      }
      if (step === 'PAYING_STAMP') {
        setFilingLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] e-GRAS GRN generated: GRN-HR-${Math.floor(1000000 + Math.random() * 9000000)}`]);
      }
      if (step === 'SIGNING') {
        setFilingLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Digital signature verified by Haryana NIC Authority.`]);
      }
    }

    const genCRN = `CRN-HR-${Math.floor(100000 + Math.random() * 900000)}`;
    setFinalCRN(genCRN);
    setFilingLogs(prev => [...prev, `[SUCCESS] Secure receipt generated. Allocated Case Registration Number: ${genCRN}`]);
  };

  return (
    <div className="w-full relative text-white py-4">
      {/* Scope Subtitle banner */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-violet/10 border border-brand-violet/20 text-xs font-semibold text-brand-violet mb-6">
        <Award className="w-3.5 h-3.5" />
        Haryana Jurisdictional Filing Subsystem
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Template Selector & Forms Wizard (Column Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <h3 className="text-xl font-bold font-sans tracking-wide mb-2">Automated Filing Wizard</h3>
            <p className="text-muted-text text-sm mb-6">
              Generate legal notices, petitions, and affidavits formatted directly for Haryana Courts (Districts & High Court).
            </p>

            {/* Selection tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
              {HARYANA_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={cn(
                    "flex flex-col items-start p-3 rounded-lg text-left transition-all duration-300 border text-xs font-mono",
                    selectedTemplateId === template.id
                      ? "bg-brand-violet/10 border-brand-violet/40 text-white"
                      : "bg-black/20 border-white/5 text-muted-text hover:border-white/10 hover:text-white"
                  )}
                >
                  <span className="font-semibold text-xs mb-1 truncate w-full">{template.name}</span>
                  <span className="opacity-60 line-clamp-1">{template.description}</span>
                </button>
              ))}
            </div>

            {/* Wizard Form fields */}
            <div className="space-y-4">
              {activeTemplate.fields.map(field => (
                <div key={field.name} className="space-y-1.5">
                  <label className="block text-xs font-mono text-muted-text uppercase tracking-wider">
                    {field.label} {field.required && <span className="text-brand-crimson">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      rows={4}
                      className="w-full rounded-lg bg-black/40 backdrop-blur-md border border-white/5 px-4 py-3 text-white placeholder-neutral-500 transition-all duration-300 font-sans text-sm focus:outline-none focus:border-brand-violet/40 focus:ring-1 focus:ring-brand-violet/20 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] resize-none"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full rounded-lg bg-black/40 backdrop-blur-md border border-white/5 px-4 py-3 text-white placeholder-neutral-500 transition-all duration-300 font-sans text-sm focus:outline-none focus:border-brand-violet/40 focus:ring-1 focus:ring-brand-violet/20 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                    >
                      <option value="" disabled className="bg-neutral-900 text-neutral-500">
                        {field.placeholder}
                      </option>
                      {field.name === 'district' ? (
                        ['Gurugram', 'Faridabad', 'Rohtak', 'Panchkula', 'Ambala', 'Karnal', 'Panipat', 'Hisar', 'Sonipat'].map(d => (
                          <option key={d} value={d} className="bg-neutral-900 text-white">{d}</option>
                        ))
                      ) : (
                        ['Non-Payment of Rent', 'Personal Requirement', 'Subletting Premises', 'Nuisance/Property Damage'].map(g => (
                          <option key={g} value={g} className="bg-neutral-900 text-white">{g}</option>
                        ))
                      )}
                    </select>
                  ) : (
                    <GlassInput
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      glowColor="violet"
                    />
                  )}
                </div>
              ))}

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={startFilingSimulation}
                  disabled={filingStatus !== null && filingStatus !== 'COMPLETED'}
                  className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold font-mono bg-brand-violet text-white hover:bg-brand-violet/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                >
                  {filingStatus && filingStatus !== 'COMPLETED' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Filing in Progress...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Execute Secure Filing
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time preview & Telemetry log (Column Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Document Preview Card */}
          <div className="glass-panel p-5 rounded-2xl relative">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 select-none">
              <span className="flex items-center gap-2 text-xs font-mono text-brand-violet uppercase font-semibold">
                <FileText className="w-4 h-4" /> Live Document Stream
              </span>
              <span className="text-[10px] font-mono text-neutral-500">FORMAT: PDF-DRAFT</span>
            </div>
            
            <div className="h-[250px] overflow-y-auto bg-black/20 p-4 rounded-lg border border-white/5 font-mono text-[10px] whitespace-pre-wrap leading-relaxed text-neutral-300">
              {generatedDraft}
            </div>
          </div>

          {/* Telemetry Process Card */}
          <AnimatePresence>
            {filingStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <TerminalCard title="registry://haryana-efile.telemetry" glowColor="violet">
                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-brand-violet font-semibold mb-1">
                      <span>Haryana Upload Queue</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-brand-violet h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Logs */}
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 scrollbar-thin text-[11px] font-mono text-neutral-400">
                    {filingLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "transition-all duration-300",
                          log.startsWith('[SUCCESS]') && "text-brand-emerald font-bold",
                          log.includes('Stamp duty') && "text-brand-cyan",
                          log.includes('NIC Authority') && "text-brand-violet"
                        )}
                      >
                        {log}
                      </div>
                    ))}
                  </div>

                  {/* Allocated CRN details */}
                  {finalCRN && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mt-4 p-3 rounded-lg bg-brand-emerald/10 border border-brand-emerald/20 text-xs flex flex-col gap-1 text-brand-emerald"
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Haryana Filing Confirmed
                      </div>
                      <div className="font-mono text-[11px] mt-1 text-white">
                        <span className="text-brand-emerald opacity-80">CRN:</span> {finalCRN}
                      </div>
                      <div className="font-mono text-[9px] text-neutral-400 truncate">
                        <span className="text-brand-emerald opacity-80 font-semibold">SIG_HASH:</span> {activeTemplate.id === 'hr-affidavit' ? '0x8f2d91a9b2c3d4' : '0xe3b0c44298fc'}...
                      </div>
                    </motion.div>
                  )}
                </TerminalCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
