interface HeroProps {
  t: (key: string) => string;
  setView: (view: any) => void;
}

export function Hero({ t, setView }: HeroProps) {
  return (
    <div className="relative py-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
      </div>
      
      <div className="relative text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Powered by Gemini 3.1
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
          {t("appName")} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {t("tagline")}
          </span>
        </h1>
        
        <p className="max-w-xl mx-auto text-lg text-slate-500 font-medium leading-relaxed">
          Get instant AI solutions for tech, home repair, career, and more. 
          Upload photos, use voice, or chat to solve any problem.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => setView("solver")}
            className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl active:scale-95"
          >
            Start Solving
          </button>
          <button 
            onClick={() => setView("community")}
            className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-200 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all active:scale-95"
          >
            Browse Community
          </button>
        </div>
      </div>
    </div>
  );
}
