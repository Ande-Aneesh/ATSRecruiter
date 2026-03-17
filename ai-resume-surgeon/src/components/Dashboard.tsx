import { motion } from 'motion/react';
import { AnalysisResult } from '../types';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';
import Chat from './Chat';

export default function Dashboard({ result, resumeContext, onRestart }: { result: AnalysisResult, resumeContext: string, onRestart: () => void }) {
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">AI</span>
          Resume Surgeon
        </h1>
        <button 
          onClick={onRestart}
          className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Start Over
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scores & Keywords */}
        <div className="space-y-6">
          {/* Scores Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-white/10 rounded-3xl p-6"
          >
            <h2 className="text-lg font-semibold mb-6 text-gray-200">Overall Assessment</h2>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 bg-black/50 rounded-2xl p-4 border border-white/5">
                <div className="text-sm text-gray-500 mb-1">ATS Score</div>
                <div className="text-4xl font-display font-bold text-blue-400">{result.atsScore}</div>
              </div>
              <div className="flex-1 bg-black/50 rounded-2xl p-4 border border-white/5">
                <div className="text-sm text-gray-500 mb-1">Recruiter Score</div>
                <div className="text-4xl font-display font-bold text-indigo-400">{result.recruiterScore}</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {result.scoreExplanation}
            </p>
          </motion.div>

          {/* Keywords Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#111] border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-200">Keyword Gap Analysis</h2>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium">
                {result.keywords.matchPercentage}% Match
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Matched
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.matched.map((kw, i) => (
                    <span key={i} className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-md">
                      {kw}
                    </span>
                  ))}
                  {result.keywords.matched.length === 0 && <span className="text-gray-500 text-sm">None detected</span>}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Missing
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.missing.map((kw, i) => (
                    <span key={i} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-md">
                      {kw}
                    </span>
                  ))}
                  {result.keywords.missing.length === 0 && <span className="text-gray-500 text-sm">None missing</span>}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Strengths & Weaknesses */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#111] border border-white/10 rounded-3xl p-6"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-200">Strengths & Weaknesses</h2>
            <div className="space-y-6">
              <div>
                {result.strengths.map((s, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex items-start gap-2 text-emerald-400 text-sm font-medium mb-1">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      {s.point}
                    </div>
                    <p className="text-xs text-gray-500 pl-6">{s.reasoning}</p>
                  </div>
                ))}
              </div>
              <div className="h-px bg-white/10" />
              <div>
                {result.weaknesses.map((w, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex items-start gap-2 text-amber-400 text-sm font-medium mb-1">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      {w.point}
                    </div>
                    <p className="text-xs text-gray-500 pl-6">{w.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Middle Column: Rewrites & Suggestions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bullet Point Rewrites */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-xl font-display font-bold mb-6 text-white">Bullet Point Rewrites</h2>
            <div className="space-y-6">
              {result.rewrites.map((rw, i) => (
                <div key={i} className="bg-black/40 border border-white/5 rounded-2xl p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Before</div>
                      <p className="text-sm text-gray-400 line-through decoration-red-500/50">{rw.original}</p>
                    </div>
                    <div className="hidden md:flex items-center justify-center -mx-4">
                      <ArrowRight className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 mt-4 md:mt-0">After</div>
                      <p className="text-sm text-gray-100 font-medium">{rw.rewritten}</p>
                    </div>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
                    <p className="text-xs text-blue-300"><span className="font-semibold">Why:</span> {rw.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Actionable Suggestions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-xl font-display font-bold mb-6 text-white">Action Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.suggestions.map((s, i) => (
                <div key={i} className="flex gap-4 bg-black/40 border border-white/5 rounded-2xl p-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 font-mono text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-200 mb-1">{s.step}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{s.whyItMatters}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Chat Mentor */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[500px]"
          >
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-200">AI Career Mentor</h3>
                <p className="text-xs text-gray-400">Ask anything about your resume or career</p>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <Chat resumeContext={resumeContext} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
