import { motion } from "motion/react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-10 h-10">
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Shield Base */}
          <path
            d="M50 5 L15 20 V50 C15 75 50 95 50 95 C50 95 85 75 85 50 V20 L50 5Z"
            fill="url(#logo-gradient)"
            className="drop-shadow-lg"
          />
          
          {/* Brain Pattern / AI Circuits */}
          <path
            d="M50 25 C35 25 25 35 25 50 C25 65 35 75 50 75 C65 75 75 65 75 50 C75 35 65 25 50 25 Z"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="4 2"
            opacity="0.3"
          />
          
          {/* Central Intelligence Core */}
          <circle cx="50" cy="50" r="12" fill="white" className="animate-pulse" />
          <circle cx="50" cy="50" r="6" fill="url(#logo-gradient)" />
          
          {/* Circuit Lines */}
          <path d="M50 38 V25" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M50 62 V75" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M38 50 H25" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M62 50 H75" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>
      
      {showText && (
        <motion.span 
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-black tracking-tighter text-slate-900"
        >
          SolveWise <span className="text-blue-600">AI</span>
        </motion.span>
      )}
    </div>
  );
}
