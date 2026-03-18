import { useState, useEffect } from "react";
import { Problem, Language } from "../types";
import { Users, Search, MessageSquare } from "lucide-react";
import { getMockProblems } from "../mockData";

interface CommunityProps {
  lang: Language;
  t: (key: string) => string;
}

export function Community({ lang, t }: CommunityProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      const p = await getMockProblems();
      setProblems(p.filter(problem => problem.is_public));
      setLoading(false);
    };
    fetchProblems();
  }, []);

  const filteredProblems = problems.filter(p => 
    p.problem_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
          <Users className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {t("community")}
        </h2>
      </div>

      <div className="relative mb-12 group">
        <input 
          type="text" 
          placeholder="Search community solutions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] shadow-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-lg font-medium"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-emerald-600 transition-colors" />
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 glass animate-pulse rounded-[2.5rem]"></div>
          ))}
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="text-center py-20 glass rounded-[3rem] border-dashed border-slate-200">
          <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <p className="text-xl font-bold text-slate-400">No solutions found matching your search.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredProblems.map((p) => {
            const solution = JSON.parse(p.ai_solution);
            return (
              <div 
                key={p.id} 
                className="glass p-8 rounded-[3rem] shadow-xl border-white/40 hover:shadow-2xl transition-all"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1.5 rounded-full">
                    {p.category}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight">{p.problem_text}</h3>
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-slate-700 font-medium italic leading-relaxed">"{solution.summary}"</p>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      <MessageSquare className="w-3 h-3" />
                    </div>
                    <span>Helpful AI Solution</span>
                  </div>
                  <span>{new Date(p.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
