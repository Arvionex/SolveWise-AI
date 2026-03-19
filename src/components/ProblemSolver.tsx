import { useState, useEffect, useRef } from "react";
import { UserProfile, Language } from "../types";
import { solveProblem } from "../services/ai";
import { Loader2, ArrowLeft, Send, CheckCircle2, AlertCircle, IndianRupee, Zap, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

interface ProblemSolverProps {
  user: any;
  profile: UserProfile | null;
  lang: Language;
  t: (key: string) => string;
  category: string;
  setView: (view: any) => void;
}

export function ProblemSolver({ user, profile, lang, t, category, setView }: ProblemSolverProps) {
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = lang === "hi" ? "hi-IN" : "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setProblem((prev) => prev + (prev ? " " : "") + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          setError("Microphone permission denied. Please enable it in your browser settings.");
        } else {
          setError("Speech recognition failed. Please try again.");
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [lang]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        setError("Speech recognition is not supported in your browser.");
        return;
      }
      setError("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start recognition", err);
        setIsListening(false);
      }
    }
  };

  const handleSolve = async () => {
    if (!problem.trim()) return;
    if (!user) {
      setError("Please login to solve problems");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const solution = await solveProblem(problem, category);
      setResult(solution);

      // Save to Firestore
      try {
        await addDoc(collection(db, "problems"), {
          user_id: user.uid,
          problem_text: problem,
          ai_solution: JSON.stringify(solution),
          category,
          is_public: true,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, "problems");
      }
    } catch (err: any) {
      if (err.message === "API_KEY_MISSING") {
        setError("Gemini API Key is missing. Please set GEMINI_API_KEY in your environment variables.");
      } else {
        setError("Failed to generate solution. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={() => setView("home")}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-bold transition-all group"
      >
        <div className="p-2 bg-white rounded-full shadow-sm group-hover:bg-blue-50 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Back to Home
      </button>

      <div className="glass p-8 rounded-[2.5rem] shadow-2xl mb-12 border-white/40">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Send className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Solve your {category} problem
          </h2>
        </div>
        
        <div className="relative">
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full h-40 p-6 pr-16 bg-white/50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-lg font-medium"
          />
          <button
            onClick={toggleListening}
            className={`absolute right-4 bottom-4 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isListening 
                ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse" 
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
            title={isListening ? "Stop Listening" : "Start Voice Input"}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          
          <AnimatePresence>
            {isListening && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-6 bottom-4 flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-widest"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Listening...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-red-500 font-bold text-sm mt-4 px-2"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
        
        <button
          onClick={handleSolve}
          disabled={loading || !problem.trim()}
          className="w-full mt-6 gradient-bg text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-white" />}
          {t("solveBtn")}
        </button>
      </div>

      {result && (
        <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="glass p-10 rounded-[3rem] shadow-2xl border-white/50 relative overflow-hidden">
            {/* Decorative Gradient Blob */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl" />
            
            <div className="flex items-center gap-3 text-blue-600 mb-10">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black tracking-tight">AI Solution Found</h3>
            </div>

            <div className="grid gap-10">
              <section>
                <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  {t("summary")}
                </h4>
                <p className="text-xl text-slate-900 font-bold leading-relaxed">{result.summary}</p>
              </section>

              <section>
                <h4 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  {t("causes")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.causes.map((cause: string, i: number) => (
                    <div key={i} className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-emerald-900 font-bold text-sm">
                      {cause}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-xs font-black text-purple-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                  {t("steps")}
                </h4>
                <div className="space-y-6">
                  {result.steps.map((step: string, i: number) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="w-10 h-10 gradient-bg rounded-2xl flex items-center justify-center text-white font-black shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        {i + 1}
                      </div>
                      <p className="text-slate-700 font-medium text-lg leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              {result.cost && (
                <section className="pt-8 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                      <IndianRupee className="w-6 h-6" />
                    </div>
                    <span className="font-black text-slate-500 uppercase tracking-widest text-xs">{t("cost")}</span>
                  </div>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">{result.cost}</span>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
