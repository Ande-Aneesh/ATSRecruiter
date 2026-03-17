/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Landing from './components/Landing';
import Upload from './components/Upload';
import Dashboard from './components/Dashboard';
import { AnalysisResult } from './types';

export default function App() {
  const [step, setStep] = useState<'landing' | 'upload' | 'dashboard'>('landing');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [resumeTextContext, setResumeTextContext] = useState<string>('');

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-blue-500/30">
      {step === 'landing' && <Landing onStart={() => setStep('upload')} />}
      {step === 'upload' && (
        <Upload 
          onComplete={(result, context) => {
            setAnalysisResult(result);
            setResumeTextContext(context);
            setStep('dashboard');
          }} 
        />
      )}
      {step === 'dashboard' && analysisResult && (
        <Dashboard result={analysisResult} resumeContext={resumeTextContext} onRestart={() => setStep('landing')} />
      )}
    </div>
  );
}

