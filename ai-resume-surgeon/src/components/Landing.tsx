import { motion } from 'motion/react';
import { FileText, Sparkles, Target, ArrowRight } from 'lucide-react';

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 text-center max-w-4xl px-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-400 mb-8">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Resume Analysis</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-display">
          Your Resume Isn't Rejected.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            It's Misunderstood.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Analyze, improve, and optimize your resume with AI that thinks like a recruiter and beats the ATS.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg overflow-hidden cursor-pointer"
        >
          <span className="relative z-10 flex items-center gap-2">
            Upload Resume <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="z-10 mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl px-6"
      >
        {[
          { icon: Target, title: "ATS Optimization", desc: "Discover missing keywords and format issues blocking your application." },
          { icon: FileText, title: "Smart Rewrites", desc: "Transform weak bullet points into high-impact, quantified achievements." },
          { icon: Sparkles, title: "Career Mentor", desc: "Chat with an AI trained on thousands of successful tech resumes." }
        ].map((feature, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
