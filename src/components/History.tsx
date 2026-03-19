import { useState, useEffect } from "react";
import { Problem, Language } from "../types";
import { Clock, ChevronRight, MessageSquare } from "lucide-react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

interface HistoryProps {
  user: any;
  lang: Language;
  t: (key: string) => string;
}

export function History({ user, lang, t }: HistoryProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "problems"),
      where("user_id", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const p = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Problem));
      setProblems(p);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "problems");
    });

    return () => unsubscribe();
  }, [user?.uid]);

  if (!user) return <div className="text-center py-12 font-bold text-slate-500">Please login to see history</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
          <Clock className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {t("history")}
        </h2>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 glass animate-pulse rounded-[2rem]"></div>
          ))}
        </div>
      ) : problems.length === 0 ? (
        <div className="glass p-16 rounded-[3rem] border-dashed border-slate-300 text-center">
          <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <p className="text-xl font-bold text-slate-400">No problems solved yet.</p>
          <p className="text-slate-400 mt-2">Your AI solutions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {problems.map((p) => {
            const solution = JSON.parse(p.ai_solution);
            return (
              <div 
                key={p.id}
                className="glass p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all cursor-pointer group border-white/40"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-3 py-1.5 rounded-full">
                    {p.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {new Date(p.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{p.problem_text}</h3>
                <p className="text-slate-500 font-medium line-clamp-2 leading-relaxed">{solution.summary}</p>
                <div className="mt-6 flex items-center justify-end text-blue-600 font-black text-sm group-hover:translate-x-2 transition-transform">
                  View Full Solution <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
