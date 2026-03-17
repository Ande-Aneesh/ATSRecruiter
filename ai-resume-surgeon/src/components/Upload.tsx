import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';
import { analyzeResume } from '../services/ai';
import { AnalysisResult } from '../types';

export default function Upload({ onComplete }: { onComplete: (result: AnalysisResult, context: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a resume first.');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          const result = await analyzeResume(base64, file.type, jobDesc);
          const context = `Resume provided. Job Description: ${jobDesc || 'None provided'}. ATS Score: ${result.atsScore}. Strengths: ${result.strengths.map(s => s.point).join(', ')}.`;
          onComplete(result, context);
        } catch (err: any) {
          setError(err.message || 'Failed to analyze resume. Please try again.');
          setIsAnalyzing(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read file.');
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <h2 className="text-3xl font-display font-bold mb-2 text-white">Upload Resume</h2>
        <p className="text-gray-400 mb-8">Let our AI recruiter analyze your profile.</p>

        <div 
          onClick={() => !isAnalyzing && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-blue-400 bg-blue-400/10' :
            file ? 'border-blue-500 bg-blue-500/5' : 'border-white/20 hover:border-white/40 hover:bg-white/5'
          } ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".pdf,.doc,.docx" 
            className="hidden" 
          />
          
          {file ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <File className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-lg font-medium text-white">{file.name}</p>
              <p className="text-sm text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium mb-1 text-white">Click or drag file to upload</p>
              <p className="text-sm text-gray-500">Supports PDF, DOCX (Max 5MB)</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target Job Description (Optional)
          </label>
          <textarea 
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job description here for tailored ATS keyword analysis..."
            className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            disabled={isAnalyzing}
          />
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !file}
          className="w-full mt-8 py-4 bg-white text-black rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing like a recruiter...
            </>
          ) : (
            'Analyze Resume'
          )}
        </button>
      </motion.div>
    </div>
  );
}
